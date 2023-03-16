import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../common/components/Button'
import { Col } from '../common/components/Col'
import { FormGroup } from '../common/components/FormGroup'
import { Input } from '../common/components/Input'
import { InputGroup } from '../common/components/InputGroup'
import { InputGroupAddon } from '../common/components/InputGroupAddon'
import { Label } from '../common/components/Label'
import { Loader } from '../common/components/Loader'
import { Row } from '../common/components/Row'
import { Select } from '../common/components/Select'
import { Textarea } from '../common/components/Textarea'
import { ServiceCaseFormStore } from './ServiceCaseFormStore'

interface ServiceCaseFormPageProps {
    store: ServiceCaseFormStore
}

export const ServiceCaseFormPage: React.FC<ServiceCaseFormPageProps> = props => {
    const store = props.store

    const { deviceName } = useParams<{ deviceName: string }>()

    useEffect(() => {
        store.init(deviceName!)
        console.log('init')
    }, [])

    return (
        <div className='content'>
            <div className='mt-0'>
                <ServiceCaseFormPageForm store={store} />
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
            <form>
                <div className='container pb-5 pt-4'>
                    <Row>
                        <Col xs={12}>
                            {false && (
                                <div className='form-overlay'>
                                    <div>
                                        <h1 className='mb-3'>
                                            <i className='fa fa-clock'></i>
                                        </h1>
                                        <p className='mb-1'>
                                            <strong>V tuto chvíli nepřijímáme servisní případy.</strong>
                                        </p>
                                        <p>Zkuste to prosím znovu později.</p>
                                    </div>
                                </div>
                            )}

                            <p className='mb-5'>
                                <a href='/index'>Úvodní stránka</a>{' '}
                                <span className='text-muted'>/ Podpora pro {store.selectedDevice.name}</span>
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
                                        <Label id='email'>Sériové číslo:</Label>
                                        <Input field={store.form.serialNumber} name='serialNumber' type='text' required />
                                    </FormGroup>
                                </Col>
                                <Col xs={12}>
                                    <FormGroup>
                                        <Label id='email'>Zpráva:</Label>
                                        <Textarea field={store.form.message} maxLength={5000} required />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <h2>Informace o tobě</h2>

                            <Row className='mt-5'>
                                <Col xs={12} md={4}>
                                    <FormGroup>
                                        <Label id='email'>Jméno:</Label>
                                        <Input field={store.form.name} name='name' type='text' required />
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={4}>
                                    <FormGroup>
                                        <Label id='email'>Příjmení:</Label>
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
                                        <Input field={store.form.street} name='street' type='text' />
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={2}>
                                    <FormGroup>
                                        <Label id='houseNumber'>Číslo popisné:</Label>
                                        <Input field={store.form.houseNumber} name='houseNumber' type='text' />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={12} md={4}>
                                    <FormGroup>
                                        <Label id='city'>Město:</Label>
                                        <Input field={store.form.city} name='city' type='text' />
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={2}>
                                    <FormGroup>
                                        <Label id='postalCode'>PSČ:</Label>
                                        <Input field={store.form.postalCode} name='postalCode' maxLength={5} type='text' />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className='mt-5 align-items-center'>
                                <Col xs={12} xl={6}>
                                    <FormGroup>
                                        <div className='form-check'>
                                            <input className='form-check-input' type='checkbox' value='' name='terms' id='terms' required />
                                            <label className='form-check-label' htmlFor='terms'>
                                                Potvrzuji, že jsem se seznámil/a s{' '}
                                                <a href='/privacy-policy' target='_blank'>
                                                    podmínkami zpracovávání osobních údajů
                                                </a>{' '}
                                                společností Kappacitní Podpora s.r.o.
                                            </label>
                                        </div>
                                    </FormGroup>
                                </Col>

                                <Col xs={12} xl={6} className='text-center text-xl-right mt-5 mt-xl-0'>
                                    <Button onClick={() => store.save()}>Odeslat</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </form>
        </>
    )
})
