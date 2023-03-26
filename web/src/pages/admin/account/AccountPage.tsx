import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { Col } from '../../../common/components/Col'
import { FormGroup } from '../../../common/components/FormGroup'
import { Input } from '../../../common/components/Input'
import { InputGroup } from '../../../common/components/InputGroup'
import { InputGroupAddon } from '../../../common/components/InputGroupAddon'
import { Label } from '../../../common/components/Label'
import { Row } from '../../../common/components/Row'
import { Select } from '../../../common/components/Select'
import { AccountStore } from './AccountStore'

interface AccountPageProps {
    store: AccountStore
}

export const AccountPage: React.FC<AccountPageProps> = observer(props => {
    const store = props.store
    const form = store.form

    useEffect(() => {
        store.init()
    }, [store])

    return (
        <>
            <h1 className='mb-5'>Můj účet</h1>

            <Row>
                <Col xs={12} lg={10} xl={8} xxl={6}>
                    {store.user.picture && (
                        <Row mb={3}>
                            <Col xs={12}>
                                <img src={store.user.picture} alt='' className='rounded-circle' width={60} />
                            </Col>
                        </Row>
                    )}

                    <Row>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label id='name'>Jméno:</Label>
                                <Input disabled={true} field={form.name} name='name' type='text' />
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label id='surname'>Příjmení:</Label>
                                <Input disabled={true} field={form.surname} name='surname' type='text' />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label id='email'>E-mail:</Label>
                                <Input disabled={true} field={form.email} name='email' type='email' />
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label id='phone'>Telefon:</Label>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <Select disabled={true} name='phonePrefix' field={form.phonePrefix} />
                                    </InputGroupAddon>
                                    <Input disabled={true} field={form.phone} name='phone' type='tel' />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label id='street'>Ulice:</Label>
                                <Input disabled={true} field={form.street} name='street' type='text' />
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={4}>
                            <FormGroup>
                                <Label id='houseNumber'>Číslo popisné:</Label>
                                <Input disabled={true} field={form.houseNumber} name='houseNumber' type='text' />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={6}>
                            <FormGroup>
                                <Label id='city'>Město:</Label>
                                <Input disabled={true} field={form.city} name='city' type='text' />
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={4}>
                            <FormGroup>
                                <Label id='postalCode'>PSČ:</Label>
                                <Input disabled={true} field={form.postalCode} name='postalCode' maxLength={5} type='text' />
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
})
