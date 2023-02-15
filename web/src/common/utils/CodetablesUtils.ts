import { SelectField } from '../forms/SelectField'

/**
 * Provides helper functions related to codetables.
 */
export class CodetablesUtils {
    /**
     * Returns UI label for code table item identified by code.
     * @param code code of item.
     * @param items function providing items in which will be searched for value.
     */
    static toUILabel(code: string, items: () => SelectField[]) {
        const found = items().filter(curItem => curItem.code === code)[0]
        if (found) {
            return found.value
        } else {
            return '--'
        }
    }

    /**
     * Converts given code table items represented by give codes into UI label.
     * @param codes item codes to be in label.
     * @param codetableItems all codetable items.
     * @returns UI label.
     */
    static toUILabels(codes: string[], codetableItems: SelectField[]): string {
        if (codes.length > 0) {
            const codesValues = codetableItems.filter(curItem => codes.indexOf(curItem.code) !== -1).map(curItem => curItem.value)
            return codesValues.join(', ')
        } else {
            return ''
        }
    }

    /**
     * First found codetable item with given code or empty item.
     * @param code requested item code.
     * @param codetableItems all code table items.
     * @returns first found or empty.
     */
    static firstOrEmpty(code: string, codetableItems: SelectField[]): SelectField {
        return codetableItems.filter(curItem => curItem.code === code)[0] || { code: '', value: '' }
    }
}
