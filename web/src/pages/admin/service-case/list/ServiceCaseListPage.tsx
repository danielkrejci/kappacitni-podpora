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
import { navigationStore } from '../../../../App'
import { ListUtils } from '../../../../common/utils/ListUtils'
import Pagination from '../../../../common/components/Pagination'

interface ServiceCaseListPageProps {
    store: ServiceCaseListStore
}

export const ServiceCaseListPage: React.FC<ServiceCaseListPageProps> = observer(props => {
    const store = props.store
    const { search } = useLocation()

    useEffect(() => {
        store.init(search)
    }, [search, store])

    return (
        <>
            {store.isLoading && <Loader color='primary' size='lg' fullScreen={true} />}

            <Row mb={5}>
                <Col xs={12}>
                    <h1 className='mb-0'>Servisní případy</h1>
                </Col>
            </Row>

            <Row mb={3}>
                <Col xs={12}>
                    <Row horizontal='between'>
                        <Col xs={8}>
                            <Row>
                                <Col xs={4}>
                                    <FormGroup>
                                        <Label id='state'>Stav případu:</Label>
                                        <Select name='state' onFieldChange={() => store.reload()} field={store.filter.state} />
                                    </FormGroup>
                                </Col>
                                <Col xs={4}>
                                    <FormGroup>
                                        <Label id='operator'>Operátor:</Label>
                                        <Select name='operator' onFieldChange={() => store.reload()} field={store.filter.operators} />
                                    </FormGroup>
                                </Col>
                                <Col xs={4}>
                                    <FormGroup>
                                        <Label id='client'>Klient:</Label>
                                        <Select name='client' onFieldChange={() => store.reload()} field={store.filter.clients} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3} md={3} xl={2}>
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
                            {ListUtils.asList(store.serviceCases.data).map((serviceCase, idx) => (
                                <div className='p-3 service-case-item mb-4' key={`${serviceCase.id}_${idx}`}>
                                    <h3>
                                        #{serviceCase.id}
                                        <span className='text-muted float-right mt-2'>{DateUtils.toUIDateTime(serviceCase.dateBegin)}</span>
                                    </h3>
                                    <p>
                                        <strong>{serviceCase.client}</strong>&nbsp;
                                        {serviceCase.message}
                                    </p>
                                    {serviceCase.newMessagesCount > 0 && (
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
                                        {serviceCase.dateEnd && (
                                            <small className='text-muted ml-1'>&nbsp;{DateUtils.toUIDateTime(serviceCase.dateEnd)}</small>
                                        )}
                                    </p>
                                    <p>
                                        Případ řeší:&nbsp;
                                        {serviceCase.operators.map((operator, idx) => (
                                            <span key={`${idx}`}>
                                                <strong>{operator}</strong>
                                                {idx !== serviceCase.operators.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                    <Link className='btn btn-primary' to={navigationStore.href.adminServiceCaseDetail(serviceCase.id)}>
                                        Otevřít
                                    </Link>
                                </div>
                            ))}

                            <GroupAlign horizontal='end' mt={4}>
                                <Pagination
                                    page={store.currentPage}
                                    totalPages={store.serviceCases.totalPages}
                                    hasNext={store.serviceCases.hasNext}
                                    hasPrev={store.serviceCases.hasPrev}
                                    onNextClick={() => store.nextPage()}
                                    onPrevClick={() => store.prevPage()}
                                    onPageChangeClick={page => store.pageChange(page)}
                                />
                            </GroupAlign>
                        </>
                    ) : store.isFilterActive ? (
                        <p className='mt-5 text-center'>Vybraným filtrům neodpovídá žádný servisní případ.</p>
                    ) : (
                        <p className='mt-5 text-center'>Zatím nemáš žádné servisní případy.</p>
                    )}
                </Col>
            </Row>
        </>
    )
})
