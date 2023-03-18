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
    name: string
    surname: string
    email: string
    phone: string
    isClient: boolean
    isOperator: boolean
}

export const EMPTY_USER: User = {
    name: '',
    surname: '',
    email: '',
    phone: '',
    isClient: false,
    isOperator: false,
    ...EMPTY_ADDRESS,
}

export type AuthUser = User & {
    exp: string
    sub: string
    aud: string
    iat: string
    picture: string
}
