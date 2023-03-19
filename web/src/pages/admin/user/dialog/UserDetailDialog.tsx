import { observer } from 'mobx-react'
import { Col } from '../../../../common/components/Col'
import { FormGroup } from '../../../../common/components/FormGroup'
import { Input } from '../../../../common/components/Input'
import { InputGroup } from '../../../../common/components/InputGroup'
import { InputGroupAddon } from '../../../../common/components/InputGroupAddon'
import { Label } from '../../../../common/components/Label'
import { Row } from '../../../../common/components/Row'
import { Select } from '../../../../common/components/Select'
import { UserDetailDialogStore } from './UserDetailDialogStore'

interface UserDetailDialogProps {
    store: UserDetailDialogStore
}

export const UserDetailDialog: React.FC<UserDetailDialogProps> = observer(props => {
    let store = props.store
    let form = store.form

    return (
        <>
            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='name'>Jméno:</Label>
                        <Input disabled={!store.editMode} field={form.name} name='name' type='text' required={store.editMode} />
                    </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='surname'>Příjmení:</Label>
                        <Input disabled={!store.editMode} field={form.surname} name='surname' type='text' required={store.editMode} />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='email'>E-mail:</Label>
                        <Input disabled field={form.email} name='email' type='email' required={store.editMode} />
                    </FormGroup>
                </Col>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='phone'>Telefon:</Label>
                        <InputGroup>
                            <InputGroupAddon>
                                <Select disabled={!store.editMode} name='phonePrefix' field={form.phonePrefix} />
                            </InputGroupAddon>
                            <Input disabled={!store.editMode} field={form.phone} name='phone' type='tel' />
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='street'>Ulice:</Label>
                        <Input disabled={!store.editMode} field={form.street} name='street' type='text' />
                    </FormGroup>
                </Col>
                <Col xs={12} md={4}>
                    <FormGroup>
                        <Label id='houseNumber'>Číslo popisné:</Label>
                        <Input disabled={!store.editMode} field={form.houseNumber} name='houseNumber' type='text' />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col xs={12} md={6}>
                    <FormGroup>
                        <Label id='city'>Město:</Label>
                        <Input disabled={!store.editMode} field={form.city} name='city' type='text' />
                    </FormGroup>
                </Col>
                <Col xs={12} md={4}>
                    <FormGroup>
                        <Label id='postalCode'>PSČ:</Label>
                        <Input disabled={!store.editMode} field={form.postalCode} name='postalCode' maxLength={5} type='text' />
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
})
