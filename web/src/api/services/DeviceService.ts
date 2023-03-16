import { Device } from '../models/Device'
import { DeviceType } from '../models/DeviceType'

export class DeviceService {
    static async getDevices(): Promise<Device[]> {
        const response = await fetch('http://localhost:8081/devices')
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        return data
    }

    static async getDeviceTypes(): Promise<DeviceType[]> {
        const response = await fetch('http://localhost:8081/devices/types')
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        return data
    }
}
