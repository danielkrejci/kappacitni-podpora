package cz.uhk.mois.kappasupport.controller.advice

import cz.uhk.mois.kappasupport.exception.UserIsNotOperatorException
import cz.uhk.mois.kappasupport.exception.UserNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class RestExceptionHandler {


    @ExceptionHandler(value = [UserIsNotOperatorException::class])
    fun handleDeviceNotFound(ex: UserIsNotOperatorException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.BAD_REQUEST, "User is not operator")
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(value = [UserNotFoundException::class])
    fun handleUserNotFound(ex: UserNotFoundException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.NOT_FOUND, "User not found")
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.NOT_FOUND)
    }

}