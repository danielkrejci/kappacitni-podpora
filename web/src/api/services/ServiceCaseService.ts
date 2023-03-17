import { ServiceCaseCreated, ServiceCaseDetail, ServiceCaseForm } from '../models/ServiceCase'
import { ServiceCaseType } from '../models/ServiceCaseType'
import { ApiService } from './ApiService'

export class ServiceCaseService {
    static async getServiceCaseTypes() {
        return await ApiService.get<ServiceCaseType[]>('http://localhost:8081/service-cases/types')
    }

    static async getServiceCase(id: string, hash: string) {
        return await ApiService.get<ServiceCaseDetail[]>(`http://localhost:8081/service-cases/${id}/${hash}`)
    }

    static async createServiceCase(serviceCase: ServiceCaseForm) {
        return await ApiService.post<ServiceCaseCreated>('http://localhost:8081/service-cases', JSON.stringify(serviceCase))
    }
}
