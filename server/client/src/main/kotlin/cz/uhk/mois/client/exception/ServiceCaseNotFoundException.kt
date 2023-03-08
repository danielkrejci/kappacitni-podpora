package cz.uhk.mois.client.exception

class ServiceCaseNotFoundException : RuntimeException {
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
}
