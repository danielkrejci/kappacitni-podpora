import { History } from 'history'

type AnyParam = number | string | undefined

export class NavigationStore {
    private history: History

    constructor(history: History) {
        this.history = history
    }

    home = () => this.history.push(this.href.home())
    serviceCaseForm = (deviceName: AnyParam) => this.history.push(this.href.serviceCaseForm(deviceName))
    serviceCaseDetail = (serviceCaseId: AnyParam) => this.history.push(this.href.serviceCaseDetail(serviceCaseId))

    back = () => this.history.back()

    href = {
        home: () => `/home`,
        serviceCaseForm: (deviceName?: AnyParam) => `/device/${deviceName ?? ':deviceName'}`,
        serviceCaseDetail: (serviceCaseId: AnyParam) => `/detail/${serviceCaseId ?? 'serviceCaseId'}`,
    }
}
