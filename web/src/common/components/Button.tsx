import * as React from 'react'
import { observer } from 'mobx-react'
import { Loader } from './Loader'

export interface ButtonProps {
    /**
     * Button element id.
     */
    id?: string
    /**
     * Button size (md = default).
     */
    size?: 'xs' | 'sm' | 'md' | 'lg'
    /**
     * Button style type.
     */
    type?:
        | 'primary'
        | 'accent'
        | 'accent-light'
        | 'accent-dark'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'link'
        | 'light'
        | 'lighter'
        | 'gray'
        | 'dark'
        | 'black'
    /**
     * Removes background color.
     */
    transparent?: boolean
    /**
     * Removes border.
     */
    noBorder?: boolean
    /**
     * Button action type.
     */
    actionType?: 'button' | 'submit'
    /**
     * Custom style on button element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on button element.
     */
    className?: string
    /**
     * Button disabled
     */
    disabled?: boolean
    /**
     * Handles button click event.
     * @param e onClick event.
     */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    /**
     * Handles button onBlur event.
     * @param e onBlur event.
     */
    onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void
    /**
     * Button ref. // TODO resolve type
     */
    ref?: any
    /**
     * Replaces button content with animated loader icon.
     */
    showLoader?: boolean

    children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = observer(
    React.forwardRef((props, ref) => {
        React.useEffect(() => {}, [ref])
        return (
            <button
                id={props.id ?? ''}
                className={`btn ${props.noBorder ? 'btn-no-border' : ''} ${props.transparent ? 'btn-transparent' : ''} btn-${
                    props.type ?? 'primary'
                } ${props.size ? `btn-${props.size}` : ''} ${props.className ?? ''}`}
                type={props.actionType ?? 'button'}
                style={props.style}
                disabled={props.disabled || props.showLoader}
                ref={ref as any} // TODO resolve type
                onClick={e => {
                    if (props.onClick) props.onClick(e)
                }}
                onBlur={e => {
                    if (props.onBlur) props.onBlur(e)
                }}>
                {props.showLoader && (
                    <Loader
                        size='md'
                        align='center'
                        color={
                            props.type === 'secondary' || props.type === 'warning' ? 'dark' : props.type === 'link' ? 'primary' : 'light'
                        }
                    />
                )}
                {!props.showLoader && props.children}
            </button>
        )
    })
)
