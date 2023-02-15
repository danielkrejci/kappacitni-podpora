import { History } from 'history'

type AnyParam = number | string | undefined

export class NavigationStore {
    private history: History

    constructor(history: History) {
        this.history = history
    }

    index = () => this.history.push(this.href.index())
    serviceCaseForm = (deviceName: AnyParam) => this.history.push(this.href.serviceCaseForm(deviceName))
    serviceCaseDetail = (serviceCaseId: AnyParam) => this.history.push(this.href.serviceCaseDetail(serviceCaseId))

    back = () => this.history.back()

    href = {
        index: () => `/index`,
        serviceCaseForm: (deviceName?: AnyParam) => `/device/${deviceName ?? ':deviceName'}`,
        serviceCaseDetail: (serviceCaseId: AnyParam) => `/detail/${serviceCaseId ?? 'serviceCaseId'}`,
    }
}
