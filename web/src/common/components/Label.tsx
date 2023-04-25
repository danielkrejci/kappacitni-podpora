import * as React from 'react'
import { observer } from 'mobx-react'

export interface LabelProps {
    /**
     * Target input element id.
     */
    id?: string
    /**
     * Custom class on label element.
     */
    className?: string

    onClick?: () => void

    children?: React.ReactNode
}

export const Label: React.FC<LabelProps> = observer(props => {
    return (
        <label htmlFor={props.id} onClick={props.onClick} className={`form-label ${props.className ?? ''}`}>
            {props.children}
        </label>
    )
})
