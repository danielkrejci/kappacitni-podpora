import { History } from 'history'
import { ServiceCaseListSorting } from '../../api/models/ServiceCase'

type AnyParam = number | string | undefined

export class NavigationStore {
    history: History

    constructor(history: History) {
        this.history = history
    }

    index = () => this.history.push(this.href.index())

    privacyPolicy = () => this.history.push(this.href.privacyPolicy())

    serviceCaseForm = (deviceName: AnyParam) => this.history.push(this.href.serviceCaseForm(deviceName))

    serviceCaseDetail = (serviceCaseId: AnyParam, serviceCaseHash: AnyParam) =>
        this.history.push(this.href.serviceCaseDetail(serviceCaseId, serviceCaseHash))

    login = () => this.history.push(this.href.login())

    account = () => this.history.push(this.href.account())

    adminIndex = () => this.history.push(this.href.adminIndex())

    settings = () => this.history.push(this.href.settings())

    adminUsers = (type: AnyParam) => this.history.push(this.href.adminUsers(type))

    adminServiceCaseList = (operatorId?: AnyParam, clientId?: AnyParam, state?: AnyParam, page?: AnyParam, sort?: AnyParam) =>
        this.history.push(this.href.adminServiceCaseList(operatorId, clientId, state, page, sort))

    adminServiceCaseDetail = (serviceCaseId: AnyParam) => this.history.push(this.href.adminServiceCaseDetail(serviceCaseId))

    back = () => this.history.goBack()

    href = {
        index: () => '/index',
        privacyPolicy: () => '/privacy-policy',
        serviceCaseForm: (deviceName?: AnyParam) => `/device/${deviceName ?? ':deviceName'}`,
        serviceCaseDetail: (id?: AnyParam, hash?: AnyParam) => `/detail/${id ?? ':id'}/${hash ?? ':hash'}`,
        login: () => '/admin/login',
        account: () => '/admin/account',
        settings: () => '/admin/settings',
        adminIndex: () => '/admin/index',
        adminUsers: (type?: AnyParam) => `/admin/users/${type ?? ':type'}`,
        adminServiceCaseList: (operatorId?: AnyParam, clientId?: AnyParam, state?: AnyParam, page?: AnyParam, sort?: AnyParam) => {
            sort = typeof sort !== 'undefined' ? sort : ServiceCaseListSorting[0].code
            return `/admin/service-cases?${operatorId ? `&operatorId=${operatorId}` : ''}${clientId ? `&clientId=${clientId}` : ''}${
                state ? `&state=${state}` : ''
            }${page ? `&page=${page}` : ''}${sort ? `&sort=${sort}` : ''}`
        },
        adminServiceCaseDetail: (id?: AnyParam) => `/admin/service-cases/${id ?? ':id'}`,
    }
}
