import { Device } from '../models/Device'
import { DeviceType } from '../models/DeviceType'
import { ApiService, CLIENT_API_URL } from './ApiService'

export class DeviceService {
    static async getDevices() {
        return await ApiService.get<Device[]>(`${CLIENT_API_URL}/devices`)
    }

    static async getDeviceTypes() {
        return await ApiService.get<DeviceType[]>(`${CLIENT_API_URL}/devices/types`)
    }
}
