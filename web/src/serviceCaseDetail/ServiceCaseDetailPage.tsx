import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../common/components/Button'
import { Col } from '../common/components/Col'
import { FormGroup } from '../common/components/FormGroup'
import { Label } from '../common/components/Label'
import { Row } from '../common/components/Row'
import { Textarea } from '../common/components/Textarea'
import { ServiceCaseDetailStore } from './ServiceCaseDetailStore'
import { DateUtils } from '../common/utils/DateUtils'
import { navigation } from '../App'

interface ServiceCaseDetailPageProps {
    store: ServiceCaseDetailStore
}

export const ServiceCaseDetailPage: React.FC<ServiceCaseDetailPageProps> = observer(props => {
    const store = props.store
    const serviceCase = store.serviceCase

    const { id, hash } = useParams<{ id: string; hash: string }>()

    useEffect(() => {
        if (!store.initDone) {
            store.init(id!, hash!)
        }
    }, [hash, id, store])

    return (
        <div className='content'>
            <div className='mt-0'>
                <div className='hero-image text-center py-5'>
                    <h1 className='my-5 text-uppercase'>
                        Servisní případ {serviceCase.serviceCase.id ? `č. ${serviceCase.serviceCase.id}` : ''}
                    </h1>
                </div>

                {serviceCase.serviceCase.id === '' ? (
                    <>
                        {store.isLoading ? (
                            <></>
                        ) : (
                            <div className='container pb-5 pt-5'>
                                <div className='text-center pb-5 pt-5'>
                                    <h1 className='text-danger'>
                                        <i className='fa fa-times'></i>
                                    </h1>
                                    <h2 className='text-danger text-uppercase'>Servisní případ nebyl nalezen</h2>
                                    <p className='mt-2 restricted'>
                                        Zkontroluj odkaz, který jsme ti odeslali do tvé e-mailové schránky,
                                        <br />
                                        případně nás kontaktuj prostřednictvím zprávy.
                                    </p>
                                    <p className='mt-5'>
                                        <a href={navigation.href.index()}>
                                            Přejít na úvodní stránku&nbsp;
                                            <i className='fa fa-arrow-right' />
                                        </a>
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='container py-5'>
                        <div className='row clearfix'>
                            <div className='col-lg-8 col-12 pr-lg-5'>
                                <div className='messages'>
                                    {serviceCase.messages.map((message, idx) => (
                                        <div key={idx} className={`p-2 mb-2 message ${message.author.isClient ? 'author text-right' : ''}`}>
                                            <h3>
                                                <>
                                                    {message.author.isOperator && (
                                                        <span title='Certifikovaný operátor' className='fa fa-headset mr-1'></span>
                                                    )}
                                                    {message.author.name} {message.author.surname}
                                                </>
                                            </h3>
                                            <p className='mb-0 p-2 px-3'>{message.message}</p>
                                            <br />
                                            <span className='text-muted text-xs m-1'>{DateUtils.toUIDateTime(message.date)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className='position-relative'>
                                    {serviceCase.serviceCase.stateId === '4' && (
                                        <div
                                            id='form-overlay'
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                zIndex: 1,
                                                backgroundColor: 'rgba(254, 255, 255, 0.7)',
                                            }}>
                                            <h3
                                                className='text-center'
                                                style={{ top: '50%', position: 'relative', transform: 'translateY(-50%)' }}>
                                                Servisní případ je vyřešený a byl uzavřen.
                                                <small className='d-block mt-3'>
                                                    <button onClick={() => console.log('TODO')} type='button' className='btn btn-primary'>
                                                        Znovu otevřít
                                                    </button>
                                                </small>
                                            </h3>
                                        </div>
                                    )}
                                    <form>
                                        <Row>
                                            <Col xs={12}>
                                                <FormGroup>
                                                    <Label id='message'>Zpráva:</Label>
                                                    <Textarea
                                                        disabled={serviceCase.serviceCase.stateId === '4'}
                                                        field={store.form.message}
                                                        maxLength={5000}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col xs={12} className='text-right'>
                                                <Button disabled={serviceCase.serviceCase.stateId === '4'} onClick={() => store.save()}>
                                                    Odeslat
                                                </Button>
                                            </Col>
                                        </Row>
                                    </form>
                                </div>
                            </div>

                            <div className='col-lg-4 col-12 pl-lg-5 divider mt-5 mt-lg-0'>
                                <div className='row clearfix'>
                                    <div className='col-12'>
                                        <h2>Případ</h2>
                                        <p className='mb-0'>
                                            Stav:&nbsp;
                                            <strong>
                                                {store.codetables.caseTypes.find(t => t.code === serviceCase.serviceCase.caseTypeId)
                                                    ?.value ?? ''}
                                            </strong>
                                        </p>
                                        <p className='mb-0'>
                                            Kategorie:&nbsp;
                                            <strong>
                                                {store.codetables.caseTypes.find(t => t.code === serviceCase.serviceCase.caseTypeId)
                                                    ?.value ?? ''}
                                            </strong>
                                        </p>
                                        <p className='mb-0'>
                                            Datum vytvoření:&nbsp;
                                            <strong>
                                                {serviceCase.serviceCase.dateBegin
                                                    ? DateUtils.toUIDateTime(serviceCase.serviceCase.dateBegin)
                                                    : '-'}
                                            </strong>
                                        </p>
                                        <p className='mb-0'>
                                            Datum dokončení:&nbsp;
                                            <strong>
                                                {serviceCase.serviceCase.dateEnd
                                                    ? DateUtils.toUIDateTime(serviceCase.serviceCase.dateEnd)
                                                    : '-'}
                                            </strong>
                                        </p>
                                    </div>
                                </div>

                                <div className='row clearfix mt-4'>
                                    <div className='col-12'>
                                        <h2>Zařízení</h2>
                                        <p className='mb-0'>
                                            {store.codetables.deviceTypes.find(
                                                d => d.code.toString() === serviceCase.device.typeId.toString()
                                            )?.type ?? ''}
                                            &nbsp;
                                            <strong>
                                                {store.codetables.deviceTypes.find(
                                                    d => d.code.toString() === serviceCase.device.typeId.toString()
                                                )?.name ?? ''}
                                            </strong>
                                        </p>
                                        <p className='mb-0'>
                                            Model:&nbsp;
                                            <strong>{serviceCase.device.modelName}</strong>
                                        </p>
                                        <p className='mb-0'>
                                            Sériové číslo:&nbsp;
                                            <strong>{serviceCase.device.serialNumber}</strong>
                                        </p>
                                        <p className='mb-0'>
                                            Datum vydání:&nbsp;
                                            <strong>{DateUtils.toUIDateTime(serviceCase.device.releaseDate)}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className='row clearfix mt-4'>
                                    <div className='col-12'>
                                        <h2>Klient</h2>
                                        <p className='mb-0'>
                                            {serviceCase.client.name} {serviceCase.client.surname}
                                        </p>
                                        <p className='mb-0'>{serviceCase.client.email}</p>
                                        {serviceCase.client.phone && <p className='mb-0'>{serviceCase.client.phone}</p>}
                                    </div>

                                    <div className='col-12 mt-4'>
                                        <h2>{serviceCase.operators.length === 1 ? 'Operátor' : 'Operátoři'}</h2>
                                        {serviceCase.operators.length > 0 ? (
                                            <div className='row clearfix'>
                                                {serviceCase.operators.map((operator, idx) => (
                                                    <div key={idx} className='col-12 mb-3'>
                                                        <p className='mb-0'>
                                                            {operator.name} {operator.surname}
                                                        </p>
                                                        <p className='mb-0'>{operator.email}</p>
                                                        {operator.phone && <p className='mb-0'>{operator.phone}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className='mb-0 font-italic'>Zatím nebyl přidělen.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
})
