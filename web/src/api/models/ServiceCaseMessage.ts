import { EMPTY_USER, User } from './User'

export type ServiceCaseMessageForm = {
    userId: number
    hash: string
    message: string
}

export type ServiceCaseMessage = {
    id: string
    date: string
    message: string
    state: number
    author: User
}

export const EMPTY_SERVICE_CASE_MESSAGE = {
    id: '',
    date: '',
    message: '',
    state: 1,
    author: EMPTY_USER,
}
