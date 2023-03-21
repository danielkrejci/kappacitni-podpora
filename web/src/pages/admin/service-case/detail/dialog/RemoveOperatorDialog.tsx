import { observer } from 'mobx-react'
import { RemoveOperatorDialogStore } from './RemoveOperatorDialogStore'

interface RemoveOperatorDialogProps {
    store: RemoveOperatorDialogStore
}

export const RemoveOperatorDialog: React.FC<RemoveOperatorDialogProps> = observer(props => {
    let store = props.store

    return (
        <>
            Opravdu chete odebrat operátora&nbsp;
            <strong>
                {store.selectedUser?.name} {store.selectedUser?.surname}
            </strong>
            &nbsp;?
        </>
    )
})
