import {
    ServiceCaseCreated,
    ServiceCaseDetail,
    ServiceCaseForm,
    ServiceCaseList,
    ServiceCaseState,
    ServiceCaseType,
} from '../models/ServiceCase'
import { ApiService } from './ApiService'

export class ServiceCaseService {
    static async getServiceCases(operatorId?: string, state?: string, sort?: string) {
        return await ApiService.get<ServiceCaseList[]>(
            `http://localhost:8081/service-cases?operatorId=${operatorId ?? ''}&state=${state ?? ''}&sort=${sort ?? ''}`
        )
    }

    static async getServiceCaseTypes() {
        return await ApiService.get<ServiceCaseType[]>('http://localhost:8081/service-cases/types')
    }

    static async getServiceCaseStates() {
        return await ApiService.get<ServiceCaseState[]>('http://localhost:8081/service-cases/states')
    }

    static async getServiceCase(id: string, hash: string) {
        return await ApiService.get<ServiceCaseDetail>(`http://localhost:8081/service-cases/${id}/${hash}`)
    }

    static async createServiceCase(serviceCase: ServiceCaseForm) {
        return await ApiService.post<ServiceCaseCreated>('http://localhost:8081/service-cases', JSON.stringify(serviceCase))
    }
}
