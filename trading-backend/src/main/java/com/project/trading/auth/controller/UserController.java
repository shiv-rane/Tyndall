package com.project.trading.auth.controller;

import com.project.trading.auth.dto.LoginRequest;
import com.project.trading.auth.dto.RegisterRequest;
import com.project.trading.auth.service.UserService;
import com.project.trading.twofacauth.dto.OtpRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest registerRequest) {
        Map<String, String> response = new HashMap<>();

        try {
            boolean result = userService.registerUser(registerRequest);
            if (result) {
                response.put("message", "Registration successful. OTP sent to your email.");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Registration failed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody LoginRequest loginRequest){
        String jwtToken = userService.loginUser(loginRequest);
        Map<String,String> response = new HashMap<>();
        response.put("token",jwtToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String,String>> verifyOtp(@RequestBody OtpRequestDTO otpRequestDTO){
        Map<String , String> response = new HashMap<>();

        try{
            String token = userService.verifyOtp(otpRequestDTO.getEmail(),otpRequestDTO.getOtp());
            response.put("token", token);
            return ResponseEntity.ok(response);
        }catch (IllegalArgumentException e){
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }catch (Exception e){
            response.put("error", "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}


