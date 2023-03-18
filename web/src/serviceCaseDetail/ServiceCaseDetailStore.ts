import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { DeviceType } from '../api/models/DeviceType'
import { EMPTY_SERVICE_CASE_DETAIL, ServiceCaseDetail } from '../api/models/ServiceCase'
import { ServiceCaseType } from '../api/models/ServiceCaseType'
import { isApiError } from '../api/services/ApiService'
import { DeviceService } from '../api/services/DeviceService'
import { ServiceCaseService } from '../api/services/ServiceCaseService'
import { Field } from '../common/forms/Field'
import { Form } from '../common/forms/Form'
import { ListUtils } from '../common/utils/ListUtils'
import { ValidationUtils } from '../common/utils/ValidationUtils'

export class ServiceCaseDetailStore {
    isLoading = false

    initDone = false

    saved: any = ''

    serviceCase: ServiceCaseDetail = EMPTY_SERVICE_CASE_DETAIL

    codetables = {
        deviceTypes: [] as DeviceType[],
        caseTypes: [] as ServiceCaseType[],
    }

    form = {
        message: Field.text('message'),
    }

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            codetables: observable,
            serviceCase: observable,
            saved: observable,
            initDone: observable,
            init: action,
            save: action,
            reset: action,
            validate: action,
            isSaved: computed,
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
                })
            )
            .finally(() => {
                this.isLoading = false
            })
    }

    save() {
        if (this.validate()) {
            this.isLoading = true

            Promise.resolve(true)
                .then(data =>
                    runInAction(() => {
                        console.log('Message saved')
                        this.saved = 'saved'
                    })
                )
                .finally(() => {
                    this.isLoading = false
                })
        }
    }

    get isSaved(): boolean {
        return this.saved !== ''
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
}