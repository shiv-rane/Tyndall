package com.project.trading.auth.service.validation;

import org.springframework.stereotype.Service;

@Service
public class Validation {

    public boolean isPassValid(String pass){
        final String passRegex = "^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\\w\\d\\s:])([^\\s]){8,16}$";
        return pass !=null && pass.matches(passRegex);
    }

    public boolean isEmailValid(String email){
        final String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email != null && email.matches(emailRegex);
    }

    public boolean isNameValid(String name){
        final String nameRegex = "^[A-Za-z]";
        return name != null && name.matches(nameRegex);
    }

}
