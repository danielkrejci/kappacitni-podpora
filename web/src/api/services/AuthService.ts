import { action, computed, makeObservable, observable } from 'mobx'
import { AuthUser } from '../models/User'

export class AuthService {
    authUser?: AuthUser = undefined

    token = ''

    constructor() {
        makeObservable(this, {
            authUser: observable,
            token: observable,
            isLoggedIn: computed,
            logout: action,
        })
    }

    logout() {
        this.token = ''
        this.authUser = undefined
    }

    get isLoggedIn(): boolean {
        return this.authUser !== undefined && this.token.length > 0
    }
}
