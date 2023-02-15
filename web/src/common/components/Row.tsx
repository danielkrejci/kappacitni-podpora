import * as React from 'react'
import { observer } from 'mobx-react'

interface RowProps {
    /**
     * Custom style on Row element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on Row element.
     */
    className?: string
    /**
     * Custom ID attribute on Row element.
     */
    id?: string
    /**
     * Margin top size.
     */
    mt?: 0 | 1 | 2 | 3 | 4 | 5
    /**
     * Margin bottom size.
     */
    mb?: 0 | 1 | 2 | 3 | 4 | 5
    /**
     * Gap size.
     */
    gap?: 1 | 2 | 3 | 4 | 5
    /**
     * Vertical alignment.
     */
    vertical?: 'start' | 'center' | 'end'
    /**
     * Horizontal alignment.
     */
    horizontal?: 'start' | 'center' | 'end' | 'between' | 'around'

    children: React.ReactNode
}

export const Row: React.FC<RowProps> = observer(props => {
    const marginSize = `${props.mt ? `mt-${props.mt}` : ''} ${props.mb ? `mb-${props.mb}` : ''}`
    const gapSize = `${props.gap ? `g-${props.gap}` : ''}`
    const alignVertical = `${props.vertical ? `align-items-${props.vertical}` : ''}`
    const alignHorizontal = `${props.horizontal ? `justify-content-${props.horizontal}` : ''}`

    return (
        <div
            id={props.id ?? ''}
            className={`row ${props.className ?? ''} ${marginSize} ${gapSize} ${alignVertical} ${alignHorizontal}`}
            style={props.style}>
            {props.children}
        </div>
    )
})
