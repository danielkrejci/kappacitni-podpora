import { observer } from 'mobx-react'
import { Col } from '../../../../../common/components/Col'
import { FormGroup } from '../../../../../common/components/FormGroup'
import { Label } from '../../../../../common/components/Label'
import { Row } from '../../../../../common/components/Row'
import { Select } from '../../../../../common/components/Select'
import { AddOperatorDialogStore } from './AddOperatorDialogStore'

interface AddOperatorDialogProps {
    store: AddOperatorDialogStore
}

export const AddOperatorDialog: React.FC<AddOperatorDialogProps> = observer(props => {
    let store = props.store
    let form = store.form

    return (
        <Row>
            <Col xs={12}>
                <FormGroup>
                    <Label id='operator'>Vyberte operátora:</Label>
                    <Select field={form.operator} name='operator' required />
                </FormGroup>
            </Col>
        </Row>
    )
})
