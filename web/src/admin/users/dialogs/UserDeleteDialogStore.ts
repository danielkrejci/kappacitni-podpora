import { action, makeObservable, observable, runInAction } from 'mobx'
import { User } from '../../../api/models/User'
import { YesNoDialogStore } from '../../../common/components/YesNoDialog'
import { AdminUsersStore } from '../AdminUsersStore'

export class UserDeleteDialogStore extends YesNoDialogStore {
    selectedUser?: User

    parentStore: AdminUsersStore

    constructor(parentStore: AdminUsersStore) {
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
        this.parentStore.isLoading = true

        setTimeout(
            () =>
                runInAction(() => {
                    this.selectedUser = undefined
                    this.parentStore.isLoading = false
                    this.hide()
                }),
            2000
        )
    }

    reset() {
        this.selectedUser = undefined
    }
}
