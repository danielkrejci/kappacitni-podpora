import { action, makeObservable, observable, runInAction } from 'mobx'
import { User } from '../../../../api/models/User'
import { isApiError } from '../../../../api/services/ApiService'
import { UserService } from '../../../../api/services/UserService'
import { AlertDialogType, showAlertDialog } from '../../../../common/components/AlertDialog'
import { YesNoDialogStore } from '../../../../common/components/YesNoDialog'
import { UserListStore } from '../UserListStore'

export class UserDeleteDialogStore extends YesNoDialogStore {
    selectedUser?: User

    parentStore: UserListStore

    constructor(parentStore: UserListStore) {
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
            this.parentStore.isLoading = true

            UserService.deleteOperator(this.selectedUser.id)
                .then(data =>
                    runInAction(() => {
                        this.parentStore.isLoading = false

                        this.parentStore.load()
                        this.reset()
                        this.hide()

                        if (isApiError(data)) {
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

    reset() {
        this.selectedUser = undefined
    }
}
