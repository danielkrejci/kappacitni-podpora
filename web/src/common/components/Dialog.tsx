import * as React from 'react'
import { observer } from 'mobx-react'
import { action, makeObservable, observable } from 'mobx'

export class DialogStore {
    visible = false

    constructor() {
        makeObservable(this, {
            visible: observable,
            show: action,
            hide: action,
        })
    }

    show() {
        this.visible = true
        document.body.classList.add('modal-open')
    }

    hide() {
        this.visible = false
        document.body.classList.remove('modal-open')
    }
}

export interface DialogProps {
    /**
     * Custom style on Dialog component.
     */
    style?: React.CSSProperties
    /**
     * Custom class on Dialog component.
     */
    className?: string
    /**
     * Dialog component ID.
     */
    id?: string
    /**
     * Dialog size (default = md).
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
    /**
     * Dialog title.
     */
    title?: string
    /**
     * Dialog store for handling visiblity.
     */
    store: DialogStore
    /**
     * Buttons displayed in dialog footer.
     */
    buttons?: React.ReactElement<any>[]

    children?: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = observer(props => {
    const store = props.store
    React.useEffect(() => {
        if (store.visible) {
            document.body.classList.add('modal-open')
        } else {
            document.body.classList.remove('modal-open')
        }
        return () => document.body.classList.remove('modal-open')
    }, [store.visible])

    return (
        <>
            {store.visible && (
                <>
                    <div className='modal fade show' id={props.id ?? ''} tabIndex={-1} aria-hidden='true'>
                        <div
                            className={`modal-dialog ${props.className ?? ''} ${props.size ? `modal-${props.size}` : 'modal-md'}`}
                            style={props.style}>
                            <div className='modal-content'>
                                {props.title && (
                                    <div className='modal-header'>
                                        <h5 className='modal-title'>{props.title}</h5>
                                        <button
                                            onClick={() => store.hide()}
                                            type='button'
                                            className='btn-close'
                                            data-bs-dismiss='modal'></button>
                                    </div>
                                )}

                                <div className='modal-body'>{props.children}</div>

                                {props.buttons && <div className='modal-footer'>{props.buttons}</div>}
                            </div>
                        </div>
                    </div>
                    <div className='modal-backdrop fade show'></div>
                </>
            )}
        </>
    )
})
