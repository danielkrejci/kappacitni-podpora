export interface SelectField {
    code: string
    value: string
    disabled?: boolean
}

export const EMPTY_SELECT_FIELD = {
    code: '',
    value: '',
} as SelectField
