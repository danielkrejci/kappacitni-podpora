import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { authService, navigationStore } from '../../../../App'
import { Button } from '../../../../common/components/Button'
import { Col } from '../../../../common/components/Col'
import { Dialog } from '../../../../common/components/Dialog'
import { FormGroup } from '../../../../common/components/FormGroup'
import { Label } from '../../../../common/components/Label'
import { Row } from '../../../../common/components/Row'
import { Textarea } from '../../../../common/components/Textarea'
import { YesNoDialog } from '../../../../common/components/YesNoDialog'
import { DateUtils } from '../../../../common/utils/DateUtils'
import { ListUtils } from '../../../../common/utils/ListUtils'
import { AdminServiceCaseDetailStore } from './AdminServiceCaseDetailStore'
import { RemoveOperatorDialog } from './dialog/RemoveOperatorDialog'
import { ChangeCategoryDialog } from './dialog/ChangeCategoryDialog'
import { AddOperatorDialog } from './dialog/AddOperatorDialog'
import { ChangeStateDialog } from './dialog/ChangeStateDialog'
import { LoggerDialog } from './dialog/LoggerDialog'

interface AdminServiceCaseDetailPageProps {
    store: AdminServiceCaseDetailStore
}

export const AdminServiceCaseDetailPage: React.FC<AdminServiceCaseDetailPageProps> = observer(props => {
    const store = props.store
    const serviceCase = store.serviceCase

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        store.init(id!)
    }, [id, store])

    return (
        <>
            {serviceCase.serviceCase.id === '' ? (
                <>
                    {store.isLoading ? (
                        <></>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className='text-center pb-5 pt-5'>
                                <h1 className='text-danger'>
                                    <i className='fa fa-times'></i>
                                </h1>
                                <h3 className='text-danger text-uppercase'>Servisní případ nebyl nalezen</h3>
                                <p className='mt-5'>
                                    <Button type='link' onClick={() => navigationStore.back()}>
                                        Zobrazit servisní případy&nbsp;
                                        <i className='fa fa-arrow-right' />
                                    </Button>
                                </p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <Dialog
                        store={store.stateDialogStore}
                        title='Změnit stav'
                        buttons={[
                            <Button key={ListUtils.randomKey()} size='sm' onClick={() => store.stateDialogStore.save()}>
                                Uložit
                            </Button>,
                        ]}>
                        <ChangeStateDialog store={store.stateDialogStore} />
                    </Dialog>

                    <Dialog
                        store={store.categoryDialogStore}
                        title='Změnit kategorii'
                        buttons={[
                            <Button key={ListUtils.randomKey()} size='sm' onClick={() => store.categoryDialogStore.save()}>
                                Uložit
                            </Button>,
                        ]}>
                        <ChangeCategoryDialog store={store.categoryDialogStore} />
                    </Dialog>

                    <Dialog
                        store={store.operatorDialogStore}
                        title='Přidat opeátora'
                        buttons={[
                            <Button key={ListUtils.randomKey()} size='sm' onClick={() => store.operatorDialogStore.save()}>
                                Přidat
                            </Button>,
                        ]}>
                        <AddOperatorDialog store={store.operatorDialogStore} />
                    </Dialog>

                    <YesNoDialog store={store.removeOperatorDialogStore} />

                    <Dialog size='xl' store={store.loggerDialogStore} title='Záznam událostí'>
                        <LoggerDialog store={store.loggerDialogStore} />
                    </Dialog>

                    <Row>
                        <Col xs={12} lg={8} className='pr-lg-5'>
                            <div className='messages'>
                                {serviceCase.messages.map((message, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2 mb-2 message ${message.author.id === authService.authUser!.id ? 'author' : ''} ${
                                            message.author.isOperator ? 'text-right' : ''
                                        }`}>
                                        <h3>
                                            <>
                                                {message.author.isOperator && (
                                                    <span title='Certifikovaný operátor' className='fa fa-headset mr-1'></span>
                                                )}
                                                {message.author.name} {message.author.surname}
                                            </>
                                        </h3>
                                        <p className='mb-0 p-2 px-3'>{message.message}</p>
                                        <span className='text-muted d-block text-xs mt-1'>{DateUtils.toUIDateTime(message.date)}</span>
                                        <span className='text-muted d-block text-xs'>{message.state === 1 ? 'Doručeno' : 'Přečteno'}</span>
                                    </div>
                                ))}
                            </div>

                            <div className='position-relative'>
                                {store.actionsDisabled && serviceCase.serviceCase.stateId.toString() !== '4' && (
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
                                            style={{ top: '45%', position: 'relative', transform: 'translateY(-50%)' }}>
                                            Tento servisní případ není přidělen tobě.
                                        </h3>
                                    </div>
                                )}
                                {serviceCase.serviceCase.stateId.toString() === '4' && (
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
                                            style={{ top: '45%', position: 'relative', transform: 'translateY(-50%)' }}>
                                            Servisní případ je vyřešený a byl uzavřen.
                                            <small className='d-block mt-3'>
                                                <button onClick={() => store.reOpen()} type='button' className='btn btn-primary'>
                                                    Znovu otevřít
                                                </button>
                                            </small>
                                        </h3>
                                    </div>
                                )}
                                <Row>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <Label id='message'>Zpráva:</Label>
                                            <Textarea
                                                disabled={store.actionsDisabled}
                                                field={store.form.message}
                                                maxLength={5000}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} className='text-right'>
                                        <Button disabled={store.actionsDisabled} onClick={() => store.save()}>
                                            Odeslat
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        <Col lg={4} xs={12} className='pl-lg-5 divider mt-5 mt-lg-0'>
                            <Row>
                                <Col xs={12}>
                                    <h2>Případ</h2>
                                    <p className='mb-0'>
                                        Stav:&nbsp;
                                        <strong>{store.getState}</strong>
                                        {!store.actionsDisabled && (
                                            <Button
                                                style={{ marginTop: '-2px' }}
                                                className='ml-2 p-0'
                                                size='sm'
                                                type='link'
                                                onClick={() => store.stateDialogStore.show()}>
                                                změnit
                                            </Button>
                                        )}
                                    </p>
                                    <p className='mb-0'>
                                        Kategorie:&nbsp;
                                        <strong>{store.getCategory}</strong>
                                        {!store.actionsDisabled && (
                                            <Button
                                                style={{ marginTop: '-2px' }}
                                                className='ml-2 p-0'
                                                size='sm'
                                                type='link'
                                                onClick={() => store.categoryDialogStore.show()}>
                                                změnit
                                            </Button>
                                        )}
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
                                    <Button type='link' className='p-0 mt-3' onClick={() => store.loggerDialogStore.show()}>
                                        Zobrazit záznam událostí
                                    </Button>
                                </Col>
                            </Row>

                            <Row mt={4}>
                                <Col xs={12}>
                                    <h2>Zařízení</h2>
                                    <p className='mb-0'>
                                        {store.codetables.deviceTypes.find(d => d.code.toString() === serviceCase.device.typeId.toString())
                                            ?.type ?? ''}
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
                                </Col>
                            </Row>

                            <Row mt={4}>
                                <Col xs={12}>
                                    <h2>Klient</h2>
                                    <p className='mb-0'>
                                        {serviceCase.client.name} {serviceCase.client.surname}
                                    </p>
                                    <p className='mb-0'>{serviceCase.client.email}</p>
                                    {serviceCase.client.phone && <p className='mb-0'>{serviceCase.client.phone}</p>}
                                </Col>

                                <Col xs={12} mt={4}>
                                    <h2>{serviceCase.operators.length === 1 ? 'Operátor' : 'Operátoři'}</h2>
                                    {serviceCase.operators.length > 0 ? (
                                        <div className='row clearfix'>
                                            {serviceCase.operators.map((operator, idx) => (
                                                <div key={idx} className='col-12 mb-3'>
                                                    <p className='mb-0'>
                                                        {operator.name} {operator.surname}
                                                        {!store.actionsDisabled && (
                                                            <Button
                                                                style={{ marginTop: '-4px' }}
                                                                className='ml-2 p-0'
                                                                size='sm'
                                                                type='link'
                                                                onClick={() =>
                                                                    store.showRemoveOperatorDialog(
                                                                        operator,
                                                                        <RemoveOperatorDialog store={store.removeOperatorDialogStore} />
                                                                    )
                                                                }>
                                                                odebrat
                                                            </Button>
                                                        )}
                                                    </p>
                                                    <p className='mb-0'>{operator.email}</p>
                                                    {operator.phone && <p className='mb-0'>{operator.phone}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='mb-0 font-italic'>Zatím nebyl přidělen.</p>
                                    )}
                                    <Button size='sm' className='p-0' type='link' onClick={() => store.operatorDialogStore.show()}>
                                        Přidat operátora
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>
            )}
        </>
    )
})
