import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { ServiceCaseListStore } from './ServiceCaseListStore'
import { Row } from '../../../../common/components/Row'
import { Col } from '../../../../common/components/Col'
import { FormGroup } from '../../../../common/components/FormGroup'
import { Label } from '../../../../common/components/Label'
import { Select } from '../../../../common/components/Select'
import { Loader } from '../../../../common/components/Loader'
import { DateUtils } from '../../../../common/utils/DateUtils'
import { Link } from 'react-router-dom'
import { GroupAlign } from '../../../../common/components/GroupAlign'
import { Paging } from '../../../../common/components/Paging'

interface ServiceCaseListPageProps {
    store: ServiceCaseListStore
}

export const ServiceCaseListPage: React.FC<ServiceCaseListPageProps> = observer(props => {
    const store = props.store
    const { search } = useLocation()

    useEffect(() => {
        if (!store.initDone) {
            store.init(search)
        }
    }, [search, store])

    return (
        <>
            {store.isLoading && <Loader color='primary' size='lg' fullScreen={true} />}

            <Row>
                <Col xs={12}>
                    <h1 className='mb-5'>Servisní případy</h1>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Row horizontal='between'>
                        <Col xs={6}>
                            <Row>
                                <Col xs={6}>
                                    <FormGroup>
                                        <Label id='state'>Stav případu:</Label>
                                        <Select name='state' onFieldChange={() => store.reload()} field={store.filter.state} />
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup>
                                        <Label id='operator'>Operátor:</Label>
                                        <Select name='operator' onFieldChange={() => store.reload()} field={store.filter.operators} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={2}>
                            <FormGroup>
                                <Label id='operator'>Seřadit podle:</Label>
                                <Select name='sort' onFieldChange={() => store.reload()} field={store.filter.sort} />
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col xs={12} mb={4}>
                    {store.serviceCases.data.length > 0 ? (
                        <>
                            {store.serviceCases.data.map(serviceCase => (
                                <div className='p-3 service-case-item'>
                                    <h3>
                                        #{serviceCase.id}
                                        <span className='text-muted float-right mt-2'>{DateUtils.toUIDateTime(serviceCase.dateBegin)}</span>
                                    </h3>
                                    <p>
                                        <strong>{serviceCase.client}</strong>&nbsp;
                                        {serviceCase.message}
                                    </p>
                                    {serviceCase.newMessagesCount && (
                                        <p className='mb-1'>
                                            Nové zprávy:&nbsp;<strong>{serviceCase.newMessagesCount}</strong>
                                        </p>
                                    )}
                                    <p className='mb-1'>
                                        Stav:&nbsp;
                                        <strong>
                                            {store.codetables.states.find(s => s.code.toString() === serviceCase.stateId.toString())
                                                ?.value ?? '-'}
                                        </strong>
                                        {serviceCase.dateEnd && <small>{DateUtils.toUIDateTime(serviceCase.dateEnd)}</small>}
                                    </p>
                                    <p>
                                        Případ řeší:&nbsp;
                                        {serviceCase.operators.map((operator, idx) => (
                                            <span key={idx}>
                                                <strong>{operator}</strong>
                                                {idx !== serviceCase.operators.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                    <Link className='btn btn-primary' to={`#`}>
                                        Otevřít
                                    </Link>
                                </div>
                            ))}

                            <GroupAlign horizontal='end' mt={5}>
                                <Paging
                                    hasNext={store.serviceCases.hasNext}
                                    hasPrev={store.serviceCases.hasPrev}
                                    onNextClick={() => store.nextPage()}
                                    onPrevClick={() => store.prevPage()}
                                />
                            </GroupAlign>
                        </>
                    ) : store.isFilterActive ? (
                        <p className='mt-5 text-center'>Vybraným filtrům neodpovídá žádný servisní případ.</p>
                    ) : (
                        <p className='mt-5 text-center'>Zatím nemáš žádné servisní případy.</p>
                    )}
                    {store.isFilterActive}
                </Col>
            </Row>
        </>
    )
})
