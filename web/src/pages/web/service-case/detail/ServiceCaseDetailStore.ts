import { action, makeObservable, observable, runInAction } from 'mobx'
import { DeviceType } from '../../../../api/models/DeviceType'
import { ServiceCaseDetail, EMPTY_SERVICE_CASE_DETAIL, ServiceCaseType, ServiceCaseStates } from '../../../../api/models/ServiceCase'
import { ServiceCaseMessageForm } from '../../../../api/models/ServiceCaseMessage'
import { isApiError } from '../../../../api/services/ApiService'
import { DeviceService } from '../../../../api/services/DeviceService'
import { ServiceCaseService } from '../../../../api/services/ServiceCaseService'
import { Field } from '../../../../common/forms/Field'
import { Form } from '../../../../common/forms/Form'
import { SelectField } from '../../../../common/forms/SelectField'
import { ListUtils } from '../../../../common/utils/ListUtils'
import { ValidationUtils } from '../../../../common/utils/ValidationUtils'

export class ServiceCaseDetailStore {
    isLoading = false

    initDone = false

    serviceCase: ServiceCaseDetail = EMPTY_SERVICE_CASE_DETAIL

    codetables = {
        deviceTypes: [] as DeviceType[],
        caseTypes: [] as ServiceCaseType[],
        caseStates: [] as SelectField[],
    }

    form = {
        message: Field.text('message'),
    }

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            codetables: observable,
            serviceCase: observable,
            initDone: observable,
            init: action,
            save: action,
            reset: action,
            validate: action,
        })
    }

    init(id: string, hash: string) {
        this.initDone = true
        this.load(id, hash)
    }

    load(id: string, hash: string) {
        this.isLoading = true

        Promise.all([DeviceService.getDeviceTypes(), ServiceCaseService.getServiceCaseTypes(), ServiceCaseService.getServiceCase(id, hash)])
            .then(data =>
                runInAction(() => {
                    if (!isApiError(data[0])) {
                        this.codetables.deviceTypes = ListUtils.asList(data[0])
                    }

                    if (!isApiError(data[1])) {
                        this.codetables.caseTypes = ListUtils.asList(data[1])
                    }

                    if (!isApiError(data[2])) {
                        this.serviceCase = data[2]
                    }

                    this.codetables.caseStates = ServiceCaseStates
                })
            )
            .finally(() => {
                runInAction(() => {
                    this.isLoading = false
                })
            })
    }

    reloadServiceCase() {
        this.isLoading = true
        ServiceCaseService.getServiceCase(this.serviceCase.serviceCase.id, this.serviceCase.serviceCase.hash)
            .then(data =>
                runInAction(() => {
                    if (!isApiError(data)) {
                        this.serviceCase = data
                    }
                })
            )
            .finally(() => {
                this.isLoading = false
            })
    }

    save() {
        if (this.validate()) {
            this.isLoading = true

            const message: ServiceCaseMessageForm = {
                hash: this.serviceCase.serviceCase.hash,
                userId: this.serviceCase.client.id,
                message: this.form.message.value,
            }

            ServiceCaseService.createMessage(this.serviceCase.serviceCase.id, message)
                .then(data =>
                    runInAction(() => {
                        this.isLoading = false
                        if (!isApiError(data)) {
                            this.reset()
                            this.reloadServiceCase()
                        }
                    })
                )
                .finally(() => {
                    this.isLoading = false
                })
        }
    }

    validate(): boolean {
        Form.resetAllValidations(this.form)

        ValidationUtils.required(this.form.message)
        ValidationUtils.maxLength(this.form.message, 5000)

        return Form.isValid(this.form)
    }

    reset() {
        this.form.message.value = ''
    }

    get getState(): string {
        const state = this.serviceCase.serviceCase.stateId
        if (state && Number(state) > 0) {
            return this.codetables.caseStates[Number(state)]?.value ?? ''
        }
        return ''
    }

    get getCategory(): string {
        const category = this.serviceCase.serviceCase.caseTypeId
        if (category && Number(category) > 0) {
            return this.codetables.caseTypes[Number(category)]?.value ?? ''
        }
        return ''
    }
}
