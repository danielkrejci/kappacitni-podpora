import { CredentialResponse } from '@react-oauth/google'
import jwtDecode from 'jwt-decode'
import { action, makeObservable, observable } from 'mobx'
import { EMPTY_ADDRESS, EMPTY_USER } from '../../api/models/User'
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
            const userData = jwtDecode(response.credential) as any

            authService.token = response.credential
            authService.authUser = {
                ...EMPTY_USER,
                ...EMPTY_ADDRESS,
                exp: userData.exp,
                sub: userData.sub,
                aud: userData.aud,
                iat: userData.iat,
                picture: userData.picture,
                name: userData.given_name,
                surname: userData.family_name,
                email: userData.email,
                isClient: false,
                isOperator: true,
            }

            console.log(authService.authUser, authService.token, userData)

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
