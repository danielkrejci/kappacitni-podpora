import jwtDecode from 'jwt-decode'
import { action, computed, makeObservable, observable } from 'mobx'
import { AuthUser, EMPTY_ADDRESS } from '../models/User'

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

        const token = localStorage.getItem('token')

        if (token && token.length > 0) {
            this.login(token)
        }
    }

    login(token: string) {
        const userData = jwtDecode(token) as any

        localStorage.setItem('token', token)

        this.token = token
        this.authUser = {
            exp: userData.exp,
            sub: userData.sub,
            aud: userData.aud,
            iat: userData.iat,
            picture: userData.picture,
            name: userData.given_name,
            surname: userData.family_name,
            email: userData.email,
            phone: '',
            isClient: false,
            isOperator: true,
            ...EMPTY_ADDRESS,
        }
    }

    logout() {
        this.token = ''
        this.authUser = undefined
        localStorage.removeItem('token')
    }

    get isLoggedIn(): boolean {
        return this.authUser !== undefined && this.token.length > 0
    }
}
