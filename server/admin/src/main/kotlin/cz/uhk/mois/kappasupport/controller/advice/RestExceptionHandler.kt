package cz.uhk.mois.kappasupport.controller.advice

import cz.uhk.mois.kappasupport.exception.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class RestExceptionHandler {


    @ExceptionHandler(value = [UserIsNotOperatorException::class])
    fun handleDeviceNotFound(ex: UserIsNotOperatorException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.BAD_REQUEST, ex.message!!)
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(value = [UserNotFoundException::class])
    fun handleUserNotFound(ex: UserNotFoundException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.NOT_FOUND, ex.message!!)
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler(value = [JWTException::class])
    fun handleUserNotFound(ex: JWTException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.BAD_REQUEST, ex.message!!)
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.BAD_REQUEST)
    }


    @ExceptionHandler(value = [EmailNotFoundException::class])
    fun handleUserNotFound(ex: EmailNotFoundException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.NOT_FOUND, ex.message!!)
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler(value = [ServiceCaseNotFoundException::class])
    fun handleUserNotFound(ex: ServiceCaseNotFoundException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.NOT_FOUND, ex.message!!)
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.NOT_FOUND)
    }

}