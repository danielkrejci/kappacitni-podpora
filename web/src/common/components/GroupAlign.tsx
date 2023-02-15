import * as React from 'react'
import { observer } from 'mobx-react'

export interface GroupAlignProps {
    /**
     * Custom style on group align element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on group align element.
     */
    className?: string
    /**
     * Group flex horizontal alignment.
     */
    horizontal?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    /**
     * Group flex vertical alignment.
     */
    vertical?: 'start' | 'center' | 'end'
    /**
     * Margin top size.
     */
    mt?: 1 | 2 | 3 | 4 | 5
    /**
     * Margin bottom size.
     */
    mb?: 1 | 2 | 3 | 4 | 5
    /**
     * Gap size.
     */
    gap?: 1 | 2 | 3 | 4 | 5
    /**
     * Handles button click event.
     * @param e onClick event.
     */
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void

    children?: React.ReactNode
}

export const GroupAlign: React.FC<GroupAlignProps> = observer(props => {
    const marginSize = `${props.mt ? `mt-${props.mt}` : ''} ${props.mb ? `mb-${props.mb}` : ''}`
    const alignVertical = `align-items-${props.vertical ?? 'center'}`
    const alignHorizontal = `justify-content-${props.horizontal ?? 'start'}`
    const gapSize = `${props.gap ? `gap-${props.gap}` : ''}`

    return (
        <div
            style={props.style}
            onClick={e => {
                if (props.onClick) props.onClick(e)
            }}
            className={`d-flex ${marginSize} ${alignHorizontal} ${alignVertical} ${gapSize} ${props.className ?? ''}`}>
            {props.children}
        </div>
    )
})
