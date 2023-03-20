package cz.uhk.mois.kappasupport.exception

class JWTException : RuntimeException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
}
