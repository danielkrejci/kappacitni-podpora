import { History } from 'history'

type AnyParam = number | string | undefined

export class NavigationStore {
    history: History

    constructor(history: History) {
        this.history = history
    }

    index = () => this.history.push(this.href.index())
    serviceCaseForm = (deviceName: AnyParam) => this.history.push(this.href.serviceCaseForm(deviceName))
    serviceCaseDetail = (serviceCaseId: AnyParam, serviceCaseHash: AnyParam) =>
        this.history.push(this.href.serviceCaseDetail(serviceCaseId, serviceCaseHash))

    login = () => this.history.push(this.href.login())

    adminIndex = () => this.history.push(this.href.adminIndex())

    adminUsers = (type: AnyParam) => this.history.push(this.href.adminUsers(type))

    adminServiceCaseList = (operatorId: AnyParam, state: AnyParam, sort: AnyParam) =>
        this.history.push(this.href.adminServiceCaseList(operatorId, state, sort))

    adminServiceCaseDetail = (serviceCaseId: AnyParam) => this.history.push(this.href.adminServiceCaseList(serviceCaseId))

    back = () => this.history.goBack()

    href = {
        index: () => `/index`,
        serviceCaseForm: (deviceName?: AnyParam) => `/device/${deviceName ?? ':deviceName'}`,
        serviceCaseDetail: (id?: AnyParam, hash?: AnyParam) => `/detail/${id ?? ':id'}/${hash ?? ':hash'}`,
        login: () => '/admin/login',
        adminIndex: () => '/admin/index',
        adminUsers: (type?: AnyParam) => `/admin/users/${type ?? ':type'}`,
        adminServiceCaseList: (operatorId?: AnyParam, state?: AnyParam, sort?: AnyParam) =>
            `/admin/service-cases${operatorId || state || sort ? '?' : ''}${operatorId ? `&operatorId=${operatorId}` : ''}${
                state ? `&state=${state}` : ''
            }${sort ? `&sort=${sort}` : ''}`,
        adminServiceCaseDetail: (id?: AnyParam) => `/admin/service-cases/${id ?? ':id'}`,
    }
}
