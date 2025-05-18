package com.project.trading.profile.controller;

import com.project.trading.profile.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PutMapping("/set-initial-capital")
    public ResponseEntity<String> setInitialCapital(Long capital){
        profileService.setInitialCapital(capital);
        return ResponseEntity.ok("Capital has been set");
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(){
        profileService.deleteAccount();
        return ResponseEntity.ok("Account deleted successfully");
    }
}
