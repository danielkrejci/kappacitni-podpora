import { SelectField } from '../../common/forms/SelectField'
import { Device, EMPTY_DEVICE } from './Device'
import { ServiceCaseMessage } from './ServiceCaseMessage'
import { EMPTY_USER, User } from './User'

export const ServiceCaseListSorting: SelectField[] = [
    { code: 'date-desc', value: 'Nejnovější' },
    { code: 'date-asc', value: 'Nestarší' },
]

export type ServiceCaseList = {
    hasNext: boolean
    hasPrev: boolean
    data: ServiceCaseListItem[]
    page: number
    totalPages: number
}

export type ServiceCaseListItem = {
    id: number
    dateBegin: string
    dateEnd: string
    client: string
    message: string
    newMessagesCount: number
    stateId: number
    operators: string[]
}

export const EMPTY_SERVICE_CASE_LIST: ServiceCaseList = {
    hasNext: false,
    hasPrev: false,
    page: 1,
    totalPages: 1,
    data: [],
}

export type ServiceCaseForm = {
    deviceTypeId: string
    caseTypeId: string
    serialNumber: string
    message: string

    name: string
    surname: string
    email: string
    phone: string

    street: string
    houseNumber: string
    city: string
    postalCode: string
}

export type ServiceCaseCreated = {
    id: string
    hash: string
    email?: string
}

export const EMPTY_SERVICE_CASE_CREATED: ServiceCaseCreated = {
    id: '',
    hash: '',
    email: '',
}

export type ServiceCaseDetail = {
    serviceCase: {
        id: string
        stateId: string
        caseTypeId: string
        dateBegin: string
        dateEnd: string
        hash: string
    }
    operators: User[]
    client: User
    device: Device
    messages: ServiceCaseMessage[]
}

export const EMPTY_SERVICE_CASE_DETAIL: ServiceCaseDetail = {
    serviceCase: {
        id: '',
        stateId: '',
        caseTypeId: '',
        dateBegin: '',
        dateEnd: '',
        hash: '',
    },
    operators: [],
    client: EMPTY_USER,
    device: EMPTY_DEVICE,
    messages: [],
}

export type ServiceCaseType = {
    code: string
    value: string
}

export type ServiceCaseState = {
    code: string
    value: string
}
