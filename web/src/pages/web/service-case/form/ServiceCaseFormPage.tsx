import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { navigationStore } from '../../../../App'
import { Button } from '../../../../common/components/Button'
import { Checkbox } from '../../../../common/components/Checkbox'
import { Col } from '../../../../common/components/Col'
import { FormGroup } from '../../../../common/components/FormGroup'
import { Input } from '../../../../common/components/Input'
import { InputGroup } from '../../../../common/components/InputGroup'
import { InputGroupAddon } from '../../../../common/components/InputGroupAddon'
import { Label } from '../../../../common/components/Label'
import { Row } from '../../../../common/components/Row'
import { Select } from '../../../../common/components/Select'
import { Textarea } from '../../../../common/components/Textarea'
import { ServiceCaseFormStore } from './ServiceCaseFormStore'

interface ServiceCaseFormPageProps {
    store: ServiceCaseFormStore
}

export const ServiceCaseFormPage: React.FC<ServiceCaseFormPageProps> = props => {
    const store = props.store

    const { deviceName } = useParams<{ deviceName: string }>()

    useEffect(() => {
        if (!store.initDone) {
            store.init(deviceName!)
        }
    }, [deviceName, store])

    return (
        <div className='content'>
            <div className='mt-0'>
                <ServiceCaseFormPageForm store={store} />
            </div>
        </div>
    )
}

interface ServiceCaseFormPageCreatedProps {
    store: ServiceCaseFormStore
}

export const ServiceCaseFormPageCreated: React.FC<ServiceCaseFormPageCreatedProps> = props => {
    let store = props.store
    return (
        <div className='container pb-5 pt-5'>
            <div className='text-center pb-5 pt-5'>
                <h1 className='text-success'>
                    <i className='fa fa-check'></i>
                </h1>
                <h2 className='text-success text-uppercase'>Žádost byla odeslána</h2>
                <p className='mt-2'>
                    Zkontroluj svou e-mailovou schránku
                    {store.saved.email ? (
                        <>
                            &nbsp;<strong>{store.saved.email}</strong>
                        </>
                    ) : (
                        ''
                    )}
                    ,<br />
                    odeslali jsme Ti potvrzení a dodatečné informace.
                </p>
                <p className='mt-5'>
                    <a href={navigationStore.href.serviceCaseDetail(store.saved.id, store.saved.hash)}>
                        Přejít na servisní případ&nbsp;
                        <i className='fa fa-arrow-right' />
                    </a>
                </p>
            </div>
        </div>
    )
}

interface ServiceCaseFormPageFormProps {
    store: ServiceCaseFormStore
}

export const ServiceCaseFormPageForm: React.FC<ServiceCaseFormPageFormProps> = observer(props => {
    let store = props.store
    return (
        <>
            <div className='hero-image text-center py-5'>
                <h1 className='my-5'>Podpora pro {store.selectedDevice.name}</h1>
            </div>

            {store.isSaved ? (
                <ServiceCaseFormPageCreated store={store} />
            ) : (
                <form>
                    <div className='container pb-5 pt-4'>
                        <Row>
                            <Col xs={12}>
                                <p className='mb-5'>
                                    <a href='/index'>Úvodní stránka</a>{' '}
                                    <span className='text-muted'>
                                        / Podpora {store.selectedDevice.name ? `pro ${store.selectedDevice.name}` : ''}
                                    </span>
                                </p>

                                <h2>Jaký máš s {store.selectedDevice.name} problém?</h2>
                                <p>
                                    Vyber požadované téma a popíš svůj problém.
                                    <br />
                                    Spojíme se&nbsp;e-mailem a&nbsp;najdeme ti&nbsp;ty&nbsp;nejlepší možnosti řešení.
                                </p>

                                <Row className='my-5'>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='case-type'>Vyber téma:</Label>
                                            <Select name='case-type' field={store.form.caseType} required />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='serialNumber'>Sériové číslo:</Label>
                                            <Input field={store.form.serialNumber} name='serialNumber' type='text' required />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12}>
                                        <FormGroup>
                                            <Label id='message'>Zpráva:</Label>
                                            <Textarea field={store.form.message} maxLength={5000} required />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <h2>Informace o tobě</h2>

                                <Row className='mt-5'>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='name'>Jméno:</Label>
                                            <Input field={store.form.name} name='name' type='text' required />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='surname'>Příjmení:</Label>
                                            <Input field={store.form.surname} name='surname' type='text' required />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='email'>E-mail:</Label>
                                            <Input field={store.form.email} name='email' type='email' required />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='phone'>Telefon:</Label>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <Select name='phonePrefix' field={store.form.phonePrefix} />
                                                </InputGroupAddon>
                                                <Input field={store.form.phone} name='phone' type='tel' />
                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className='mt-5'>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='street'>Ulice:</Label>
                                            <Input
                                                field={store.form.street}
                                                onChange={() => !store.isValid && store.validateAddress()}
                                                name='street'
                                                type='text'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <FormGroup>
                                            <Label id='houseNumber'>Číslo popisné:</Label>
                                            <Input
                                                field={store.form.houseNumber}
                                                onChange={() => !store.isValid && store.validateAddress()}
                                                name='houseNumber'
                                                type='text'
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={4}>
                                        <FormGroup>
                                            <Label id='city'>Město:</Label>
                                            <Input
                                                field={store.form.city}
                                                onChange={() => !store.isValid && store.validateAddress()}
                                                name='city'
                                                type='text'
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xs={12} md={2}>
                                        <FormGroup>
                                            <Label id='postalCode'>PSČ:</Label>
                                            <Input
                                                field={store.form.postalCode}
                                                onChange={() => !store.isValid && store.validateAddress()}
                                                name='postalCode'
                                                maxLength={5}
                                                type='text'
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className='mt-5 align-items-center'>
                                    <Col xs={12} xl={6}>
                                        <FormGroup>
                                            <Checkbox field={store.form.terms} id='terms' required>
                                                <>
                                                    Potvrzuji, že jsem se seznámil/a s{' '}
                                                    <Link to={navigationStore.href.privacyPolicy()} target='_blank'>
                                                        podmínkami zpracovávání osobních údajů
                                                    </Link>{' '}
                                                    společností Kappacitní Podpora s.r.o.
                                                </>
                                            </Checkbox>
                                        </FormGroup>
                                    </Col>

                                    <Col xs={12} xl={6} className='mt-5 mt-xl-0'>
                                        <Row horizontal='end'>
                                            <Col xs={6}>
                                                {!store.isValid && (
                                                    <div className='alert p-2 m-0 alert-danger'>
                                                        <p className='m-0' style={{ fontSize: '0.8rem' }}>
                                                            Některý údaj není správně vyplněn.
                                                        </p>
                                                    </div>
                                                )}
                                            </Col>
                                            <Col className='text-center text-xl-right' style={{ flex: 0 }}>
                                                <Button onClick={() => store.save()}>Odeslat</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </form>
            )}
        </>
    )
})
