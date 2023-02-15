import { action, makeObservable, observable } from 'mobx'

/**
 * State of field validation.
 */
export class Validation {

    /**
     * Flag says is field passes validatino.
     */
    valid = true

    /**
     * Error labels related to performed validations.
     */
    errorLabels: string[] = []

    constructor() {
        makeObservable(this, {
            valid: observable,
            errorLabels: observable,
            addError: action,
            reset: action
        })
    }

    /**
     * Marks validation as invalid and adds given error label.
     * @param label error label.
     */
    addError(label: string): Validation {
        this.valid = false
        this.errorLabels.push(label)
        return this
    }

    /**
     * Marks validation as valid a removes error labels.
     */
    reset(): Validation {
        this.valid = true
        this.errorLabels = []
        return this
    }
}