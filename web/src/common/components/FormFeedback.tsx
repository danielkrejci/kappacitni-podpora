import * as React from 'react'
import { observer } from 'mobx-react'

export interface FormFeedbackProps {
    /**
     * Custom style on feedback element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on feedback element.
     */
    className?: string
    /**
     * Feedback type.
     */
    type: 'valid' | 'invalid' | 'muted'
    /**
     * Feedback text size.
     */
    size?: 'sm' | 'md' | 'lg'

    children?: React.ReactNode
}

export const FormFeedback: React.FC<FormFeedbackProps> = observer(props => {
    const size = props.size ?? 'md'
    return (
        <div className={`form-feedback feedback-${size} ${props.type}-feedback ${props.className ?? ''}`} style={props.style}>
            {props.children}
        </div>
    )
})
