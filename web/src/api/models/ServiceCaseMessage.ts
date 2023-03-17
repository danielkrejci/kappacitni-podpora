import { EMPTY_USER, User } from './User'

export type ServiceCaseMessage = {
    id: string
    date: string
    message: string
    state: string
    author: User
}

export const EMPTY_SERVICE_CASE_MESSAGE = {
    id: '',
    date: '',
    message: '',
    state: '',
    author: EMPTY_USER,
}
