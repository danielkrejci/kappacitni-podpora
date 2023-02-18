package cz.uhk.mois.client.exception

class ValidationFailedException : RuntimeException {

    constructor(message: String?) : super(message)
}