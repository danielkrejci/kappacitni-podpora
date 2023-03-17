package cz.uhk.mois.client.exception

class AddressNotCompleteException : RuntimeException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
}
