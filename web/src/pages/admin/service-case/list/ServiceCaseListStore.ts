import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { ServiceCaseList, ServiceCaseListSorting, ServiceCaseState } from '../../../../api/models/ServiceCase'
import { User } from '../../../../api/models/User'
import { isApiError } from '../../../../api/services/ApiService'
import { ServiceCaseService } from '../../../../api/services/ServiceCaseService'
import { navigationStore } from '../../../../App'
import { Field } from '../../../../common/forms/Field'
import { ListUtils } from '../../../../common/utils/ListUtils'
import { SelectFieldUtils } from '../../../../common/utils/SelectFieldUtils'

export class ServiceCaseListStore {
    isLoading = false

    initDone = false

    serviceCases: ServiceCaseList[] = []

    showFilter = false

    codetables = {
        operators: [] as User[],
        states: [] as ServiceCaseState[],
        sort: ServiceCaseListSorting,
    }

    filter = {
        sort: Field.select('sort', this.codetables.sort[0], () => this.codetables.sort),
        operators: Field.select('operators', SelectFieldUtils.optionAll(), () => [SelectFieldUtils.optionAll()]),
        state: Field.select('state', SelectFieldUtils.optionAll(), () => [SelectFieldUtils.optionAll()]),
    }

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            initDone: observable,
            codetables: observable,
            serviceCases: observable,
            showFilter: observable,
            init: action,
            load: action,
            toggleFilter: action,
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
        const state = query.get('state') ?? ''
        const sort = ServiceCaseListSorting.find(s => s.code === query.get('sort') ?? '')?.code ?? ServiceCaseListSorting[0].code

        console.log('operatorId: ', operatorId)
        console.log('state: ', state)
        console.log('sort: ', JSON.stringify(this.filter.sort.value))

        this.isLoading = true

        Promise.all([
            ServiceCaseService.getServiceCaseStates(),
            // ServiceCaseService.getServiceCases(operatorId, state, sort),
            // UserService.getUsers(UserType.OPERATOR)
        ])
            .then(data =>
                runInAction(() => {
                    if (!isApiError(data[0])) {
                        this.codetables.states = ListUtils.asList(data[0])
                    }

                    // if (!isApiError(data[1])) {
                    //     this.serviceCases = ListUtils.asList(data[1])
                    // }

                    // if (!isApiError(data[2])) {
                    //     this.codetables.operators = ListUtils.asList(data[2])
                    // }

                    SelectFieldUtils.initFieldSelect(
                        this.filter.state,
                        this.codetables.states.map(item => ({ code: item.code, value: item.value })),
                        true,
                        false,
                        false
                    )

                    this.filter.sort.value = ServiceCaseListSorting.find(s => s.code === sort) ?? ServiceCaseListSorting[0]
                    this.filter.state.value = this.codetables.states.find(s => s.code.toString() === state) ?? SelectFieldUtils.optionAll()

                    this.showFilter =
                        SelectFieldUtils.isSelected(this.filter.state.value) || SelectFieldUtils.isSelected(this.filter.operators.value)

                    this.isLoading = false
                })
            )
            .finally(() => {
                runInAction(() => {
                    this.isLoading = false
                })
            })
    }

    reload() {
        this.isLoading = true

        navigationStore.adminServiceCases(this.filter.operators.value.code, this.filter.state.value.code, this.filter.sort.value.code)

        ServiceCaseService.getServiceCases(this.filter.operators.value.code, this.filter.state.value.code, this.filter.sort.value.code)
            .then(data =>
                runInAction(() => {
                    this.isLoading = false

                    if (!isApiError(data)) {
                        this.serviceCases = data
                    }
                })
            )
            .finally(() => {
                runInAction(() => {
                    this.isLoading = false
                })
            })
    }

    toggleFilter() {
        this.showFilter = !this.showFilter
    }

    get isFilterActive(): boolean {
        return (
            this.showFilter &&
            (this.showFilter ||
                SelectFieldUtils.isSelected(this.filter.operators.value) ||
                SelectFieldUtils.isSelected(this.filter.state.value))
        )
    }
}
