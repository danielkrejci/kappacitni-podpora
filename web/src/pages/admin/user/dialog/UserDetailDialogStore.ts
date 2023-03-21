import { action, makeObservable, observable, runInAction } from 'mobx'
import { User, UserEdit } from '../../../../api/models/User'
import { isApiError } from '../../../../api/services/ApiService'
import { UserService } from '../../../../api/services/UserService'
import { AlertDialogType, showAlertDialog } from '../../../../common/components/AlertDialog'
import { DialogStore } from '../../../../common/components/Dialog'
import { Field } from '../../../../common/forms/Field'
import { Form } from '../../../../common/forms/Form'
import { ValidationUtils } from '../../../../common/utils/ValidationUtils'
import { UserListStore } from '../UserListStore'

export class UserDetailDialogStore extends DialogStore {
    selectedUser?: User

    editMode = false

    parentStore: UserListStore

    prefixCodetable = [
        { code: '+420', value: '+420' },
        { code: '+421', value: '+421' },
    ]

    form = {
        name: Field.text('name'),
        surname: Field.text('surname'),
        email: Field.text('email'),
        phonePrefix: Field.select('phonePrefix', { code: '+420', value: '+420' }, () => this.prefixCodetable),
        phone: Field.text('phone'),
        street: Field.text('street'),
        houseNumber: Field.text('houseNumber'),
        city: Field.text('city'),
        postalCode: Field.text('postalCode'),
    }

    constructor(parentStore: UserListStore) {
        super()
        this.parentStore = parentStore
        makeObservable(this, {
            editMode: observable,
            selectedUser: observable,
            init: action,
            save: action,
            reset: action,
            validate: action,
        })
    }

    init(selectedUser: User, editMode: boolean) {
        this.editMode = editMode
        this.selectedUser = selectedUser

        this.form.name.value = selectedUser.name ?? ''
        this.form.surname.value = selectedUser.surname ?? ''
        this.form.email.value = selectedUser.email ?? ''
        this.form.street.value = selectedUser.street ?? ''
        this.form.houseNumber.value = selectedUser.houseNumber ?? ''
        this.form.city.value = selectedUser.city ?? ''
        this.form.postalCode.value = selectedUser.postalCode ?? ''

        if (selectedUser.phone) {
            this.form.phonePrefix.value =
                this.prefixCodetable.find(prefix => prefix.code === selectedUser.phone.slice(0, 4)) ?? this.prefixCodetable[1]
            this.form.phone.value = selectedUser.phone.slice(5, selectedUser.phone.length)
        } else {
            this.form.phone.value = ''
        }
    }

    save() {
        if (this.validate() && this.selectedUser) {
            this.parentStore.isLoading = true

            const data: UserEdit = {
                name: this.form.name.value,
                surname: this.form.surname.value,
                phone: this.form.phone.value ? `${this.form.phonePrefix.value.value}${this.form.phone.value}` : '',
                street: this.form.street.value,
                houseNumber: this.form.houseNumber.value,
                city: this.form.city.value,
                postalCode: this.form.postalCode.value,
            }

            UserService.editUser(this.selectedUser.id, data)
                .then(data =>
                    runInAction(() => {
                        this.parentStore.isLoading = false

                        this.reset()
                        this.hide()

                        if (isApiError(data)) {
                            showAlertDialog('Chyba', data.cause, AlertDialogType.Danger)
                        } else {
                            this.editMode = false
                            this.selectedUser = undefined
                            this.parentStore.load()
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

        ValidationUtils.required(this.form.name)
        ValidationUtils.required(this.form.surname)

        if (this.form.phone.value.length > 0) {
            ValidationUtils.phone(this.form.phone)
        }

        if (
            (this.form.street.value === '' ||
                this.form.houseNumber.value === '' ||
                this.form.city.value === '' ||
                this.form.postalCode.value === '') &&
            (this.form.street.value !== '' ||
                this.form.houseNumber.value !== '' ||
                this.form.city.value !== '' ||
                this.form.postalCode.value !== '')
        ) {
            if (this.form.street.value === '') ValidationUtils.required(this.form.street)
            if (this.form.houseNumber.value === '') ValidationUtils.required(this.form.houseNumber)
            if (this.form.city.value === '') ValidationUtils.required(this.form.city)
            if (this.form.postalCode.value === '') ValidationUtils.required(this.form.postalCode)
        }

        if (
            this.form.street.value !== '' &&
            this.form.houseNumber.value !== '' &&
            this.form.city.value !== '' &&
            this.form.postalCode.value !== ''
        ) {
            ValidationUtils.postalCode(this.form.postalCode)
        }

        return Form.isValid(this.form)
    }

    reset() {
        this.form.name.value = ''
        this.form.surname.value = ''
        this.form.email.value = ''
        this.form.phone.value = ''
        this.form.street.value = ''
        this.form.houseNumber.value = ''
        this.form.city.value = ''
        this.form.postalCode.value = ''
    }
}
