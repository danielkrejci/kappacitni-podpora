import * as React from 'react'
import { observer } from 'mobx-react'

export interface LoaderProps {
    /**
    * Custom style on select element.
    */
    style?: React.CSSProperties
    /**
     * Custom class on input element.
     */
    className?: string
    /**
     * Loader size (default = md).
     */
    size?: 'sm' | 'md' | 'lg' | 'xl'
    /**
     * Loader color (default = dark).
     */
    color?: 'primary' | 'light' | 'dark'
    /**
     * Loader align.
     */
    align?: 'center'
    /**
     * Full screen loader with backdrop background.
     */
    fullScreen?: boolean
}

export const Loader: React.FC<LoaderProps> = observer(props => {
    return (
        <>
            <div className={`loader-svg loader-${props.size ?? 'md'} loader-${props.color ?? 'dark'} ${props.align ? 'loader-center' : ''} ${props.fullScreen ? 'loader-fullscreen' : ''} ${props.className ?? ''}`} style={props.style}>
                <svg viewBox="0 0 24 24">
                    <g transform="translate(1 1)" fillRule="nonzero" fill="none">
                        <circle cx="11" cy="11" r="11"></circle>
                        <path d="M10.998 22a.846.846 0 0 1 0-1.692 9.308 9.308 0 0 0 0-18.616 9.286 9.286 0 0 0-7.205 3.416.846.846 0 1 1-1.31-1.072A10.978 10.978 0 0 1 10.998 0c6.075 0 11 4.925 11 11s-4.925 11-11 11z" fill="currentColor"></path>
                    </g>
                </svg>
            </div>
            {props.fullScreen &&
                <div className="modal-backdrop" />
            }
        </>
    )
})