import { runInAction } from 'mobx'
import { Field } from './Field'
import { SelectField } from './SelectField'

export module Form {

    /**
     * Placeholder target.
     */
    export interface EventPlaceholderTarget {
        type: string
        name: string
        value: string
        element?: any
    }

    /**
     * Placeholder event fired from UI components when no standard event types are not available on UI component.
     */
    export interface EventPlaceholder {
        target: EventPlaceholderTarget;
    }

    /**
     * Condition for resulution if given object is form field.
     * @param field instance to be checked.
     */
    function isField(field: any): boolean {
        return field && field.hasOwnProperty('validation') && typeof field.validation === 'object' && typeof field.validation.reset === 'function'
    }

    /**
    * Event handler for propagation of view changes into form data.
    * @param changeEvent input change event.
    */
    export function onChange(form: any, changeEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | EventPlaceholder): void {
        runInAction(() => {
            // Get target field name
            let fieldName = changeEvent.target.name

            if (fieldName) {

                // Get field from Form by target field name
                let targetField = getField(form, fieldName)

                if (targetField) {

                    // Reset field validation on field content change
                    targetField.validation.reset()

                    if (changeEvent.target.type === 'checkbox' && changeEvent.target instanceof HTMLInputElement) {
                        targetField.value = (changeEvent.target as HTMLInputElement).checked

                    } else if (typeof targetField.value === 'boolean') {
                        let targetValue = 'false'

                        if (changeEvent.target.value && changeEvent.target.value.toLocaleLowerCase) {
                            targetValue = changeEvent.target.value.toLocaleLowerCase()
                        }

                        targetField.value = targetValue === 'true' || targetValue === 'yes' || targetValue === 'on' || targetValue === '1'

                    } else {
                        targetField.value = changeEvent.target.value
                    }

                    targetField.changed = true
                } else {
                    console.error(`No field for name '${fieldName}' was found on form.`, form)
                }
            } else {
                console.error(`Field name was not defined so field value cannot be changed.`, form)
            }
        })
    }

    /**
     * Resets all validations on form.
     * @param form object holding fields.
     */
    export function resetAllValidations(form: any) {
        Object.values(form)
            .filter(isField)
            .map(field => field as Field<any>)
            .forEach(field => field.validation.reset())
    }

    /**
     * Returns true If all fields in form are valid.
     * @param form object holding fields.
     */
    export function isValid(form: any): boolean {
        return Object.values(form)
            .filter(isField)
            .map(field => field as Field<any>)
            .filter(field => !field.validation.valid).length === 0
    }

    /**
     * Resets all fields changed flag to false.
     * @param form object holding fields.
     */
    export function resetChanged(form: any) {
        Object.values(form)
            .filter(isField)
            .map(field => field as Field<any>)
            .forEach(field => field.changed = false)
    }

    /**
     * Returns true if any of fields on given object has "changed" flaf set to true.
     * @param form object holding fields. 
     */
    export function wasAnyChanged(form: any): boolean {
        return Object.values(form)
            .filter(isField)
            .map(field => field as Field<any>)
            .filter(field => field.changed === true).length > 0
    }

    /**
     * Returns field by name.
     * @param fieldName name of requested field.
     */
    function getField(form: any, fieldName: string): Field<any> | undefined {
        return Object.values(form)
            .filter(isField)
            .map(field => field as Field<any>)
            .filter((field: any) => field.name === fieldName)[0]
    }

    /**
     * Returns true when field value is same as field initial value.
     * @param field field to be checked.
     * @returns true when same. Otherwise returns false.
     */
    export function isTextSameAsInitial(field: Field<string>): boolean {
        return field.value === field.initialValue
    }

    /**
     * Returns true when field value is same as field initial value.
     * @param field field to be checked.
     * @returns true when same. Otherwise returns false.
     */
    export function isSelectSameAsInitial(field: Field<SelectField>): boolean {
        return field.value.code === field.initialValue.code
    }

    /**
     * Resets field initial value to current field value.
     * @param field field to be reset.
     */
    export function resetTextToInitial(field: Field<string>) {
        field.initialValue = field.value
    }

    /**
     * Resets field initial value to current field value.
     * @param field field to be reset.
     */
    export function resetSelectToInitial(field: Field<SelectField>) {
        field.initialValue = Object.assign({}, field.value)
    }


}