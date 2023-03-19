package cz.uhk.mois.client.exception

class UserNotFoundException : RuntimeException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
}
