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

export const EMPTY_SERVICE_CASE_CREATED = {
    id: '',
    hash: '',
    email: '',
}

export type ServiceCaseDetail = {}
