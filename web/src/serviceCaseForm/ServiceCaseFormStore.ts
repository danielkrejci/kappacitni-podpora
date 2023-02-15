import { action, makeObservable, observable, runInAction } from 'mobx'
import { CodetableStorage } from '../common/data/CodetableStorage'
import { Field } from '../common/forms/Field'
import { EMPTY_SELECT_FIELD, SelectField } from '../common/forms/SelectField'
import { ListUtils } from '../common/utils/ListUtils'
import { SelectFieldUtils } from '../common/utils/SelectFieldUtils'

export class ServiceCaseFormStore {
    isLoading = false

    selectedDevice: SelectField = EMPTY_SELECT_FIELD

    codetables = {
        deviceTypes: [] as SelectField[],
        caseTypes: [] as SelectField[],
    }

    form = {
        caseType: Field.select('caseType', SelectFieldUtils.optionNotSelected(), () => [SelectFieldUtils.optionNotSelected()]),
        serialNumber: Field.text('serialNumber'),
        message: Field.text('message'),
        name: Field.text('name'),
        surname: Field.text('surname'),
        email: Field.text('email'),
        phonePrefix: Field.select('phonePrefix', { code: '+420', value: '+420' }, () => [
            { code: '+420', value: '+420' },
            { code: '+421', value: '+421' },
        ]),
        phone: Field.text('phone'),
        street: Field.text('street'),
        houseNumber: Field.text('houseNumber'),
        city: Field.text('city'),
        postalCode: Field.text('postalCode'),
        terms: Field.bool('terms'),
    }

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            codetables: observable,
            selectedDevice: observable,
            init: action,
        })
    }

    init(deviceName: string) {
        this.loadCodetables(deviceName)
    }

    loadCodetables(deviceName: string) {
        this.isLoading = true

        Promise.all([CodetableStorage.deviceTypes(), CodetableStorage.serviceCases()]).then(data =>
            runInAction(() => {
                this.codetables.deviceTypes = ListUtils.asList(data[0])
                this.codetables.caseTypes = ListUtils.asList(data[1])

                this.selectedDevice =
                    this.codetables.deviceTypes.find(device => device.code.toLocaleLowerCase() === deviceName) || EMPTY_SELECT_FIELD

                SelectFieldUtils.initFieldSelect(this.form.caseType, this.codetables.caseTypes, false, false, true)
                this.isLoading = false
            })
        )
    }
}
