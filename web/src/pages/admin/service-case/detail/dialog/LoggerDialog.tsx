import { observer } from 'mobx-react'
import { Col } from '../../../../../common/components/Col'
import { Row } from '../../../../../common/components/Row'
import { LoggerDialogStore } from './LoggerDialogStore'
import { DateUtils } from '../../../../../common/utils/DateUtils'
import { useEffect } from 'react'

interface LoggerDialogProps {
    store: LoggerDialogStore
}

export const LoggerDialog: React.FC<LoggerDialogProps> = observer(props => {
    let store = props.store

    useEffect(() => {
        store.init()
    }, [store])

    return (
        <Row>
            <Col xs={12}>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Datum</th>
                            <th>Uživatel</th>
                            <th>Operátor</th>
                            <th>Událost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.logs.length > 0 ? (
                            store.logs.map((log, idx) => (
                                <tr key={idx}>
                                    <td className='p-2' width={200}>
                                        {DateUtils.toUIDateTime(log.date)}
                                    </td>
                                    <td className='p-2' width={200}>
                                        {log.user.picture && (
                                            <img
                                                src={log.user.picture}
                                                alt=''
                                                style={{ marginTop: '-5px' }}
                                                className='mr-2 rounded-circle'
                                                width={20}
                                            />
                                        )}
                                        {log.user.name} {log.user.surname}
                                    </td>
                                    <td className='p-2' width={100}>
                                        {log.user.isOperator ? 'Ano' : 'Ne'}
                                    </td>
                                    <td className='p-2'>{log.action}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className='p-2' colSpan={4}>
                                    Zatím zde nejsou žádné události
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Col>
        </Row>
    )
})
