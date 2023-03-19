import {
    ServiceCaseCreated,
    ServiceCaseDetail,
    ServiceCaseForm,
    ServiceCaseList,
    ServiceCaseState,
    ServiceCaseType,
} from '../models/ServiceCase'
import { ServiceCaseMessageForm } from '../models/ServiceCaseMessage'
import { ADMIN_API_URL, ApiService, CLIENT_API_URL } from './ApiService'

export class ServiceCaseService {
    static async getServiceCases(operatorId?: string, state?: string, sort?: string) {
        return await ApiService.get<ServiceCaseList>(
            `${CLIENT_API_URL}/service-cases?operatorId=${operatorId ?? ''}&state=${state ?? ''}&sort=${sort ?? ''}`
        )
    }

    static async getServiceCaseTypes() {
        return await ApiService.get<ServiceCaseType[]>(`${CLIENT_API_URL}/service-cases/types`)
    }

    static async getServiceCaseStates() {
        return await ApiService.get<ServiceCaseState[]>(`${CLIENT_API_URL}/service-cases/states`)
    }

    static async getServiceCase(id: string, hash: string) {
        return await ApiService.get<ServiceCaseDetail>(`${CLIENT_API_URL}/service-cases/${id}/${hash}`)
    }

    static async createServiceCase(serviceCase: ServiceCaseForm) {
        return await ApiService.post<ServiceCaseCreated>(`${CLIENT_API_URL}/service-cases`, JSON.stringify(serviceCase))
    }

    static async createServiceCaseMessage(id: string, message: ServiceCaseMessageForm) {
        return await ApiService.post<boolean>(`${CLIENT_API_URL}/service-cases/${id}/message`, JSON.stringify(message))
    }

    static async createServiceCaseAdminMessage(id: string, message: ServiceCaseMessageForm) {
        return await ApiService.post<boolean>(`${ADMIN_API_URL}/admin/service-cases/${id}/message`, JSON.stringify(message))
    }
}
