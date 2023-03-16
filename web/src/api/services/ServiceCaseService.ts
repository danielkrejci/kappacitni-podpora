import { ServiceCaseDetail, ServiceCaseForm } from '../models/ServiceCase'
import { ServiceCaseType } from '../models/ServiceCaseType'

export class ServiceCaseService {
    static async getServiceCaseTypes(): Promise<ServiceCaseType[]> {
        const response = await fetch('http://localhost:8081/service-cases/types')
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        return data
    }

    static async getServiceCase(id: string, hash: string): Promise<ServiceCaseDetail[]> {
        const response = await fetch(`http://localhost:8081/service-cases/${id}/${hash}`)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        return data
    }

    static async createServiceCase(serviceCase: ServiceCaseForm): Promise<string> {
        const response = await fetch('http://localhost:8081/service-cases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceCase),
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        return data
    }
}
