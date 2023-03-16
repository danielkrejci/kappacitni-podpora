import { DeviceType } from './DeviceType'

export type Device = {
    id: number
    typeId: number
    modelName: string
    serialNumber: string
    releaseDate: string
    type: DeviceType
}
