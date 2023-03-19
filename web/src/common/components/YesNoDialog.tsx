import * as React from 'react'
import { observer } from 'mobx-react'
import { action, makeObservable, observable } from 'mobx'
import { AlertDialogType } from './AlertDialog'

export interface YesNoDialogProps {
    store: YesNoDialogStore
}

export const YesNoDialog: React.FC<YesNoDialogProps> = observer(props => {
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
                                    <button
                                        type='button'
                                        className={`btn btn-sm btn-default`}
                                        onClick={() => {
                                            if (store.onNoAction) {
                                                store.onNoAction()
                                            }
                                            store.hide()
                                        }}>
                                        Ne
                                    </button>
                                    <button
                                        type='button'
                                        className={`btn btn-sm btn-${store.type}`}
                                        onClick={() => {
                                            store.onYesAction()
                                            store.hide()
                                        }}>
                                        Ano
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

export class YesNoDialogStore {
    visible = false

    title = ''

    type = AlertDialogType.Default

    content?: JSX.Element | string

    onYesAction: () => void = () => {}
    onNoAction?: () => void

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

    show = (onYesAction: () => void, onNoAction?: () => void, title?: string, type?: AlertDialogType, content?: JSX.Element | string) => {
        this.visible = true

        this.title = title ?? ''
        this.type = type ?? AlertDialogType.Default
        this.content = content
        this.onYesAction = onYesAction
        this.onNoAction = onNoAction
    }

    hide = () => {
        this.visible = false

        this.title = ''
        this.type = AlertDialogType.Default
        this.content = undefined
    }
}

export const defaultYesNoDialogStore = new YesNoDialogStore()

export function showYesNoDialog(
    onYesAction: () => void,
    onNoAction?: () => void,
    title?: string,
    content?: string,
    type?: AlertDialogType
) {
    defaultYesNoDialogStore.show(onYesAction, onNoAction, title, type, content)
}

export function hideYesNoDialog() {
    defaultYesNoDialogStore.hide()
}
