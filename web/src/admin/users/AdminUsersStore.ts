import { action, makeObservable, observable, runInAction } from 'mobx'
import { User, UserType } from '../../api/models/User'
import { authService, navigationStore } from '../../App'
import { AlertDialogType } from '../../common/components/AlertDialog'
import { UserAddDialogStore } from './dialogs/UserAddDialogStore'
import { UserDeleteDialogStore } from './dialogs/UserDeleteDialogStore'
import { UserDetailDialogStore } from './dialogs/UserDetailDialogStore'

export class AdminUsersStore {
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

        this.users = [
            {
                ...authService.authUser!,
            },
        ]
    }

    load() {
        // todo
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
