package cz.uhk.mois.kappasupport.util

import java.security.KeyPairGenerator
import java.security.SecureRandom
import java.security.spec.RSAKeyGenParameterSpec


data class UserLoser(
    var id: Long,
    var name: String,
    var surname: String,
    var email: String,
    var phone: String?,
    var street: String?,
    var houseNumber: String?,
    var city: String?,
    var postalCode: String?,
    var isClient: Boolean,
    var isOperator: Boolean
)

fun generateRSA256Keys(): Pair<ByteArray, ByteArray> {
    // Generate a secure random number generator
    val random = SecureRandom()

    // Create a RSA key pair generator with 256-bit key size
    val keyPairGenerator = KeyPairGenerator.getInstance("RSA")
    val keyGenParameterSpec = RSAKeyGenParameterSpec(256, RSAKeyGenParameterSpec.F4)
    keyPairGenerator.initialize(keyGenParameterSpec, random)

    // Generate the RSA key pair
    val keyPair = keyPairGenerator.generateKeyPair()

    // Extract the public and private keys as byte arrays
    val publicKeyBytes = keyPair.public.encoded
    val privateKeyBytes = keyPair.private.encoded

    return Pair(publicKeyBytes, privateKeyBytes)
}
