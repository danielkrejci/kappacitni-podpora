import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { EMPTY_SERVICE_CASE_LIST, ServiceCaseList, ServiceCaseListSorting, ServiceCaseState } from '../../../../api/models/ServiceCase'
import { User, UserType } from '../../../../api/models/User'
import { isApiError } from '../../../../api/services/ApiService'
import { ServiceCaseService } from '../../../../api/services/ServiceCaseService'
import { UserService } from '../../../../api/services/UserService'
import { navigationStore } from '../../../../App'
import { Field } from '../../../../common/forms/Field'
import { ListUtils } from '../../../../common/utils/ListUtils'
import { SelectFieldUtils } from '../../../../common/utils/SelectFieldUtils'

export class ServiceCaseListStore {
    isLoading = false

    initDone = false

    serviceCases: ServiceCaseList = EMPTY_SERVICE_CASE_LIST

    codetables = {
        operators: [] as User[],
        clients: [] as User[],
        states: [] as ServiceCaseState[],
        sort: ServiceCaseListSorting,
    }

    currentPage = 1

    filter = {
        sort: Field.select('sort', this.codetables.sort[0], () => this.codetables.sort),
        operators: Field.select('operators', SelectFieldUtils.optionAll(), () =>
            SelectFieldUtils.withAllOption(
                this.codetables.operators.map(operator => ({
                    code: `${operator.id}`,
                    value: `${operator.name} ${operator.surname}`,
                }))
            )
        ),
        clients: Field.select('clients', SelectFieldUtils.optionAll(), () =>
            SelectFieldUtils.withAllOption(
                this.codetables.clients.map(client => ({
                    code: `${client.id}`,
                    value: `${client.name} ${client.surname}`,
                }))
            )
        ),
        state: Field.select('state', SelectFieldUtils.optionAll(), () =>
            SelectFieldUtils.withAllOption(this.codetables.states.map(item => ({ code: item.code, value: item.value })))
        ),
    }

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            initDone: observable,
            codetables: observable,
            serviceCases: observable,
            currentPage: observable,
            init: action,
            load: action,
            nextPage: action,
            prevPage: action,
            pageChange: action,
            isFilterActive: computed,
        })
    }

    init(search: string) {
        this.initDone = true

        this.load(search)
    }

    load(search: string) {
        const query = new URLSearchParams(search)

        const operatorId = query.get('operatorId') ?? ''
        const clientId = query.get('clientId') ?? ''
        const state = query.get('state') ?? ''
        const sort = ServiceCaseListSorting.find(s => s.code === query.get('sort') ?? '')?.code ?? ServiceCaseListSorting[0].code

        this.currentPage = Number(query.get('page') ?? 1)

        this.isLoading = true

        Promise.all([
            ServiceCaseService.getServiceCaseStates(),
            UserService.getUsers(UserType.OPERATOR),
            UserService.getUsers(UserType.CLIENT),
            ServiceCaseService.getServiceCases(operatorId, clientId, state, `${this.currentPage}`, sort),
        ])
            .then(data =>
                runInAction(() => {
                    if (!isApiError(data[0])) {
                        this.codetables.states = ListUtils.asList(data[0])
                    }

                    if (!isApiError(data[1])) {
                        this.codetables.operators = ListUtils.asList(data[1])
                    }

                    if (!isApiError(data[2])) {
                        this.codetables.clients = ListUtils.asList(data[2])
                    }

                    this.filter.operators.value =
                        this.codetables.operators
                            .filter(item => `${item.id}` === operatorId)
                            .map(item => ({ code: `${item.id}`, value: `${item.name} ${item.surname}` }))[0] ?? SelectFieldUtils.optionAll()

                    this.filter.clients.value =
                        this.codetables.clients
                            .filter(item => `${item.id}` === clientId)
                            .map(item => ({ code: `${item.id}`, value: `${item.name} ${item.surname}` }))[0] ?? SelectFieldUtils.optionAll()

                    this.filter.sort.value = ServiceCaseListSorting.find(item => `${item.code}` === sort) ?? ServiceCaseListSorting[0]

                    this.filter.state.value = this.codetables.states.find(item => `${item.code}` === state) ?? SelectFieldUtils.optionAll()

                    if (!isApiError(data[3])) {
                        this.serviceCases = data[3]
                        if (this.serviceCases.data.length === 0) {
                            if (this.serviceCases.page > this.serviceCases.totalPages) {
                                this.currentPage = this.serviceCases.totalPages
                                this.reload(false)
                            } else if (this.serviceCases.page < 1) {
                                this.reload()
                            }
                        }
                    }

                    this.isLoading = false
                })
            )
            .finally(() => {
                runInAction(() => {
                    this.isLoading = false
                })
            })
    }

    reload(resetPagination = true) {
        this.isLoading = true

        if (resetPagination) {
            this.currentPage = 1
        }

        navigationStore.adminServiceCaseList(
            this.filter.operators.value.code,
            this.filter.clients.value.code,
            this.filter.state.value.code,
            this.currentPage,
            this.filter.sort.value.code
        )

        ServiceCaseService.getServiceCases(
            this.filter.operators.value.code,
            this.filter.clients.value.code,
            this.filter.state.value.code,
            `${this.currentPage}`,
            this.filter.sort.value.code
        )
            .then(data =>
                runInAction(() => {
                    this.isLoading = false

                    if (!isApiError(data)) {
                        this.serviceCases = data

                        if (data.data.length === 0) {
                            if (data.page > data.totalPages) {
                                this.currentPage = data.totalPages
                                this.reload(false)
                            } else if (data.page < 1) {
                                this.reload()
                            }
                        }
                    }
                })
            )
            .finally(() => {
                runInAction(() => {
                    this.isLoading = false
                })
            })
    }

    nextPage() {
        if (this.serviceCases.hasNext) {
            this.currentPage = this.currentPage + 1
        }
        this.reload(false)
    }

    prevPage() {
        if (this.serviceCases.hasPrev) {
            this.currentPage = this.currentPage - 1
        }
        this.reload(false)
    }

    pageChange(page: number) {
        this.currentPage = page
        this.reload(false)
    }

    get isFilterActive(): boolean {
        return (
            SelectFieldUtils.isSelected(this.filter.operators.value) ||
            SelectFieldUtils.isSelected(this.filter.clients.value) ||
            SelectFieldUtils.isSelected(this.filter.state.value)
        )
    }
}
