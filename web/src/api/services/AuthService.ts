import jwtDecode from 'jwt-decode'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { AuthUser, User } from '../models/User'
import { ADMIN_API_URL, ApiService, isApiError } from './ApiService'

export class AuthService {
    authUser?: AuthUser = undefined

    token = ''

    constructor() {
        makeObservable(this, {
            authUser: observable,
            token: observable,
            isLoggedIn: computed,
            login: action,
            logout: action,
        })
    }

    async login(token: string) {
        const userData = jwtDecode(token) as any

        this.token = token

        return this.loadUserData().then(result =>
            runInAction(() => {
                if (!isApiError(result)) {
                    localStorage.setItem('token', token)

                    this.authUser = {
                        sub: userData.sub,
                        aud: userData.aud,
                        exp: userData.exp,
                        iat: userData.iat,
                        // picture: userData.picture,
                        ...result,
                    }

                    return true
                } else {
                    this.logout()
                    // showAlertDialog('Chyba', result.cause, AlertDialogType.Danger)
                }
                return false
            })
        )
    }

    logout() {
        this.token = ''
        this.authUser = undefined
        localStorage.removeItem('token')
    }

    private async loadUserData() {
        return await ApiService.get<User>(`${ADMIN_API_URL}/admin/users/current`)
    }

    get isLoggedIn(): boolean {
        return this.authUser !== undefined && this.token.length > 0
    }
}
