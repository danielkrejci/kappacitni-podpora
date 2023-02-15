import * as React from 'react'
import { observer } from 'mobx-react'
import { FormFeedback } from './FormFeedback'
import { Field } from '../forms/Field'
import { GroupAlign } from './GroupAlign'

export interface TextareaProps {
    /**
     * Textarea element id.
     */
    id?: string
    /**
     * Field with select data.
     */
    field: Field<string>
    /**
     * Textarea type attribute.
     */
    type?: 'text' | 'number' | 'password'
    /**
     * Custom style on select element.
     */
    style?: React.CSSProperties
    /**
     * Textarea element disabled attribute
     */
    disabled?: boolean
    /**
     * Textarea element required attribute
     */
    required?: boolean
    /**
     * Textarea element maxLength attribute
     */
    maxLength?: number
    /**
     * Handles textarea on change event.
     * @param e onChange event.
     */
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const Textarea: React.FC<TextareaProps> = observer(props => {
    // Flag says if field has any validation errors
    const fieldValid = props.field?.validation.valid
    return (
        <>
            <textarea
                id={props.id || props.field.name}
                name={props.field.name}
                className={`form-control ${!fieldValid ? 'is-invalid' : ''}`}
                style={props.style}
                required={props.required}
                disabled={props.disabled}
                value={props.field.value}
                maxLength={props.maxLength}
                onChange={e => {
                    if (props.field) props.field.onChange(e)
                    if (props.onChange) props.onChange(e)
                }}
            />
            <GroupAlign horizontal='between'>
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
                {props.maxLength && (
                    <FormFeedback type={props.field.value.length > props.maxLength ? 'invalid' : 'muted'} className='mt-1 ps-1' size='sm'>
                        {props.field.value.length} / {props.maxLength} znaků
                    </FormFeedback>
                )}
            </GroupAlign>
        </>
    )
})
