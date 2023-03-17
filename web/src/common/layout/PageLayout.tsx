import { observer } from 'mobx-react'
import React from 'react'
import { AlertDialog, defaultAlertDialogStore } from '../components/AlertDialog'

interface PageLayoutProps {
    children: React.ReactNode
}

export const PageLayout: React.FC<PageLayoutProps> = observer(props => {
    return (
        <>
            <AlertDialog store={defaultAlertDialogStore} />
            {props.children}
        </>
    )
})
