import { observer } from 'mobx-react'
import { Col } from '../../../../../common/components/Col'
import { FormGroup } from '../../../../../common/components/FormGroup'
import { Label } from '../../../../../common/components/Label'
import { Row } from '../../../../../common/components/Row'
import { Select } from '../../../../../common/components/Select'
import { ChangeCategoryDialogStore } from './ChangeCategoryDialogStore'

interface ChangeCategoryDialogProps {
    store: ChangeCategoryDialogStore
}

export const ChangeCategoryDialog: React.FC<ChangeCategoryDialogProps> = observer(props => {
    let store = props.store
    let form = store.form

    return (
        <>
            <Row>
                <Col xs={12}>
                    <p>
                        Aktuální kategorie:&nbsp;<strong>{store.parentStore.getCategory}</strong>
                    </p>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <FormGroup>
                        <Label id='category'>Změnit na:</Label>
                        <Select field={form.category} name='category' required />
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
})
