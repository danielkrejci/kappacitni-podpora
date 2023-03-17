import { DeviceType, EMPTY_DEVICE_TYPE } from './DeviceType'

export type Device = {
    id: string
    typeId: string
    modelName: string
    serialNumber: string
    releaseDate: string
    type: DeviceType
}

export const EMPTY_DEVICE = {
    id: '',
    typeId: '',
    modelName: '',
    serialNumber: '',
    releaseDate: '',
    type: EMPTY_DEVICE_TYPE,
}
