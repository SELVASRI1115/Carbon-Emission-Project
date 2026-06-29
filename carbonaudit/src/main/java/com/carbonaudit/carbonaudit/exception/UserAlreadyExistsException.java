package com.carbonaudit.carbonaudit.exception;

public class UserAlreadyExistsException
        extends RuntimeException {

    public UserAlreadyExistsException(String message){

        super(message);
    }
}