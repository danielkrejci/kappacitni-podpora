import { CredentialResponse } from '@react-oauth/google'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { authService, navigationStore } from '../../../App'
import { AlertDialogType, showAlertDialog } from '../../../common/components/AlertDialog'

export class LoginStore {
    token = ''

    initDone = false

    constructor() {
        makeObservable(this, {
            token: observable,
            initDone: observable,
            onSuccess: action,
            onFailure: action,
            init: action,
        })
    }

    init(loginRedirect?: () => void) {
        const token = localStorage.getItem('token')

        if (token && token.length > 0) {
            authService.login(token).then(result =>
                runInAction(() => {
                    if (result) {
                        if (loginRedirect) {
                            loginRedirect()
                        } else {
                            navigationStore.adminIndex()
                        }
                    }
                })
            )
        }
    }

    onSuccess(response: CredentialResponse) {
        if (response && response.credential) {
            authService.login(response.credential as string).then(result =>
                runInAction(() => {
                    if (result) {
                        navigationStore.adminIndex()
                    }
                })
            )
        }
    }

    onFailure() {
        showAlertDialog('Chyba', 'Během přihlášení došlo k chybě.', AlertDialogType.Danger)
    }
}
