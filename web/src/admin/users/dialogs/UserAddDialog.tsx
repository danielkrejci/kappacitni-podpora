import { observer } from 'mobx-react'
import { Col } from '../../../common/components/Col'
import { FormGroup } from '../../../common/components/FormGroup'
import { Input } from '../../../common/components/Input'
import { InputGroup } from '../../../common/components/InputGroup'
import { InputGroupAddon } from '../../../common/components/InputGroupAddon'
import { Label } from '../../../common/components/Label'
import { Row } from '../../../common/components/Row'
import { Select } from '../../../common/components/Select'
import { UserAddDialogStore } from './UserAddDialogStore'

interface UserAddDialogProps {
    store: UserAddDialogStore
}

export const UserAddDialog: React.FC<UserAddDialogProps> = observer(props => {
    let store = props.store
    let form = store.form

    return (
        <>
            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='name'>Jméno:</Label>
                        <Input field={form.name} name='name' type='text' required />
                    </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='surname'>Příjmení:</Label>
                        <Input field={form.surname} name='surname' type='text' required />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='email'>E-mail:</Label>
                        <Input field={form.email} name='email' type='email' required />
                    </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='phone'>Telefon:</Label>
                        <InputGroup>
                            <InputGroupAddon>
                                <Select name='phonePrefix' field={form.phonePrefix} />
                            </InputGroupAddon>
                            <Input field={form.phone} name='phone' type='tel' />
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='street'>Ulice:</Label>
                        <Input field={form.street} name='street' type='text' />
                    </FormGroup>
                </Col>
                <Col xs={12} md={4}>
                    <FormGroup>
                        <Label id='houseNumber'>Číslo popisné:</Label>
                        <Input field={form.houseNumber} name='houseNumber' type='text' />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='city'>Město:</Label>
                        <Input field={form.city} name='city' type='text' />
                    </FormGroup>
                </Col>
                <Col xs={12} md={4}>
                    <FormGroup>
                        <Label id='postalCode'>PSČ:</Label>
                        <Input field={form.postalCode} name='postalCode' maxLength={5} type='text' />
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
})
