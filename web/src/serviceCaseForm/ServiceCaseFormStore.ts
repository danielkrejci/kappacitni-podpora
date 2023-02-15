import { action, makeObservable, observable, runInAction } from 'mobx'
import { Field } from '../common/forms/Field'
import { SelectField } from '../common/forms/SelectField'
import { SelectFieldUtils } from '../common/utils/SelectFieldUtils'

export class ServiceCaseFormStore {
    isLoading = false

    form = {
        caseType: Field.select('caseType', SelectFieldUtils.optionNone(), () => [SelectFieldUtils.optionNone()]),
        serialNumber: Field.text('serialNumber'),
        message: Field.text('message'),
        name: Field.text('name'),
        surname: Field.text('surname'),
        email: Field.text('email'),
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
            init: action,
        })
    }

    init() {
        this.loadCodetables()
    }

    loadCodetables() {
        this.isLoading = true

        new Promise<SelectField[]>(resolve => {
            resolve([
                {
                    code: '1',
                    value: 'Zapínání a napájení',
                },
                {
                    code: '2',
                    value: 'Problémy s hardwarem',
                },
                {
                    code: '3',
                    value: 'Instalace a aktualizace',
                },
                {
                    code: '4',
                    value: 'Navigace v aplikacích',
                },
                {
                    code: '5',
                    value: 'Software a používání',
                },
                {
                    code: '6',
                    value: 'Problémy s účty',
                },
                {
                    code: '7',
                    value: 'Internet a připojení',
                },
                {
                    code: '8',
                    value: 'Kamera',
                },
                {
                    code: '9',
                    value: 'Technický dotaz',
                },
                {
                    code: '10',
                    value: 'Obecný dotaz',
                },
                {
                    code: '11',
                    value: 'Operační systém',
                },
            ])
        }).then(options =>
            runInAction(() => {
                SelectFieldUtils.initFieldSelect(this.form.caseType, options, false, false, true)
            })
        )
    }
}
