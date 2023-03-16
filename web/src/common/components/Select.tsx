import { runInAction } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Field } from '../forms/Field'
import { SelectField } from '../forms/SelectField'
import { FormFeedback } from './FormFeedback'

export interface SelectProps {
    /**
     * Custom class on Select element.
     */
    className?: string
    /**
     * Select element id.
     */
    id?: string
    /**
     * Input element name.
     */
    name?: string
    /**
     * Field with select data.
     */
    field: Field<SelectField>
    /**
     * Called when field data are changed
     */
    onFieldChange?: (field: Field<SelectField>) => void
    /**
     * Custom style on select element.
     */
    style?: React.CSSProperties
    /**
     * Select element disabled attribute
     */
    disabled?: boolean
    /**
     * Select element required attribute
     */
    required?: boolean
}

export const Select: React.FC<SelectProps> = observer(props => {
    // Action called on selected value change
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        runInAction(() => {
            const selected = props.field.options().filter(opt => opt.code.toString() === e.target.value.toString())[0]
            if (selected) {
                props.field.value = selected

                // Reset field validation when item is selected
                props.field.validation.reset()
            }

            if (props.onFieldChange) {
                props.onFieldChange(props.field)
            }
            props.field.changed = true
        })
    }
    // Flag says if field has any validation errors
    const fieldValid = props.field.validation.valid
    return (
        <>
            <select
                id={props.id || props.name || props.field.name}
                name={props.name || props.field.name}
                className={`form-control form-select ${!fieldValid ? 'is-invalid' : ''} ${props.className ?? ''}`}
                style={props.style}
                required={props.required}
                disabled={props.disabled}
                value={props.field.value.code}
                onChange={e => onChange(e)}>
                {props.field.options().map(opt => {
                    return (
                        <option key={`opt_${props.id || props.field.name}_${opt.code}`} value={opt.code} disabled={opt.disabled}>
                            {opt.value}
                        </option>
                    )
                })}
            </select>
            {fieldValid && props.required && (
                <FormFeedback type='muted' size='sm' className='mt-1 ps-1'>
                    Povinný údaj
                </FormFeedback>
            )}
            {!fieldValid && (
                <FormFeedback type='invalid' size='sm' className='mt-1 ps-1'>
                    {props.field?.validation.errorLabels.join(', ')}
                </FormFeedback>
            )}
        </>
    )
})
