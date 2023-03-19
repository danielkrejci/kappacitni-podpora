import * as React from 'react'
import { observer } from 'mobx-react'

export interface PagingProps {
    /**
     * Custom style on table element.
     */
    style?: React.CSSProperties
    /**
     * Custom class on table element.
     */
    className?: string
    /**
     * Enables next page button.
     */
    hasNext: boolean
    /**
     * Enables previous page button.
     */
    hasPrev: boolean
    /**
     * Handles Next button click.
     */
    onNextClick: () => void
    /**
     * Handles previous button click.
     */
    onPrevClick: () => void
}

export const Paging: React.FC<PagingProps> = observer(props => {
    return (
        <nav>
            <ul className='pagination justify-content-end'>
                <li className={`page-item${props.hasPrev ? '' : ' disabled'}`}>
                    <a
                        className='page-link'
                        href='/'
                        tabIndex={-1}
                        aria-disabled={props.hasPrev}
                        onClick={e => {
                            e.preventDefault()
                            if (props.hasPrev) {
                                props.onPrevClick()
                            }
                        }}>
                        Předchozí
                    </a>
                </li>
                <li className={`page-item${props.hasNext ? '' : ' disabled'}`}>
                    <a
                        className='page-link'
                        href='/'
                        aria-disabled={props.hasNext}
                        onClick={e => {
                            e.preventDefault()
                            if (props.hasNext) {
                                props.onNextClick()
                            }
                        }}>
                        Další
                    </a>
                </li>
            </ul>
        </nav>
    )
})
