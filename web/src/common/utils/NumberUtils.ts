export module NumberUtils {
    /**
     * Replace number zero/undefined with dash
     */
    export function dashIfZero(value?: number) {
        if (!value || value === 0) {
            return '-'
        }
        return value
    }
}
