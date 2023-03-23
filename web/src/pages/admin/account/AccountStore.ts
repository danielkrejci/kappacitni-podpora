import { action, makeObservable, observable } from 'mobx'
import { EMPTY_USER, User } from '../../../api/models/User'
import { authService } from '../../../App'
import { Field } from '../../../common/forms/Field'

export class AccountStore {
    isLoading = false

    user: User = EMPTY_USER

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

    constructor() {
        makeObservable(this, {
            user: observable,
            isLoading: observable,
            init: action,
        })
    }

    init() {
        if (authService.authUser) {
            this.user = authService.authUser

            this.form.name.value = this.user.name ?? ''
            this.form.surname.value = this.user.surname ?? ''
            this.form.email.value = this.user.email ?? ''
            this.form.street.value = this.user.street ?? ''
            this.form.houseNumber.value = this.user.houseNumber ?? ''
            this.form.city.value = this.user.city ?? ''
            this.form.postalCode.value = this.user.postalCode ?? ''

            if (this.user.phone) {
                this.form.phonePrefix.value =
                    this.prefixCodetable.find(prefix => prefix.code === this.user.phone.slice(0, 4)) ?? this.prefixCodetable[1]
                this.form.phone.value = this.user.phone.slice(5, this.user.phone.length)
            } else {
                this.form.phone.value = ''
                this.form.phonePrefix.value = this.prefixCodetable[0]
            }
        }
    }
}
