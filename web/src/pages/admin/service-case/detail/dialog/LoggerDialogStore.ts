import { action, makeObservable, observable, runInAction } from 'mobx'
import { ServiceCaseLog } from '../../../../../api/models/ServiceCase'
import { isApiError } from '../../../../../api/services/ApiService'
import { ServiceCaseService } from '../../../../../api/services/ServiceCaseService'
import { showAlertDialog, AlertDialogType } from '../../../../../common/components/AlertDialog'
import { DialogStore } from '../../../../../common/components/Dialog'
import { AdminServiceCaseDetailStore } from '../AdminServiceCaseDetailStore'

export class LoggerDialogStore extends DialogStore {
    parentStore: AdminServiceCaseDetailStore

    logs: ServiceCaseLog[] = []

    constructor(parentStore: AdminServiceCaseDetailStore) {
        super()
        this.parentStore = parentStore
        makeObservable(this, {
            logs: observable,
            init: action,
            load: action,
        })
    }

    init() {
        this.load()
    }

    load() {
        this.parentStore.isLoading = true

        ServiceCaseService.getServiceCaseLogs(this.parentStore.serviceCase.serviceCase.id)
            .then(data =>
                runInAction(() => {
                    this.parentStore.isLoading = false

                    if (!isApiError(data)) {
                        this.logs = data
                    } else {
                        showAlertDialog('Chyba', data.cause, AlertDialogType.Danger)
                    }
                })
            )
            .finally(() => {
                runInAction(() => {
                    this.parentStore.isLoading = false
                })
            })
    }
}
