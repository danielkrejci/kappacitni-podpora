/**
 * Helper functions related to lists and arrays.
 */
export module ListUtils {

    /**
     * Safe check method which checks if given list exists and has map method. 
     * When given object is not list returns new list instance.
     * This function should be used only when working with lists received as server response as double check avoiding application errors caused by invalid errors.
     * @param list instance of list to be checked.
     */
    export function asList<T>(list: T[] | undefined | null): T[] {
        let res: T[] = [];
        if (list !== undefined && list !== null && typeof list.map === 'function') {
            res = list;
        }
        return res;
    }

    /**
     * Generate random key for displayed components in array.
     * Use instead of unreliable new Date().getTime().
     */
    export function randomKey(): string {
        return Math.random().toString(36).substring(2);
    }
}