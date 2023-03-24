import { useEffect } from 'react'
import { Col } from '../../../common/components/Col'
import { Row } from '../../../common/components/Row'
import { AdminIndexStore } from './AdminIndexStore'

interface AdminIndexPageProps {
    store: AdminIndexStore
}

export const AdminIndexPage = (props: AdminIndexPageProps): JSX.Element => {
    const store = props.store

    useEffect(() => {
        store.init()
    }, [store])

    return (
        <>
            <h1 className='mb-5'>Úvodní stránka</h1>

            <h2 className='mb-4'>Statistiky</h2>

            <Row mb={3}>
                <Col>
                    <p className='alert alert-primary text-nowrap'>
                        Celkem případů:&nbsp;
                        <strong>{store.stats.total}</strong>
                    </p>
                </Col>
                <Col>
                    <p className='alert alert-primary text-nowrap'>
                        Celkem aktivních:&nbsp;
                        <strong>{store.stats.active.total}</strong>
                    </p>
                </Col>
                <Col>
                    <p className='alert alert-primary text-nowrap'>
                        Celkem uzavřených:&nbsp;
                        <strong>{store.stats.closed.total}</strong>
                    </p>
                </Col>
                <Col>
                    <p className='alert alert-primary text-nowrap'>
                        Celkem klientů:&nbsp;
                        <strong>{store.stats.clients}</strong>
                    </p>
                </Col>
                <Col>
                    <p className='alert alert-primary text-nowrap'>
                        Celkem operátorů:&nbsp;
                        <strong>{store.stats.operators}</strong>
                    </p>
                </Col>
            </Row>

            <Row>
                <Col xs={12} xl={6}>
                    <table className='table table-bordered table-sm' style={{ tableLayout: 'fixed' }}>
                        <thead className='thead-light'>
                            <tr>
                                <th className='p-2 text-nowrap'>Operátor</th>
                                <th className='p-2 text-nowrap'>Dokočené případy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.stats.closed.operators.length > 0 ? (
                                store.stats.closed.operators.map((operator, idx) => (
                                    <tr key={idx}>
                                        <td className='p-2 text-nowrap'>{operator.name}</td>
                                        <td className='p-2'>{operator.closed}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='p-2' colSpan={2}>
                                        Aktuálně nejsou uzavřeny žádné servisní případy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Col>
                <Col xs={12} xl={6}>
                    <table className='table table-bordered table-sm' style={{ tableLayout: 'fixed' }}>
                        <thead className='thead-light'>
                            <tr>
                                <th className='p-2 text-nowrap'>Operátor</th>
                                <th className='p-2 text-nowrap'>Aktuálně řešené případy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.stats.active.operators.length > 0 ? (
                                store.stats.active.operators.map((operator, idx) => (
                                    <tr key={idx}>
                                        <td className='p-2 text-nowrap'>{operator.name}</td>
                                        <td className='p-2'>{operator.active}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className='p-2' colSpan={2}>
                                        Aktuálně nejsou řešeny žádné servisní případy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </>
    )
}
