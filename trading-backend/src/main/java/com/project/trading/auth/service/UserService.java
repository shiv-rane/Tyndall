package com.project.trading.auth.service;

import com.project.trading.auth.dto.LoginRequest;
import com.project.trading.auth.dto.RegisterRequest;
import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.auth.security.JwtUtils;
import com.project.trading.auth.service.validation.Validation;
import com.project.trading.twofa.EmailService;
import com.project.trading.twofa.OtpEntity;
import com.project.trading.twofa.OtpRepository;
import com.project.trading.twofa.OtpService;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;


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

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpRepository otpRepository;

    public boolean registerUser(@NonNull RegisterRequest registerRequest){

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
        user.setVerified(false);
        userRepository.save(user);
//        return jwtUtils.generateToken(registerRequest.getEmail());
        String otp = otpService.generateOTP();
        LocalDateTime expiryTime = otpService.calculateExpiryTime(5);

        emailService.sendEmail(registerRequest.getEmail(), otp);

        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setOtp(otp);
        otpEntity.setUser(user);
        otpEntity.setExpiration_time(expiryTime);
        otpRepository.save(otpEntity);

        return true;
    }

    public String loginUser(@NonNull LoginRequest loginRequest){
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User doesn't exist"));

        if(!passwordEncoder.matches(loginRequest.getPassword(),user.getPassword())){
            throw new IllegalArgumentException("Password is incorrect");
        }
        return jwtUtils.generateToken(loginRequest.getEmail());
    }

    public String verifyOtp(@NotNull String email, @NotNull  String otp){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Optional<OtpEntity> otpEntityOpt = otpRepository.findByUser(user);
        if(otpEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Otp not found for this email");
        }

        OtpEntity otpEntity = otpEntityOpt.get();

        if(otpEntity.getExpiration_time().isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Otp has expired");
        }

        if(!otpEntity.getOtp().equals(otp)){
            throw new IllegalThreadStateException("Invalid otp");
        }

        user.setVerified(true);
        otpRepository.delete(otpEntity);

        return jwtUtils.generateToken(email);
    }
}