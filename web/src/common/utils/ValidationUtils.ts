import { Field } from '../forms/Field'
import { SelectField } from '../forms/SelectField'
import { DateUtils } from './DateUtils'
import { SelectFieldUtils } from './SelectFieldUtils'

export module ValidationUtils {
    export function requiredDate(field: Field<string>) {
        const regex = /^\s*\d{4}-(1[012]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])\s*$/
        if (field && field.value.trim() === '') {
            field.validation.addError('fieldIsRequired')
        }
        if (field && !(regex.test(field.value) && !isNaN(new Date(field.value).getTime()))) {
            field.validation.addError('Field must contain valid date')
        }
    }

    export function required(field: Field<string>) {
        if (field && field.value.trim() === '') {
            field.validation.addError('fieldIsRequired')
        }
    }

    export function requiredSelect(field: Field<SelectField>) {
        if (field && (field.value.code === '' || field.value.code === SelectFieldUtils.optionNone().code)) {
            field.validation.addError('fieldIsRequired')
        }
    }

    export function requiredPositiveNumber(field: Field<string>) {
        if (field && (field.value === '' || isNaN(Number(field.value)) || Number(field.value) <= 0)) {
            field.validation.addError('Field must contain positive number')
        }
    }

    export function requiredPositiveNumberAndZero(field: Field<string>) {
        if (field && (field.value === '' || isNaN(Number(field.value)) || Number(field.value) < 0)) {
            field.validation.addError('Field must contain positive number or zero')
        }
    }

    export function email(field: Field<string>) {
        const emailRegex = /^[A-Z0-9a-z._%+-]+@[A-Z0-9a-z.-]+\.[A-Za-z]{2,9}$/
        if (field && !emailRegex.test(field.value)) {
            field.validation.addError('Field must contain valid email')
        }
    }

    export function phone(field: Field<string>) {
        if (field && (field.value.length < 5 || field.value.length > 20)) {
            field.validation.addError('Field must contain valid phone number')
        }
    }

    export function maxLength(field: Field<string>, maxLength: number) {
        if (field && field.value.length > maxLength) {
            field.validation.addError('Field must contain value with maximum of $ characters'.replace('$', String(maxLength)))
        }
    }

    export function minLength(field: Field<string>, minLength: number) {
        if (field && field.value.length < minLength) {
            field.validation.addError('Field must contain value with minimum of $ characters'.replace('$', String(minLength)))
        }
    }

    export function requiredOrNoneSelect(field: Field<SelectField>) {
        if (field && field.value.code === '') {
            field.validation.addError('fieldIsRequired')
        }
    }

    export function validValidityPeriod(before: Field<string>, after: Field<string>) {
        if (before.value === '' || after.value === '') {
            return
        }

        if (new Date(before.value).getTime() >= new Date(after.value).getTime()) {
            before.validation.addError('Invalid validity period')
            after.validation.addError('Invalid validity period')
        }
    }

    export function firstDayOfMonthOrEmpty(field: Field<string>) {
        if (field.value !== '' && new Date(field.value).getDate() !== 1) {
            field.validation.addError('Date must contain the first day of month')
        }
    }

    export function lastDayOfMonthOrEmpty(field: Field<string>) {
        if (field.value === '') {
            return
        }

        const fieldDate = DateUtils.getDateWithoutTime(field.value)
        const lastDayDate = new Date(fieldDate.getFullYear(), fieldDate.getMonth() + 1, 0)
        if (fieldDate.getTime() !== lastDayDate.getTime()) {
            field.validation.addError('Date must contain the last day of month')
        }
    }
}
