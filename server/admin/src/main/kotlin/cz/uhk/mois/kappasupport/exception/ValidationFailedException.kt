package cz.uhk.mois.kappasupport.exception

class ValidationFailedException : RuntimeException {

    constructor(message: String?) : super(message)
}