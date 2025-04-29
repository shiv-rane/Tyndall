package com.project.trading.auth.service;

import com.project.trading.auth.dto.LoginRequest;
import com.project.trading.auth.dto.RegisterRequest;
import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.auth.security.JwtUtils;
import com.project.trading.auth.service.validation.Validation;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Validation validation;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public String registerUser(@NonNull RegisterRequest registerRequest){
//        if(!validation.isNameValid(registerRequest.getName())){
//            throw new IllegalArgumentException("Invalid name");
//        }
        if(!validation.isEmailValid(registerRequest.getEmail())){
            throw new IllegalArgumentException("Invalid email");
        }
        if(!validation.isPassValid(registerRequest.getPassword())){
            throw new IllegalArgumentException("Password is weak");
        }
        if(userRepository.existsByEmail(registerRequest.getEmail())){
            throw new IllegalArgumentException("Email already exists");
        }
        if(!registerRequest.getPassword().equals(registerRequest.getConfirm_password())){
            throw new IllegalArgumentException("Password doesn't match");
        }
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPremium(false);
        userRepository.save(user);
        return jwtUtils.generateToken(registerRequest.getEmail());
    }

    public String loginUser(@NonNull LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User doesn't exist"));

        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPassword())){
            throw new IllegalArgumentException("Password is incorrect");
        }
        return jwtUtils.generateToken(loginRequest.getEmail());
    }



}
