import { action, makeObservable, observable, runInAction } from 'mobx'
import { EMPTY_STATS, Stats } from '../../../api/models/Stats'
import { isApiError } from '../../../api/services/ApiService'
import { StatsService } from '../../../api/services/StatsService'

export class AdminIndexStore {
    isLoading = false

    stats: Stats = EMPTY_STATS

    constructor() {
        makeObservable(this, {
            stats: observable,
            isLoading: observable,
            init: action,
            load: action,
        })
    }

    init() {
        this.load()
    }

    load() {
        this.isLoading = true

        StatsService.getStats()

            .then(data =>
                runInAction(() => {
                    if (!isApiError(data)) {
                        this.stats = data
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
}
