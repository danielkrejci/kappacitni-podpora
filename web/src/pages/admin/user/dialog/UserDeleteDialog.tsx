import { observer } from 'mobx-react'
import { UserDeleteDialogStore } from './UserDeleteDialogStore'

interface UserDeleteDialogProps {
    store: UserDeleteDialogStore
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = observer(props => {
    let store = props.store

    return (
        <>
            Opravdu chete odstranit operátora&nbsp;
            <strong>
                {store.selectedUser?.name} {store.selectedUser?.surname}
            </strong>
            &nbsp;?
        </>
    )
})
