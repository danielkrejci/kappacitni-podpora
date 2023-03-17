import { Device, EMPTY_DEVICE } from './Device'
import { ServiceCaseMessage } from './ServiceCaseMessage'
import { EMPTY_USER, User } from './User'

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
