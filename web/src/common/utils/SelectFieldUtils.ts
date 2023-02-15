import { Field } from '../forms/Field'
import { SelectField } from '../forms/SelectField'

/**
 * Provides helper methods for reading values from search forms.
 */
export module SelectFieldUtils {
    /**
     * Returns string value of field or undefined when value is empty string.
     * @param field field with data.
     */
    export function stringOrUndefined(field: Field<string>): string | undefined {
        return field.value.trim() === '' ? undefined : field.value
    }

    /**
     * Returns undefined when field has not selected any value.
     * @param field field with data.
     * @param undefinedCode value that represents no selection. By default it's empty string.
     */
    export function codeOrUndefined(field: Field<SelectField>, undefinedCode?: string): string | undefined {
        return field.value.code === (undefinedCode || '') ? undefined : field.value.code
    }

    /**
     * Returns undefined when field has not selected any values.
     * @param field field with data.
     */
    export function codesOrUndefined(field: Field<SelectField[]>): string[] | undefined {
        return field.value.length === 0 ? undefined : field.value.map((item: { code: any }) => item.code)
    }

    /**
     * Adds 'All' option into given options on first place.
     * @param options options to be extended.
     */
    export function withAllOption(options: SelectField[]): SelectField[] {
        return [SelectFieldUtils.optionAll()].concat(options)
    }

    /**
     * Adds 'None' option into given options on first place.
     * @param options options to be extended.
     */
    export function withNoneOption(options: SelectField[]): SelectField[] {
        return [SelectFieldUtils.optionNone()].concat(options)
    }

    export function withNotSelectedOption(options: SelectField[]): SelectField[] {
        return [SelectFieldUtils.optionNotSelected()].concat(options)
    }

    /**
     * Initializes select field with options and default value.
     * @param field select field to be initialized.
     * @param options options to be set.
     * @param addAllOption true when 'All' option should be added.
     * @param addNoneOption true when 'None' option should be added.
     */
    export function initFieldSelect(
        field: Field<SelectField>,
        options: SelectField[],
        addAllOption?: boolean,
        addNoneOption?: boolean,
        addNotSelectedOption?: boolean
    ) {
        const optionsForInit = addAllOption
            ? SelectFieldUtils.withAllOption(options)
            : addNoneOption
            ? SelectFieldUtils.withNoneOption(options)
            : addNotSelectedOption
            ? SelectFieldUtils.withNotSelectedOption(options)
            : options
        field.options = () => optionsForInit
        field.value = optionsForInit[0] || { code: '', value: '' }
    }

    /**
     * Initializes select field with options and value found in options.
     * @param field select field to be initialized.
     * @param options options to be set.
     * @param code Code by which initial value will be selected from options.
     * @param addAllOption true when 'All' option should be added.
     * @param addNoneOption true when 'None' option should be added.
     */
    export function initFieldSelectWithCode(
        field: Field<SelectField>,
        options: SelectField[],
        code: string,
        addAllOption?: boolean,
        addNoneOption?: boolean
    ) {
        let optionsForInit = options
        if (addNoneOption) {
            optionsForInit = SelectFieldUtils.withNoneOption(optionsForInit)
        }
        if (addAllOption) {
            optionsForInit = SelectFieldUtils.withAllOption(optionsForInit)
        }
        field.options = () => optionsForInit

        const filteredValues = optionsForInit.filter(option => option.code === code)
        if (filteredValues.length > 0) {
            field.value = filteredValues[0] || { code: '', value: '' }
        } else {
            field.value = { code: '', value: '' }
        }
    }

    /**
     * Creates 'All' option with no value.
     */
    export function optionAll(): SelectField {
        return {
            code: '',
            value: 'Vše',
        }
    }

    /**
     * Creates 'Loading' option.
     */
    export function optionLoading(): SelectField {
        return {
            code: '',
            value: 'Načítám...',
        }
    }

    /**
     * Creates 'Loading' option.
     */
    export function optionNone(): SelectField {
        return {
            code: '--',
            value: '--',
        }
    }

    export function isSelected(field: SelectField): boolean {
        return ['--', '-1', ''].filter(code => field.code === code).length === 0
    }

    /**
     * Retrieves option from provided array based on given code
     *
     * returns undefined if option is not found in provided array
     */
    export function getOptionByCode(code: string, options: SelectField[]): SelectField | undefined {
        return options.find(option => option.code === code)
    }

    /**
     * Case of option representing not selected entity. ID has value -1 to mimics not existing reference to database.
     * @returns new instance of no selected option.
     */
    export function optionNotSelected(): SelectField {
        return {
            code: '-1',
            value: 'Vyberte...',
        }
    }
}
