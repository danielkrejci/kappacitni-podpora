import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { DeviceType, EMPTY_DEVICE_TYPE } from '../../../../api/models/DeviceType'
import { ServiceCaseCreated, ServiceCaseType, EMPTY_SERVICE_CASE_CREATED, ServiceCaseForm } from '../../../../api/models/ServiceCase'
import { isApiError } from '../../../../api/services/ApiService'
import { DeviceService } from '../../../../api/services/DeviceService'
import { ServiceCaseService } from '../../../../api/services/ServiceCaseService'
import { showAlertDialog, AlertDialogType } from '../../../../common/components/AlertDialog'
import { Field } from '../../../../common/forms/Field'
import { Form } from '../../../../common/forms/Form'
import { ListUtils } from '../../../../common/utils/ListUtils'
import { SelectFieldUtils } from '../../../../common/utils/SelectFieldUtils'
import { ValidationUtils } from '../../../../common/utils/ValidationUtils'

export class ServiceCaseFormStore {
    isLoading = false

    initDone = false

    saved: ServiceCaseCreated = EMPTY_SERVICE_CASE_CREATED

    selectedDevice: DeviceType = EMPTY_DEVICE_TYPE

    codetables = {
        deviceTypes: [] as DeviceType[],
        caseTypes: [] as ServiceCaseType[],
    }

    form = {
        caseType: Field.select('caseType', SelectFieldUtils.optionNotSelected(), () => [SelectFieldUtils.optionNotSelected()]),
        serialNumber: Field.text('serialNumber', 'SI2E26ZDBD6YVKQ'),
        message: Field.text('message', 'Nejde zapnout'),
        name: Field.text('name', 'Daniel'),
        surname: Field.text('surname', 'Krejčí'),
        email: Field.text('email', 'daniel-krejci@seznam.cz'),
        phonePrefix: Field.select('phonePrefix', { code: '+420', value: '+420' }, () => [
            { code: '+420', value: '+420' },
            { code: '+421', value: '+421' },
        ]),
        phone: Field.text('phone'),
        street: Field.text('street'),
        houseNumber: Field.text('houseNumber'),
        city: Field.text('city'),
        postalCode: Field.text('postalCode'),
        terms: Field.bool('terms'),
    }

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            codetables: observable,
            selectedDevice: observable,
            saved: observable,
            initDone: observable,
            init: action,
            save: action,
            reset: action,
            validate: action,
            validateAddress: action,
            isSaved: computed,
            isValid: computed,
        })
    }

    init(deviceName: string) {
        this.initDone = true
        this.loadCodetables(deviceName)
    }

    loadCodetables(deviceName: string) {
        this.isLoading = true

        Promise.all([DeviceService.getDeviceTypes(), ServiceCaseService.getServiceCaseTypes()]).then(data =>
            runInAction(() => {
                if (!isApiError(data[0])) {
                    this.codetables.deviceTypes = ListUtils.asList(data[0])
                }

                if (!isApiError(data[1])) {
                    this.codetables.caseTypes = ListUtils.asList(data[1])
                }

                this.selectedDevice =
                    this.codetables.deviceTypes.find(device => device.name.toLocaleLowerCase() === deviceName.toLocaleLowerCase()) ||
                    EMPTY_DEVICE_TYPE

                SelectFieldUtils.initFieldSelect(
                    this.form.caseType,
                    this.codetables.caseTypes.map(item => ({ code: item.code, value: item.value })),
                    false,
                    false,
                    true
                )
                this.isLoading = false
            })
        )
    }

    save() {
        if (this.validate()) {
            this.isLoading = true

            const data: ServiceCaseForm = {
                deviceTypeId: this.selectedDevice.code.toLocaleString(),
                caseTypeId: this.form.caseType.value.code,
                serialNumber: this.form.serialNumber.value,
                message: this.form.message.value,
                name: this.form.name.value,
                surname: this.form.surname.value,
                email: this.form.email.value,
                phone: this.form.phone.value ? `${this.form.phonePrefix.value.value}${this.form.phone.value}` : '',
                street: this.form.street.value,
                houseNumber: this.form.houseNumber.value,
                city: this.form.city.value,
                postalCode: this.form.postalCode.value,
            }

            ServiceCaseService.createServiceCase(data)
                .then(result =>
                    runInAction(() => {
                        if (isApiError(result)) {
                            showAlertDialog('Chyba', result.cause, AlertDialogType.Danger)
                        } else {
                            this.isLoading = false
                            this.saved = {
                                id: result.id,
                                hash: result.hash,
                                email: data.email,
                            }
                            this.reset()
                        }
                    })
                )
                .finally(() =>
                    runInAction(() => {
                        this.isLoading = false
                    })
                )
        }
    }

    get isSaved(): boolean {
        return this.saved.id !== '' && this.saved.hash !== ''
    }

    get isValid(): boolean {
        return Form.isValid(this.form)
    }

    validate(): boolean {
        Form.resetAllValidations(this.form)

        ValidationUtils.requiredSelect(this.form.caseType)
        ValidationUtils.required(this.form.serialNumber)
        ValidationUtils.required(this.form.message)
        ValidationUtils.maxLength(this.form.message, 5000)
        ValidationUtils.required(this.form.name)
        ValidationUtils.required(this.form.surname)
        ValidationUtils.required(this.form.email)
        ValidationUtils.email(this.form.email)
        ValidationUtils.checked(this.form.terms)

        if (this.form.phone.value.length > 0) {
            ValidationUtils.phone(this.form.phone)
        }

        this.validateAddress()

        return Form.isValid(this.form)
    }

    validateAddress() {
        this.form.street.validation.reset()
        this.form.houseNumber.validation.reset()
        this.form.city.validation.reset()
        this.form.postalCode.validation.reset()

        if (
            (this.form.street.value === '' ||
                this.form.houseNumber.value === '' ||
                this.form.city.value === '' ||
                this.form.postalCode.value === '') &&
            (this.form.street.value !== '' ||
                this.form.houseNumber.value !== '' ||
                this.form.city.value !== '' ||
                this.form.postalCode.value !== '')
        ) {
            if (this.form.street.value === '') ValidationUtils.required(this.form.street)
            if (this.form.houseNumber.value === '') ValidationUtils.required(this.form.houseNumber)
            if (this.form.city.value === '') ValidationUtils.required(this.form.city)
            if (this.form.postalCode.value === '') ValidationUtils.required(this.form.postalCode)
        }

        if (
            this.form.street.value !== '' &&
            this.form.houseNumber.value !== '' &&
            this.form.city.value !== '' &&
            this.form.postalCode.value !== ''
        ) {
            ValidationUtils.postalCode(this.form.postalCode)
        }
    }

    reset() {
        this.form.serialNumber.value = ''
        this.form.message.value = ''
        this.form.name.value = ''
        this.form.surname.value = ''
        this.form.email.value = ''
        this.form.phone.value = ''
        this.form.street.value = ''
        this.form.houseNumber.value = ''
        this.form.city.value = ''
        this.form.postalCode.value = ''
    }
}
