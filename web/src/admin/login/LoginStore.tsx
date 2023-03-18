import { CredentialResponse } from '@react-oauth/google'
import { action, makeObservable, observable } from 'mobx'
import { authService, navigationStore } from '../../App'

export class LoginStore {
    token = ''

    constructor() {
        makeObservable(this, {
            token: observable,
            onSuccess: action,
            onFailure: action,
        })
    }

    onSuccess(response: CredentialResponse) {
        if (response && response.credential) {
            authService.login(response.credential as string)

            console.log(authService.authUser, authService.token)

            navigationStore.adminIndex()
        }
    }

    loadUserData() {
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${this.token}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    onFailure() {
        console.log('Login failed')
    }
}
