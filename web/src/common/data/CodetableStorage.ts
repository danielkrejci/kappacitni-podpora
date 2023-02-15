import { SelectField } from '../forms/SelectField'

export class CodetableStorage {
    static deviceTypes(): Promise<SelectField[]> {
        return new Promise<SelectField[]>(resolve => {
            resolve([
                {
                    code: 'myPhone',
                    value: 'Mobilní telefon',
                },
                {
                    code: 'myPad',
                    value: 'Tablet',
                },
                {
                    code: 'myBook',
                    value: 'Notebook',
                },
                {
                    code: 'myStudio',
                    value: 'Osobní počítač',
                },
                {
                    code: 'myWatch',
                    value: 'Chytré hodinky',
                },
                {
                    code: 'myPods',
                    value: 'Sluchátka',
                },
                {
                    code: 'accessories',
                    value: 'Ostatní',
                },
            ])
        })
    }

    static serviceCases(): Promise<SelectField[]> {
        return new Promise<SelectField[]>(resolve => {
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
        })
    }
}
