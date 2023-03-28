import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { DeviceType } from '../../../../api/models/DeviceType'
import {
    ServiceCaseDetail,
    EMPTY_SERVICE_CASE_DETAIL,
    ServiceCaseType,
    ServiceCaseStates,
    ServiceCaseStateChange,
} from '../../../../api/models/ServiceCase'
import { ServiceCaseMessageForm } from '../../../../api/models/ServiceCaseMessage'
import { isApiError } from '../../../../api/services/ApiService'
import { DeviceService } from '../../../../api/services/DeviceService'
import { ServiceCaseService } from '../../../../api/services/ServiceCaseService'
import { authService } from '../../../../App'
import { Field } from '../../../../common/forms/Field'
import { Form } from '../../../../common/forms/Form'
import { ListUtils } from '../../../../common/utils/ListUtils'
import { ValidationUtils } from '../../../../common/utils/ValidationUtils'
import { ChangeCategoryDialogStore } from './dialog/ChangeCategoryDialogStore'
import { ChangeStateDialogStore } from './dialog/ChangeStateDialogStore'
import { AddOperatorDialogStore } from './dialog/AddOperatorDialogStore'
import { SelectField } from '../../../../common/forms/SelectField'
import { User, UserType } from '../../../../api/models/User'
import { UserService } from '../../../../api/services/UserService'
import { showAlertDialog, AlertDialogType } from '../../../../common/components/AlertDialog'
import { RemoveOperatorDialogStore } from './dialog/RemoveOperatorDialogStore'
import { LoggerDialogStore } from './dialog/LoggerDialogStore'

export class AdminServiceCaseDetailStore {
    isLoading = false

    serviceCase: ServiceCaseDetail = EMPTY_SERVICE_CASE_DETAIL

    loggerDialogStore = new LoggerDialogStore(this)
    stateDialogStore = new ChangeStateDialogStore(this)
    categoryDialogStore = new ChangeCategoryDialogStore(this)
    operatorDialogStore = new AddOperatorDialogStore(this)
    removeOperatorDialogStore = new RemoveOperatorDialogStore(this)

    codetables = {
        deviceTypes: [] as DeviceType[],
        caseTypes: [] as ServiceCaseType[],
        caseStates: [] as SelectField[],
        operators: [] as SelectField[],
    }

    form = {
        message: Field.text('message'),
    }

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            codetables: observable,
            serviceCase: observable,
            init: action,
            save: action,
            reOpen: action,
            reset: action,
            validate: action,
            showRemoveOperatorDialog: action,
            actionsDisabled: computed,
            getState: computed,
            getCategory: computed,
        })
    }

    init(id: string) {
        this.load(id)
    }

    load(id: string) {
        this.isLoading = true

        Promise.all([
            DeviceService.getDeviceTypes(),
            ServiceCaseService.getServiceCaseTypes(),
            ServiceCaseService.getAdminServiceCase(id),
            UserService.getUsers(UserType.OPERATOR),
        ])
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

                    if (!isApiError(data[3])) {
                        this.codetables.operators = data[3].map(user => ({
                            code: `${user.id}`,
                            value: `${user.name} ${user.surname}`,
                        }))
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
        ServiceCaseService.getAdminServiceCase(this.serviceCase.serviceCase.id)
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

    reOpen() {
        this.isLoading = true

        const data: ServiceCaseStateChange = {
            stateId: '2',
        }

        ServiceCaseService.changeState(this.serviceCase.serviceCase.id, data)
            .then(data =>
                runInAction(() => {
                    this.isLoading = false

                    if (!isApiError(data)) {
                        this.reloadServiceCase()
                    } else {
                        showAlertDialog('Chyba', data.cause, AlertDialogType.Danger)
                    }
                })
            )
            .finally(() => {
                runInAction(() => {
                    this.isLoading = false
                })
            })
    }

    showRemoveOperatorDialog(user: User, content: JSX.Element) {
        this.removeOperatorDialogStore.init(user)
        this.removeOperatorDialogStore.show(
            () =>
                runInAction(() => {
                    this.removeOperatorDialogStore.delete()
                }),
            () =>
                runInAction(() => {
                    this.removeOperatorDialogStore.reset()
                }),
            'Odebrat operátora?',
            AlertDialogType.Danger,
            content
        )
    }

    save() {
        if (!this.actionsDisabled) {
            if (this.validate()) {
                this.isLoading = true

                const message: ServiceCaseMessageForm = {
                    hash: this.serviceCase.serviceCase.hash,
                    userId: this.serviceCase.client.id,
                    message: this.form.message.value,
                }

                ServiceCaseService.createAdminMessage(this.serviceCase.serviceCase.id, message)
                    .then(data =>
                        runInAction(() => {
                            this.isLoading = false
                            if (!isApiError(data)) {
                                this.reset()
                                this.reloadServiceCase()
                            } else {
                                showAlertDialog('Chyba', data.cause, AlertDialogType.Danger)
                            }
                        })
                    )
                    .finally(() => {
                        this.isLoading = false
                    })
            }
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

    get actionsDisabled(): boolean {
        return (
            this.serviceCase.serviceCase.id === '' ||
            this.serviceCase.serviceCase.stateId.toString() === '4' ||
            !this.serviceCase.operators.map(operator => operator.id).includes(authService.authUser!.id)
        )
    }

    get getState(): string {
        const state = this.serviceCase.serviceCase.stateId
        if (state && Number(state) > 0) {
            return this.codetables.caseStates[Number(state) - 1]?.value ?? ''
        }
        return ''
    }

    get getCategory(): string {
        const category = this.serviceCase.serviceCase.caseTypeId
        if (category && Number(category) > 0) {
            return this.codetables.caseTypes[Number(category) - 1]?.value ?? ''
        }
        return ''
    }
}
