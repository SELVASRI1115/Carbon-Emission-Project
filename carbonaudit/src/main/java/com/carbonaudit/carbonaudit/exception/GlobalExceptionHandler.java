package com.carbonaudit.carbonaudit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            ResourceNotFoundException.class
    )
    public ResponseEntity<?> handleResourceNotFound(
            ResourceNotFoundException ex){

        Map<String,Object> error =
                new HashMap<>();

        error.put(
                "timestamp",
                LocalDateTime.now()
        );

        error.put(
                "status",
                HttpStatus.NOT_FOUND.value()
        );

        error.put(
                "message",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(
            UserAlreadyExistsException.class
    )
    public ResponseEntity<?> handleUserExists(
            UserAlreadyExistsException ex){

        Map<String,Object> error =
                new HashMap<>();

        error.put(
                "timestamp",
                LocalDateTime.now()
        );

        error.put(
                "status",
                HttpStatus.BAD_REQUEST.value()
        );

        error.put(
                "message",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(
            InvalidCredentialsException.class
    )
    public ResponseEntity<?> handleCredentials(
            InvalidCredentialsException ex){

        Map<String,Object> error =
                new HashMap<>();

        error.put(
                "timestamp",
                LocalDateTime.now()
        );

        error.put(
                "status",
                HttpStatus.UNAUTHORIZED.value()
        );

        error.put(
                "message",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(
            Exception ex){

        Map<String,Object> error =
                new HashMap<>();

        error.put(
                "timestamp",
                LocalDateTime.now()
        );

        error.put(
                "status",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );

        error.put(
                "message",
                ex.getMessage()
        );

        return new ResponseEntity<>(
                error,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}