package com.YourInventory.InventoryManagementSystem.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.YourInventory.InventoryManagementSystem.dtos.Response;

@ControllerAdvice

public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response> handelAllExceptions(Exception e){
        Response response = Response.builder()
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .message(e.getMessage())
            .build();
        return new ResponseEntity<>(response , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Response> handleNotFoundException(NotFoundException e){
        Response response = Response.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .message(e.getMessage())
            .build();
        return new ResponseEntity<>(response , HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(NameValueRequiredException.class)
    public ResponseEntity<Response> handleNameValueRequiredException(NameValueRequiredException e){
        Response response = Response.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .message(e.getMessage())
            .build();
        return new ResponseEntity<>(response , HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(InavlidCredentialsException.class)
    public ResponseEntity<Response> handleInvalidCredentialException(InavlidCredentialsException e){
        Response response = Response.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .message(e.getMessage())
            .build();
        return new ResponseEntity<>(response , HttpStatus.BAD_REQUEST);
    }
}
