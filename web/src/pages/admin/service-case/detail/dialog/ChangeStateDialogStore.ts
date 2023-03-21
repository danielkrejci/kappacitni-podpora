import { makeObservable, action, runInAction } from 'mobx'
import { ServiceCaseStateChange } from '../../../../../api/models/ServiceCase'
import { isApiError } from '../../../../../api/services/ApiService'
import { ServiceCaseService } from '../../../../../api/services/ServiceCaseService'
import { AlertDialogType, showAlertDialog } from '../../../../../common/components/AlertDialog'
import { DialogStore } from '../../../../../common/components/Dialog'
import { Field } from '../../../../../common/forms/Field'
import { Form } from '../../../../../common/forms/Form'
import { SelectFieldUtils } from '../../../../../common/utils/SelectFieldUtils'
import { ValidationUtils } from '../../../../../common/utils/ValidationUtils'
import { AdminServiceCaseDetailStore } from '../AdminServiceCaseDetailStore'

export class ChangeStateDialogStore extends DialogStore {
    parentStore: AdminServiceCaseDetailStore

    form = {
        state: Field.select('state', SelectFieldUtils.optionNotSelected(), () =>
            SelectFieldUtils.withNotSelectedOption(this.parentStore.codetables.caseStates)
        ),
    }

    constructor(parentStore: AdminServiceCaseDetailStore) {
        super()
        this.parentStore = parentStore
        makeObservable(this, {
            save: action,
            reset: action,
            validate: action,
        })
    }

    save() {
        if (this.validate()) {
            this.parentStore.isLoading = true

            const data: ServiceCaseStateChange = {
                stateId: this.form.state.value.code,
            }

            ServiceCaseService.changeState(this.parentStore.serviceCase.serviceCase.id, data)
                .then(data =>
                    runInAction(() => {
                        this.parentStore.isLoading = false

                        this.reset()
                        this.hide()

                        if (!isApiError(data)) {
                            this.parentStore.reloadServiceCase()
                        } else {
                            showAlertDialog('Chyba', data.cause, AlertDialogType.Danger)
                        }
                    })
                )
                .finally(() => {
                    runInAction(() => {
                        this.parentStore.isLoading = false
                    })
                })
        }
    }

    validate(): boolean {
        Form.resetAllValidations(this.form)

        ValidationUtils.requiredSelect(this.form.state)

        return Form.isValid(this.form)
    }

    reset() {
        this.form.state.value = SelectFieldUtils.optionNotSelected()
    }
}
