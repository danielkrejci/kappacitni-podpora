import { action, makeObservable, observable, runInAction } from 'mobx'
import { User, UserType } from '../../../api/models/User'
import { isApiError } from '../../../api/services/ApiService'
import { UserService } from '../../../api/services/UserService'
import { navigationStore } from '../../../App'
import { AlertDialogType } from '../../../common/components/AlertDialog'
import { UserAddDialogStore } from './dialog/UserAddDialogStore'
import { UserDeleteDialogStore } from './dialog/UserDeleteDialogStore'
import { UserDetailDialogStore } from './dialog/UserDetailDialogStore'

export class UserListStore {
    isLoading = false

    initDone = false

    usersType?: UserType

    users: User[] = []

    detailDialogStore = new UserDetailDialogStore(this)
    deleteDialogStore = new UserDeleteDialogStore(this)
    addDialogStore = new UserAddDialogStore(this)

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            initDone: observable,
            usersType: observable,
            users: observable,
            init: action,
            load: action,
            showDetailDialog: action,
            showDeleteDialog: action,
        })
    }

    init(type: UserType) {
        this.initDone = true

        if (
            Object.values(UserType)
                .map(v => v.toLocaleLowerCase())
                .includes(type)
        ) {
            this.usersType = type
        } else {
            navigationStore.adminIndex()
        }

        this.load()
    }

    load() {
        if (this.usersType) {
            this.isLoading = true
            UserService.getUsers(this.usersType)
                .then(data =>
                    runInAction(() => {
                        this.isLoading = false
                        if (!isApiError(data)) {
                            this.users = data
                        }
                    })
                )
                .finally(() => {
                    runInAction(() => {
                        this.isLoading = false
                    })
                })
        }
    }

    showAddDialog() {
        this.addDialogStore.show()
    }

    showDetailDialog(user: User, editMode = false) {
        this.detailDialogStore.init(user, editMode)
        this.detailDialogStore.show()
    }

    showDeleteDialog(user: User, content: JSX.Element) {
        this.deleteDialogStore.init(user)
        this.deleteDialogStore.show(
            () =>
                runInAction(() => {
                    this.deleteDialogStore.delete()
                }),
            () =>
                runInAction(() => {
                    this.deleteDialogStore.reset()
                }),
            'Odstranit operátora?',
            AlertDialogType.Danger,
            content
        )
    }
}
