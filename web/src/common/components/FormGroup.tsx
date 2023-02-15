import * as React from 'react'
import { observer } from 'mobx-react'

export interface FormGroupProps {
    /**
     * Custom style on input group addon element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on input group addon element.
     */
    className?: string

    children?: React.ReactNode
}

export const FormGroup: React.FC<FormGroupProps> = observer(props => {
    return (
        <div className={`form-group ${props.className ?? ''}`} style={props.style}>
            {props.children}
        </div>
    )
})
