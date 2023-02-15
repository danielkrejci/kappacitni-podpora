import * as React from 'react'
import { observer } from 'mobx-react'

export interface InputGroupProps {
    /**
     * Custom style on input group element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on input group element.
     */
    className?: string
    /**
     * Input group size.
     */
    size?: 'lg' | 'sm'

    children?: React.ReactNode
}

export const InputGroup: React.FC<InputGroupProps> = observer(props => {
    return (
        <div
            className={`input-group ${props.size ? `input-group-${props.size}` : ''} ${props.className ?? ''}`}
            style={props.style}
            aria-label=''
            aria-describedby=''>
            {props.children}
        </div>
    )
})
