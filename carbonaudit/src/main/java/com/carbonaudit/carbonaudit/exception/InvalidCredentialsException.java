package com.carbonaudit.carbonaudit.exception;

public class InvalidCredentialsException
        extends RuntimeException {

    public InvalidCredentialsException(String message){

        super(message);
    }
}