export type Address = {
    street: string
    houseNumber: string
    city: string
    postalCode: string
}

export const EMPTY_ADDRESS: Address = {
    street: '',
    houseNumber: '',
    city: '',
    postalCode: '',
}

export type User = Address & {
    id: number
    name: string
    surname: string
    email: string
    phone: string
    picture: string
    isClient: boolean
    isOperator: boolean
}

export const EMPTY_USER: User = {
    id: -1,
    name: '',
    surname: '',
    email: '',
    phone: '',
    picture: '',
    isClient: false,
    isOperator: false,
    ...EMPTY_ADDRESS,
}

export type UserEdit = Address & {
    name: string
    surname: string
    phone: string
}

export type UserCreate = Address & {
    name: string
    surname: string
    email: string
    phone: string
}

export type AuthUser = User & {
    exp: string
    sub: string
    aud: string
    iat: string
    picture: string
}

export enum UserType {
    CLIENT = 'CLIENT',
    OPERATOR = 'OPERATOR',
}
