import { action, makeObservable, observable, runInAction } from 'mobx'
import { ServiceCaseCaseOperatorChange } from '../../../../../api/models/ServiceCase'
import { User } from '../../../../../api/models/User'
import { isApiError } from '../../../../../api/services/ApiService'
import { ServiceCaseService } from '../../../../../api/services/ServiceCaseService'
import { showAlertDialog, AlertDialogType } from '../../../../../common/components/AlertDialog'
import { YesNoDialogStore } from '../../../../../common/components/YesNoDialog'
import { AdminServiceCaseDetailStore } from '../AdminServiceCaseDetailStore'

export class RemoveOperatorDialogStore extends YesNoDialogStore {
    selectedUser?: User

    parentStore: AdminServiceCaseDetailStore

    constructor(parentStore: AdminServiceCaseDetailStore) {
        super()
        this.parentStore = parentStore
        makeObservable(this, {
            selectedUser: observable,
            delete: action,
            init: action,
            reset: action,
        })
    }

    init(user: User) {
        this.selectedUser = user
    }

    delete() {
        if (this.selectedUser) {
            if (!this.parentStore.actionsDisabled) {
                this.parentStore.isLoading = true

                const data: ServiceCaseCaseOperatorChange = {
                    userId: `${this.selectedUser.id}`,
                }

                ServiceCaseService.removeOperator(this.parentStore.serviceCase.serviceCase.id, data)
                    .then(data =>
                        runInAction(() => {
                            this.parentStore.isLoading = false
                            if (!isApiError(data)) {
                                this.parentStore.reloadServiceCase()
                            } else {
                                showAlertDialog('Chyba', data.cause, AlertDialogType.Danger)
                            }
                        })
                    )
                    .finally(() => {
                        this.parentStore.isLoading = false
                    })
            }
        }
    }

    reset() {
        this.selectedUser = undefined
    }
}
