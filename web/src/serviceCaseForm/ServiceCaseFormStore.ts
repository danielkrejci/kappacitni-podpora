import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { DeviceType, EMPTY_DEVICE_TYPE } from '../api/models/DeviceType'
import { ServiceCaseForm } from '../api/models/ServiceCase'
import { ServiceCaseType } from '../api/models/ServiceCaseType'
import { DeviceService } from '../api/services/DeviceService'
import { ServiceCaseService } from '../api/services/ServiceCaseService'
import { Field } from '../common/forms/Field'
import { ListUtils } from '../common/utils/ListUtils'
import { SelectFieldUtils } from '../common/utils/SelectFieldUtils'

export class ServiceCaseFormStore {
    isLoading = false

    selectedDevice: DeviceType = EMPTY_DEVICE_TYPE

    codetables = {
        deviceTypes: [] as DeviceType[],
        caseTypes: [] as ServiceCaseType[],
    }

    form = {
        caseType: Field.select('caseType', SelectFieldUtils.optionNotSelected(), () => [SelectFieldUtils.optionNotSelected()]),
        serialNumber: Field.text('serialNumber', 'SI2E26ZDBD6YVKQ'),
        message: Field.text('message'),
        name: Field.text('name'),
        surname: Field.text('surname'),
        email: Field.text('email'),
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
            init: action,
            save: action,
            reset: action,
            isValid: computed,
        })
    }

    init(deviceName: string) {
        this.loadCodetables(deviceName)
    }

    loadCodetables(deviceName: string) {
        this.isLoading = true

        Promise.all([DeviceService.getDeviceTypes(), ServiceCaseService.getServiceCaseTypes()]).then(data =>
            runInAction(() => {
                this.codetables.deviceTypes = ListUtils.asList(data[0])
                this.codetables.caseTypes = ListUtils.asList(data[1])

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
        this.isLoading = true

        const data: ServiceCaseForm = {
            deviceTypeId: this.selectedDevice.code.toLocaleString(),
            caseTypeId: this.form.caseType.value.code,
            serialNumber: this.form.serialNumber.value,
            message: this.form.message.value,
            name: this.form.name.value,
            surname: this.form.surname.value,
            email: this.form.email.value,
            phone: `${this.form.phonePrefix.value} ${this.form.phone.value}`,
            street: this.form.street.value,
            houseNumber: this.form.houseNumber.value,
            city: this.form.city.value,
            postalCode: this.form.postalCode.value,
        }

        ServiceCaseService.createServiceCase(data)
            .then(result =>
                runInAction(() => {
                    this.isLoading = false
                    this.reset()
                })
            )
            .catch(e => {
                console.log(e)
            })
    }

    get isValid(): boolean {
        return true
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
