import * as React from 'react'
import { observer } from 'mobx-react'

export interface InputGroupAddonProps {
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

export const InputGroupAddon: React.FC<InputGroupAddonProps> = observer(props => {
    return (
        <span className={`input-group-prepend ${props.className ?? ''}`} style={props.style}>
            {props.children}
        </span>
    )
})
