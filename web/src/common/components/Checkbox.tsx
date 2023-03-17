import * as React from 'react'
import { observer } from 'mobx-react'
import { FormFeedback } from './FormFeedback'
import { Field } from '../forms/Field'

export interface CheckboxProps {
    /**
     * Custom style on checkbox element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on checkbox element.
     */
    className?: string
    /**
     * Checkbox inline layout.
     */
    inline?: boolean
    /**
     * Checkbox element id.
     */
    id?: string
    /**
     * Field with select data.
     */
    field?: Field<boolean>
    /**
     * Checkbox checked attribute (overrides value from field).
     */
    checked?: boolean
    /**
     * Checkbox label.
     */
    label?: string
    /**
     * Checkbox element disabled attribute.
     */
    disabled?: boolean
    /**
     * Checkbox element required attribute
     */
    required?: boolean
    /**
     * Checkbox aria label.
     */
    ariaLabel?: string
    /**
     * Handles checkbox on change event.
     * @param e onChange event.
     */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void

    children?: React.ReactNode
}

export const Checkbox: React.FC<CheckboxProps> = observer(props => {
    // Flag says if field has any validation errors
    const fieldValid = props.field?.validation.valid
    return (
        <div className={`form-check ${props.inline ? 'form-check-inline' : ''} ${props.className ?? ''}`} style={props.style}>
            <input
                id={props.id || props.field?.name}
                name={props.field?.name}
                checked={props.checked || props.field?.value}
                disabled={props.disabled}
                aria-label={props.ariaLabel}
                className='form-check-input'
                required={props.required}
                type='checkbox'
                onChange={e => {
                    if (props.field) props.field.onChange(e)
                    if (props.onChange) props.onChange(e)
                }}
            />
            <label className='form-check-label' htmlFor={props.id || props.field?.name}>
                {props.label ?? props.children}
            </label>
            {fieldValid && props.required && (
                <FormFeedback type='muted' size='sm' className='mt-1 ps-1 ms-0'>
                    Povinný údaj
                </FormFeedback>
            )}
            {!fieldValid && (
                <FormFeedback type='invalid' size='sm' className='mt-1 ps-1 ms-0'>
                    {props.field?.validation.errorLabels.join(', ')}
                </FormFeedback>
            )}
        </div>
    )
})
