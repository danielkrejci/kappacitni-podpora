export type Stats = {
    total: number
    operators: number
    clients: number
    active: StatsActive
    closed: StatsClosed
}

export type StatsActive = {
    total: number
    operators: StatsActiveOperator[]
}

export type StatsActiveOperator = {
    name: string
    active: number
}

export type StatsClosed = {
    total: number
    operators: StatsClosedOperator[]
}

export type StatsClosedOperator = {
    name: string
    closed: number
}

export const EMPTY_STATS: Stats = {
    total: 0,
    operators: 0,
    clients: 0,
    active: {
        total: 10,
        operators: [],
    },
    closed: {
        total: 0,
        operators: [
            {
                name: 'danielkrejci',
                closed: 1,
            },
        ],
    },
}
