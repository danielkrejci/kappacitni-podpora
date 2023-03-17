import { Device } from '../models/Device'
import { DeviceType } from '../models/DeviceType'
import { ApiService } from './ApiService'

export class DeviceService {
    static async getDevices() {
        return await ApiService.get<Device[]>('http://localhost:8081/devices')
    }

    static async getDeviceTypes() {
        return await ApiService.get<DeviceType[]>('http://localhost:8081/devices/types')
    }
}
