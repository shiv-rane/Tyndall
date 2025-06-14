package com.project.trading.journal.controller;

import com.project.trading.journal.dto.FilterTrade;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Filter;

@CrossOrigin
@RestController
@RequestMapping("/api/journal")
public class JournalController {

    @Autowired
    private JournalService journalService;

    @PostMapping("/add")
    public ResponseEntity<?> addJournal(@RequestBody Journal journal){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        journalService.addJournal(journal,email);
        return ResponseEntity.ok("Trade add successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<?> fetchJournal(){
        return ResponseEntity.ok(journalService.displayList());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteJournal(@PathVariable Integer id){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        journalService.deleteJournal(id,email);
        return ResponseEntity.ok("Trade deleted successfully");
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editJournal(@PathVariable Integer id, @RequestBody Journal updatedjournal){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        journalService.editJournal(id,updatedjournal,email);
        return ResponseEntity.ok("Trade updated successfully");
    }

//    @GetMapping("/filter-trades")
//    public ResponseEntity<?> filterTrade(FilterTrade filterTrade){
//        return ResponseEntity.ok(journalService.filterTrade(filterTrade));
//    }

}
