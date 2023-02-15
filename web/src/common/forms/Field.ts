import { makeObservable, observable, runInAction } from 'mobx'
import { SelectField } from './SelectField'
import { Validation } from './Validation'

/**
 * Definition and data for single form field.
 */
export class Field<T> {

    /**
     * Name of field (usable for form input name attribute)
     */
    name: string

    /**
     * Field value.
     */
    value: T

    /**
     * Shallow copy of field initial value set on field instance creation. 
     * Should be used to check that field value was changed or when reseting to default.
     */
    initialValue: T

    /**
     * Field validation.
     */
    validation = new Validation()

    /**
     * Options for select field.
     */
    options: () => SelectField[]

    /**
     * Flag says if field value was changed.
     */
    changed = false

    constructor(name: string, value: T, options?: () => SelectField[]) {
        makeObservable(this, {
            value: observable,
            validation: observable,
            options: observable,
            changed: observable,
            initialValue: observable,
        })
        this.name = name
        this.value = value
        if (Array.isArray(value)) {
            this.initialValue = [...value] as any as T
        } else if (typeof value === 'object') {
            this.initialValue = Object.assign({}, value)
        } else {
            this.initialValue = value
        }
        this.options = options || (() => [])
    }

    public static text(name: string, value?: string): Field<string> {
        return new Field<string>(name, value || '')
    }

    public static bool(name: string, value?: boolean): Field<boolean> {
        return new Field<boolean>(name, value === true)
    }

    public static multiSelect<T extends SelectField>(name: string, value?: T[], options?: () => T[]): Field<T[]> {
        return new Field<T[]>(name, value || [], options || (() => []))
    }

    public static select<T extends SelectField>(name: string, value: T, options?: () => T[]): Field<T> {
        return new Field<T>(name, value, options || (() => []))
    }

    onChange(changeEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void {
        runInAction(() => {

            // Reset field validation on field content change
            this.validation.reset()

            if (changeEvent.target.type === 'checkbox' && changeEvent.target instanceof HTMLInputElement) {
                this.value = (changeEvent.target as HTMLInputElement).checked as unknown as T

            } else if (typeof this.value === 'boolean') {
                let targetValue = 'false'

                if (changeEvent.target.value && changeEvent.target.value.toLocaleLowerCase) {
                    targetValue = changeEvent.target.value.toLocaleLowerCase()
                }

                this.value = (targetValue === 'true' || targetValue === 'yes' || targetValue === 'on' || targetValue === '1') as unknown as T

            } else {
                this.value = changeEvent.target.value as unknown as T
            }

            this.changed = true
        })
    }
}