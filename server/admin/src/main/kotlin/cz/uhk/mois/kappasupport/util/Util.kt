package cz.uhk.mois.kappasupport.util

import cz.uhk.mois.kappasupport.controller.model.ServiceCaseType
import cz.uhk.mois.kappasupport.controller.model.StateType
import cz.uhk.mois.kappasupport.exception.GenericException
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant


data class SendMessage(
    var message: String
)

data class AssignUser(
    var userId: String
)

data class ChangeState(
    var stateId: String
)

data class ChangeCategory(
    var categoryId: Long
)

fun getServiceCaseTypeById(id: Long): Mono<ServiceCaseType> {
    return Flux.fromIterable(ServiceCaseType.values().toList())
        .filter { it.id == id }.singleOrEmpty()
        .switchIfEmpty(Mono.error(GenericException("Category with id $id does not exists")))
}

fun getServiceCaseStateById(id: Long): Mono<StateType> {
    return Flux.fromIterable(StateType.values().toList())
        .filter { it.id == id }.singleOrEmpty()
        .switchIfEmpty(Mono.error(GenericException("State with id $id does not exists")))
}


data class UserLoser(
    var id: Long,
    var name: String,
    var surname: String,
    var email: String?,
    var phone: String?,
    var street: String?,
    var houseNumber: String?,
    var city: String?,
    var postalCode: String?,
    var isClient: Boolean,
    var isOperator: Boolean,
    var picture: String?
) {
    fun hasIncompleteAddressAttributes(): Boolean {
        return (street.isNullOrBlank() || houseNumber.isNullOrBlank() || postalCode.isNullOrBlank() || city.isNullOrBlank())
                && (street?.isNotBlank() == true || houseNumber?.isNotBlank() == true || postalCode?.isNotBlank() == true || city?.isNotBlank() == true)
    }

    fun hasEmptyAddressAttribute(): Boolean {
        return street.isNullOrEmpty() && houseNumber.isNullOrEmpty() && postalCode.isNullOrEmpty() && city.isNullOrEmpty()
    }

}


data class ServiceCaseLogResponse(
    var id: Long?,
    var date: Instant,
    var user: UserLoser,
    var action: String
)

enum class DeviceType(
    val deviceType: String,
    val deviceName: String,
    val code: Long
) {
    MY_PHONE("Mobilní telefon", "myPhone", 1),
    MY_PAD("Tablet", "myPad", 2),
    MY_BOOK("Notebook", "myBook", 3),
    MY_STUDIO("Osobní počítač", "myStudio", 4),
    MY_WATCH("Chytré hodinky", "myWatch", 5),
    MY_PODS("Sluchátka", "myPods", 6),
    ACCESSORIES("Ostatní", "accessories", 7);
}


