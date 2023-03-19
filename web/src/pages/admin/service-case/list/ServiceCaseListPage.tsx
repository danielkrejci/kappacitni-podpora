import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { ServiceCaseListStore } from './ServiceCaseListStore'
import { Row } from '../../../../common/components/Row'
import { Col } from '../../../../common/components/Col'
import { FormGroup } from '../../../../common/components/FormGroup'
import { Label } from '../../../../common/components/Label'
import { Select } from '../../../../common/components/Select'
import { Button } from '../../../../common/components/Button'
import { Loader } from '../../../../common/components/Loader'

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
                    <Row className='justify-content-around'>
                        <Col xs={6} md={9}>
                            <Button type='secondary' onClick={() => store.toggleFilter()}>
                                Filtr
                            </Button>
                        </Col>
                        <Col xs={6} md={3}>
                            <FormGroup>
                                <Select name='sort' onFieldChange={() => store.reload()} field={store.filter.sort} />
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {store.isFilterActive && (
                <Row>
                    <Col xs={12}>
                        <div id='filter-box' className='p-3 service-case-item'>
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
                        </div>
                    </Col>
                </Row>
            )}
        </>
    )
})
