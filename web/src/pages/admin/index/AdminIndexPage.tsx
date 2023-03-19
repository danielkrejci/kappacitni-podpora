import { AdminIndexStore } from './AdminIndexStore'

interface AdminIndexPageProps {
    store: AdminIndexStore
}

export const AdminIndexPage = (props: AdminIndexPageProps): JSX.Element => {
    return (
        <>
            <h1 className='mb-5'>Úvodní stránka</h1>

            <h2 className='mb-4'>Statistiky</h2>

            <div className='row clearfix mb-3'>
                <div className='col-12'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th style={{ width: '300px' }}>Operátor</th>
                                <th className='d-flex align-items-center' style={{ border: 0, padding: '5px' }}>
                                    <span style={{ whiteSpace: 'nowrap' }} className='mr-3'>
                                        Dokočené případy
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={2}>Žádné uzavřené servisní případy v tomto období.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='col-12'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th style={{ width: '300px' }}>Operátor</th>
                                <th>Aktuálně řešené případy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={2}>Aktuálně nejsou řešeny žádné servisní případy.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='row clearfix'>
                <div className='col-4'>
                    <p className='mb-2'>
                        Celkem případů:
                        <strong>0</strong>
                    </p>
                    <p className='mb-2'>
                        Celkem aktivních:
                        <strong>0</strong>
                    </p>
                    <p className='mb-2'>
                        Celkem uzavřených:
                        <strong>0</strong>
                    </p>
                    <p className='mb-2'>
                        Celkem klientů:
                        <strong>0</strong>
                    </p>
                    <p className='mb-2'>
                        Celkem operátorů:
                        <strong>0</strong>
                    </p>
                </div>
            </div>
        </>
    )
}
