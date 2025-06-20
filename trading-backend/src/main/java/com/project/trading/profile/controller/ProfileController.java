package com.project.trading.profile.controller;

import com.project.trading.profile.dto.ChangeNameDTO;
import com.project.trading.profile.dto.ChangePassDTO;
import com.project.trading.profile.dto.InitialCapitalDTO;
import com.project.trading.profile.dto.ProfileInfoDTO;
import com.project.trading.profile.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PutMapping("/set-initial-capital")
    public ResponseEntity<String> setInitialCapital(@RequestBody InitialCapitalDTO capital){
        profileService.setInitialCapital(capital);
        return ResponseEntity.ok("Capital has been set");
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(){
        profileService.deleteAccount();
        return ResponseEntity.ok("Account deleted successfully");
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePass(@RequestBody ChangePassDTO changePassDTO){
        profileService.changePass(changePassDTO);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PutMapping("/change-name")
    public ResponseEntity<String> changeName(@RequestBody ChangeNameDTO changeNameDTO){
        profileService.changeName(changeNameDTO.getFull_name());
        return ResponseEntity.ok("Name changed successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileInfoDTO> getProfileInfo(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(profileService.getProfileInfo(email));

    }

}
