package com.project.trading.profile.service;

import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.profile.dto.ChangePassDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void setInitialCapital(Long capital){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        user.setInitial_capital(capital);
        userRepository.save(user);
    }

    public void deleteAccount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        userRepository.delete(user);
    }

    public void changePass(ChangePassDTO changePassDTO){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        if(!passwordEncoder.matches(user.getPassword(),changePassDTO.getCurrent_pass())){
            throw new IllegalArgumentException("Incorrect password");
        }
        if(!changePassDTO.getNew_pass().equals(changePassDTO.getConfirm_password())){
            throw new IllegalArgumentException("Password does not match");
        }
        user.setPassword(passwordEncoder.encode(changePassDTO.getConfirm_password()));
        userRepository.save(user);
    }

    public void changeName(String full_name){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        user.setName(full_name);
        userRepository.save(user);
    }
}
