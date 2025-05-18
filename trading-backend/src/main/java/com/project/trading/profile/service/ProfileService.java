package com.project.trading.profile.service;

import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;

public class ProfileService {

    @Autowired
    private UserRepository userRepository;

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
}
