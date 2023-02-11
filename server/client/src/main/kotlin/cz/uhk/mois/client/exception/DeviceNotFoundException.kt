package cz.uhk.mois.client.exception

class DeviceNotFoundException : RuntimeException {
    constructor()
    constructor(message: String?) : super(message)
    constructor(message: String?, cause: Throwable?) : super(message, cause)
}
