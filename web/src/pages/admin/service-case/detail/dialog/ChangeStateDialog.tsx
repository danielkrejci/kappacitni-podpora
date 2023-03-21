import { observer } from 'mobx-react'
import { Col } from '../../../../../common/components/Col'
import { FormGroup } from '../../../../../common/components/FormGroup'
import { Label } from '../../../../../common/components/Label'
import { Row } from '../../../../../common/components/Row'
import { Select } from '../../../../../common/components/Select'
import { ChangeStateDialogStore } from './ChangeStateDialogStore'

interface ChangeStateDialogProps {
    store: ChangeStateDialogStore
}

export const ChangeStateDialog: React.FC<ChangeStateDialogProps> = observer(props => {
    let store = props.store
    let form = store.form

    return (
        <>
            <Row>
                <Col xs={12}>
                    <p>
                        Aktuální stav:&nbsp;<strong>{store.parentStore.getState}</strong>
                    </p>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <FormGroup>
                        <Label id='state'>Změnit na:</Label>
                        <Select field={form.state} name='state' required />
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
})
