import * as React from 'react'
import { observer } from 'mobx-react'

/**
 * Col size in range 1-12.
 */
type ColSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface ColProps {
    /**
     * Col size.
     */
    col?: ColSize | 'auto'
    /**
     * Optional responsive col sizes.
     */
    xs?: ColSize | 'auto'
    sm?: ColSize | 'auto'
    md?: ColSize | 'auto'
    lg?: ColSize | 'auto'
    xl?: ColSize | 'auto'
    xxl?: ColSize | 'auto'
    /**
     * Col offset size.
     */
    offset?: ColSize
    /**
     * Custom style on Col element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on Col element.
     */
    className?: string
    /**
     * Custom ID attribute on Col element.
     */
    id?: string
    /**
     * Margin top size.
     */
    mt?: 1 | 2 | 3 | 4 | 5
    /**
     * Margin bottom size.
     */
    mb?: 1 | 2 | 3 | 4 | 5

    children: React.ReactNode
}

export const Col: React.FC<ColProps> = observer(props => {
    const marginSize = `${props.mt ? `mt-${props.mt}` : ''} ${props.mb ? `mb-${props.mb}` : ''}`

    let columns: string
    let offset: string = props.offset ? `offset-md-${props.offset}` : ''

    if (props.xs || props.sm || props.md || props.lg || props.xl || props.xxl) {
        columns =
            (props.xs ? ` col-${props.xs}` : ' col') +
            (props.sm ? ` col-sm-${props.sm}` : '') +
            (props.md ? ` col-md-${props.md}` : '') +
            (props.lg ? ` col-lg-${props.lg}` : '') +
            (props.xl ? ` col-xl-${props.xl}` : '') +
            (props.xxl ? ` col-xxl-${props.xxl}` : '')
    } else {
        columns = props.col ? `col-${props.col}` : 'col'
    }

    return (
        <div id={props.id ?? ''} className={`${columns} ${offset} ${marginSize} ${props.className ?? ''}`} style={props.style}>
            {props.children}
        </div>
    )
})
