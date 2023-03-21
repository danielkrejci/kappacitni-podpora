package cz.uhk.mois.kappasupport.exception

class UserIsOperatorException : RuntimeException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
}
