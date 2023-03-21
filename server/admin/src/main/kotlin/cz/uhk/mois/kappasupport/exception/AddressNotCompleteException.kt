package cz.uhk.mois.kappasupport.exception

class AddressNotCompleteException : RuntimeException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
}
