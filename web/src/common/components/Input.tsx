import * as React from 'react'
import { observer } from 'mobx-react'
import { FormFeedback } from './FormFeedback'
import { runInAction } from 'mobx'
import { Field } from '../forms/Field'

export interface InputProps {
    /**
     * Input element id.
     */
    id?: string
    /**
     * Input element name.
     */
    name?: string
    /**
     * Field with select data.
     */
    field?: Field<string>
    /**
     * Input type attribute.
     */
    type?: 'text' | 'number' | 'password' | 'date' | 'time' | 'email' | 'tel'
    /**
     * Input value attribute (overrides value from field).
     */
    value?: string | number
    /**
     * Input placeholder.
     */
    placeholder?: string
    /**
     * Input aria label.
     */
    ariaLabel?: string
    /**
     * Min, Max, Step values for numberic input.
     */
    min?: number
    max?: number
    step?: number
    maxLength?: number
    /**
     * Custom style on select element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on input element.
     */
    className?: string
    /**
     * Input element disabled attribute
     */
    disabled?: boolean
    /**
     * Input element readonly attribute
     */
    readonly?: boolean
    /**
     * Input element autoFocus attribute
     */
    autoFocus?: boolean
    /**
     * Input element required attribute
     */
    required?: boolean
    /**
     * Handles input on change event.
     * @param e onChange event.
     */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    /**
     * Handles key down event.
     */
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    /**
     * Handles Enter key down event.
     */
    onEnterKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = observer(props => {
    // Flag says if field has any validation errors
    const fieldValid = props.field !== undefined ? props.field.validation.valid : true
    const max = props.max ?? (props.type === 'number' ? 2000000000 : undefined)
    return (
        <>
            <input
                id={props.id || props.field?.name}
                name={props.name || props.field?.name}
                className={`form-control ${!fieldValid ? 'is-invalid' : ''} ${props.className ?? ''}`}
                style={props.style}
                type={props.type ?? 'text'}
                disabled={props.disabled}
                value={props.value || props.field?.value}
                max={max}
                min={props.min}
                step={props.step}
                placeholder={props.placeholder}
                aria-label={props.ariaLabel}
                autoFocus={props.autoFocus}
                readOnly={props.readonly}
                required={props.required}
                autoComplete='off'
                onKeyDown={e => {
                    if (props.onKeyDown) {
                        props.onKeyDown(e)
                    }
                    if (props.onEnterKeyDown && e.key.toLowerCase() === 'enter') {
                        props.onEnterKeyDown(e)
                    }
                }}
                onKeyUp={e =>
                    runInAction(() => {
                        if (props.type === 'number' && props.field?.value && Number(props.field?.value) > (max ?? 1))
                            props.field.value = (max ?? 1).toString()
                    })
                }
                maxLength={props.maxLength}
                onChange={e => {
                    if (props.field) props.field.onChange(e)
                    if (props.onChange) props.onChange(e)
                }}
            />

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
