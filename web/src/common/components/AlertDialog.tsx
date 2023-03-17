import * as React from 'react'
import { observer } from 'mobx-react'
import { action, makeObservable, observable } from 'mobx'

export enum AlertDialogType {
    Default = 'secondary',
    Success = 'success',
    Warning = 'warning',
    Danger = 'danger',
}

export interface AlertDialogProps {
    store: AlertDialogStore
}

export const AlertDialog: React.FC<AlertDialogProps> = observer(props => {
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
                    <div
                        className={`modal fade show d-block alert-dialog alert-dialog-${store.type}`}
                        tabIndex={-1}
                        aria-labelledby='staticBackdropLabel'
                        aria-hidden='true'>
                        <div className='modal-dialog modal-dialog-centered'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h3 className='modal-title'>{store.title}</h3>
                                </div>
                                <div className='modal-body'>{store.content}</div>
                                <div className='modal-footer'>
                                    <button type='button' className={`btn btn-${store.type}`} onClick={store.hide}>
                                        Zavřít
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='modal-backdrop fade show' />
                </>
            )}
        </>
    )
})

export class AlertDialogStore {
    visible = false

    title = ''

    type = AlertDialogType.Default

    content?: JSX.Element | string

    constructor() {
        makeObservable(this, {
            visible: observable,
            title: observable,
            type: observable,
            content: observable,
            show: action,
            hide: action,
        })
    }

    show = (title?: string, type?: AlertDialogType, content?: JSX.Element | string) => {
        this.visible = true

        this.title = title ?? ''
        this.type = type ?? AlertDialogType.Default
        this.content = content
    }

    hide = () => {
        this.visible = false

        this.title = ''
        this.type = AlertDialogType.Default
        this.content = undefined
    }
}

export const defaultAlertDialogStore = new AlertDialogStore()

export function showAlertDialog(title?: string, content?: JSX.Element | string, type?: AlertDialogType) {
    defaultAlertDialogStore.show(title, type, content)
}

export function hideAlertDialog() {
    defaultAlertDialogStore.hide()
}
