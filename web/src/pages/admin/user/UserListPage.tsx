import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { UserType } from '../../../api/models/User'
import { Button } from '../../../common/components/Button'
import { Dialog } from '../../../common/components/Dialog'
import { Loader } from '../../../common/components/Loader'
import { YesNoDialog } from '../../../common/components/YesNoDialog'
import { ListUtils } from '../../../common/utils/ListUtils'
import { UserListStore } from './UserListStore'
import { UserAddDialog } from './dialog/UserAddDialog'
import { UserDeleteDialog } from './dialog/UserDeleteDialog'
import { UserDetailDialog } from './dialog/UserDetailDialog'

interface UserListPageProps {
    store: UserListStore
}

export const UserListPage: React.FC<UserListPageProps> = observer(props => {
    const store = props.store
    const { type } = useParams<{ type: UserType }>()

    useEffect(() => {
        store.init(type)
    }, [type, store])

    return (
        <>
            {store.isLoading && <Loader color='primary' size='lg' fullScreen={true} />}

            <Dialog
                store={store.addDialogStore}
                title='Přidat operátora'
                buttons={[
                    <Button key={ListUtils.randomKey()} size='sm' onClick={() => store.addDialogStore.save()}>
                        Uložit
                    </Button>,
                ]}>
                <UserAddDialog store={store.addDialogStore} />
            </Dialog>

            <Dialog
                store={store.detailDialogStore}
                title='Detail uživatele'
                buttons={[
                    store.detailDialogStore.editMode ? (
                        <Button key={ListUtils.randomKey()} size='sm' onClick={() => store.detailDialogStore.save()}>
                            Uložit
                        </Button>
                    ) : (
                        <Button key={ListUtils.randomKey()} size='sm' onClick={() => (store.detailDialogStore.editMode = true)}>
                            Upravit
                        </Button>
                    ),
                ]}>
                <UserDetailDialog store={store.detailDialogStore} />
            </Dialog>

            <YesNoDialog store={store.deleteDialogStore} />

            <div className='row clearfix'>
                <div className='col-6'>
                    <h1 className='mb-5'>{store.usersType === UserType.CLIENT.toLocaleLowerCase() ? 'Klienti' : 'Operátoři'}</h1>
                </div>
                {store.usersType === UserType.OPERATOR.toLocaleLowerCase() && (
                    <div className='col-6 text-right'>
                        <Button size='sm' onClick={() => store.showAddDialog()}>
                            Přidat operátora
                        </Button>
                    </div>
                )}
            </div>

            <div className='row clearfix'>
                <div className='col-12'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Jméno a příjmení</th>
                                <th>E-mail</th>
                                <th>Telefon</th>
                                <th>Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.users.length > 0 ? (
                                store.users.map((user, idx) => (
                                    <tr key={idx}>
                                        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
                                            {user.name} {user.surname}
                                        </td>
                                        <td style={{ width: '250px' }}>{user.email}</td>
                                        <td style={{ width: '200px' }}>{user.phone}</td>
                                        <td style={{ width: '100px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                                            <Button className='mr-1' size='sm' onClick={() => store.showDetailDialog(user)}>
                                                Detail
                                            </Button>
                                            <Button className='mr-1' size='sm' onClick={() => store.showDetailDialog(user, true)}>
                                                Upravit
                                            </Button>
                                            <Button
                                                size='sm'
                                                type='danger'
                                                onClick={() =>
                                                    store.showDeleteDialog(user, <UserDeleteDialog store={store.deleteDialogStore} />)
                                                }>
                                                Odstranit
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>Zatím zde nejsou žádní uživatelé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
})
