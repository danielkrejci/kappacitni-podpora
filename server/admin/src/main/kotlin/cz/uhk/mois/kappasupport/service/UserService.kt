package cz.uhk.mois.kappasupport.service


import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.domain.User
import cz.uhk.mois.kappasupport.exception.*
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.UserRepository
import cz.uhk.mois.kappasupport.util.UserLoser
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class UserService(
    private val userRepository: UserRepository,
    private val addressService: AddressService,
    private val mapper: DomainMapper,
    private val validationService: ValidationService,
    private val usersServiceCasesService: UsersServiceCasesService
) {


    fun findAllByIds(ids: List<Long>): Flux<UserDto> {
        return userRepository.findAllByIdIn(ids).map { mapper.toDto(it) }
    }

    fun getCurrentUser(email: String): Mono<UserLoser> = userRepository.findByEmail(email)
        .flatMap(this::mapUserToUserLoser)
        .switchIfEmpty(Mono.error(UserNotFoundException("User with email $email not found")))

    fun findAllOperators(): Flux<UserLoser> = userRepository.findAllOperators()
        .flatMap(this::mapUserToUserLoser)

    fun findAllClients(): Flux<UserLoser> = userRepository.findAllClients()
        .flatMap(this::mapUserToUserLoser)

    fun findAllByIdIn(id: List<Long>): Flux<User> {
        return userRepository.findAllByIdIn(id)
    }

    fun updateUserPicture(userId: Long, picture: String?): Mono<User> {
        return userRepository.findById(userId).flatMap {
            it.picture = picture
            userRepository.save(it)
        }
    }

    fun saveUser(user: UserLoser, id: Long?): Mono<Boolean> {
        return validationService.validateUser(user, true).flatMap {
            val userToSave = mapper.userLoserToUser(it)
            userToSave.isOperator = true
            userToSave.id = id
            if (user.hasEmptyAddressAttribute()) {
                userRepository.save(userToSave).flatMap { Mono.just(true) }
            } else {
                val address = mapper.fromUserLoserToAddress(user)
                address.id = null
                addressService.findById(it.id).flatMap {
                    it.street = user.street
                    it.city = user.city
                    it.houseNumber = user.houseNumber
                    it.postalCode = user.postalCode
                    addressService.save(it).flatMap {
                        userToSave.addressId = it.id
                        userRepository.save(userToSave).flatMap {
                            Mono.just(true)
                        }
                    }
                }.switchIfEmpty(userRepository.save(userToSave).flatMap { Mono.just(true) })
            }
        }
    }

    fun updateUser(user: UserLoser, userId: Long): Mono<Boolean> {
        return validationService.validateUser(user, true).flatMap { validateUser ->
            userRepository.findByEmail(validateUser.email!!).flatMap { foundedUser ->
                foundedUser.isOperator = true
                if (validateUser.hasEmptyAddressAttribute()) {
                    foundedUser.name = user.name
                    foundedUser.surname = user.surname
                    foundedUser.phone = user.phone
                    userRepository.save(foundedUser).flatMap { Mono.just(true) }
                } else {
                    if (foundedUser.addressId == null) {
                        val address = mapper.fromUserLoserToAddress(user)
                        addressService.save(mapper.fromDto(address)).flatMap {
                            updateUserAddress(foundedUser.id!!, it.id!!).flatMap {
                                userRepository.save(foundedUser).flatMap { Mono.just(true) }

                            }
                        }
                    } else {
                        addressService.findById(foundedUser.addressId!!).flatMap {
                            it.street = user.street
                            it.city = user.city
                            it.houseNumber = user.houseNumber
                            it.postalCode = user.postalCode
                            addressService.save(it).flatMap {
                                userRepository.save(foundedUser).flatMap { Mono.just(true) }

                            }
                        }
                    }

                }
            }
        }
    }

    fun create(user: UserLoser): Mono<Boolean> {
        if (user.email.isNullOrBlank() || user.email.isNullOrEmpty()) return Mono.error(ValidationFailedException("Email is mandatory for user creation"))
        return findByEmail(user.email!!).flatMap {
            if (it.isOperator) {
                Mono.error(UserIsOperatorException("User is already operator"))
            } else {
                updateUser(user, it.id!!)
            }
        }.switchIfEmpty(saveUser(user, null))
    }

    fun deleteUser(userId: Long): Mono<Boolean> {
        return userRepository.findById(userId).flatMap { foundedUser ->
            val assignedCases = usersServiceCasesService.getServiceCasesForOperatorId(foundedUser.id!!).collectList()
            if (foundedUser.isClient && !foundedUser.isOperator) {
                Mono.error(UserIsClientException("Cannot delete client user"))
            } else if (foundedUser.isOperator && !foundedUser.isClient) {
                assignedCases.flatMap { assignedServiceCases ->
                    if (assignedServiceCases.isEmpty()) {
                        userRepository.delete(foundedUser).thenReturn(Mono.just(true))
                            .flatMap {
                                Mono.just(true)
                            }
                    } else {
                        Mono.error(GenericException("This operator has assaigned service cases $assignedServiceCases "))
                    }
                }
            } else if (foundedUser.isOperator && foundedUser.isClient) {
                assignedCases.flatMap { assignedServiceCases ->
                    if (assignedServiceCases.isEmpty()) {
                        foundedUser.isOperator = false
                        userRepository.save(foundedUser)
                            .flatMap { Mono.just(true) }
                    } else {
                        Mono.error(GenericException("This operator has assaigned service cases $assignedServiceCases "))
                    }
                }
            } else {
                Mono.error(GenericException("User is nothing"))
            }
        }.switchIfEmpty(Mono.error(UserNotFoundException("User with id: $userId does not exist")))

    }

    fun editUser(user: UserLoser, userId: Long): Mono<Boolean> {
        return validationService.validateUser(user, false).flatMap { useros ->
            userRepository.findById(userId)
                .flatMap {
                    it.name = useros.name
                    it.surname = useros.surname
                    it.phone = useros.phone
                    userRepository.save(it)
                        .flatMap { savedUser ->
                            if (savedUser.addressId != null && !useros.hasIncompleteAddressAttributes() && !useros.hasEmptyAddressAttribute()) {
                                addressService.findById(it.addressId!!)
                                    .flatMap { address ->
                                        address.city = useros.city
                                        address.houseNumber = useros.houseNumber
                                        address.street = useros.street
                                        address.postalCode = useros.postalCode
                                        addressService.save(address)
                                            .flatMap { Mono.just(true) }
                                    }
                            } else {
                                if (useros.hasIncompleteAddressAttributes()) {
                                    Mono.error(AddressNotCompleteException("Address is not complete"))
                                } else {
                                    if (!useros.hasEmptyAddressAttribute()) {
                                        val address = mapper.fromUserLoserToAddress(useros)
                                        addressService.save(mapper.fromDto(address))
                                            .flatMap {
                                                updateUserAddress(savedUser.id!!, it.id!!).flatMap {
                                                    Mono.just(true)
                                                }
                                            }
                                    } else {
                                        Mono.just(true)
                                    }

                                }
                            }
                        }
                }
                .switchIfEmpty(Mono.error(UserNotFoundException("User with id: $userId not found ")))
        }
    }

    fun updateUserAddress(userId: Long, addressId: Long): Mono<User> {
        return userRepository.findById(userId).flatMap {
            it.addressId = addressId
            userRepository.save(it)
        }
    }


    fun findALlByIds(ids: List<Long>): Flux<UserDto> {
        return userRepository.getUsersByIdIn(ids).map { mapper.toDto(it) }

    }

    fun findByEmail(email: String): Mono<UserDto> {
        return userRepository.findByEmail(email)
            .map { mapper.toDto(it) }
    }

    fun findByUserId(id: Long): Mono<UserDto> {
        return userRepository.findById(id)
            .map { mapper.toDto(it) }
    }

    fun getUsersByIdIn(ids: List<Long>): Flux<UserDto> {
        return userRepository.getUsersByIdIn(ids).map { mapper.toDto(it) }
    }

    private fun mapUserToUserLoser(user: User): Mono<UserLoser> {
        val userDto = mapper.toDto(user)
        return if (userDto.addressId != null) {
            addressService.findById(userDto.addressId!!).flatMap { address ->
                Mono.just(mapper.toUserLoser(userDto, mapper.toDto(address)))
            }
        } else {
            Mono.just(mapper.toUserLoser(userDto))
        }
    }

    fun findById(userId: Long): Mono<User> {
        return userRepository.findById(userId)
    }


}