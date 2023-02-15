package cz.uhk.mois.client.controller.advice

import cz.uhk.mois.client.exception.DeviceNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler


@ControllerAdvice
class RestExceptionHandler {

    @ExceptionHandler(value = [DeviceNotFoundException::class])
    fun handleYourException(ex: DeviceNotFoundException): ResponseEntity<ErrorResponse?>? {
        val error: ErrorResponse = ErrorResponse.create(ex, HttpStatus.NOT_FOUND, "Device not found")
        return ResponseEntity<ErrorResponse?>(error, HttpStatus.NOT_FOUND)
    }
}