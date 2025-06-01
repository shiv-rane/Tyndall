package com.project.trading.journal.controller;

import com.project.trading.journal.dto.FilterTrade;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
        journalService.addJournal(journal);
        return ResponseEntity.ok("Trade add successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<?> fetchJournal(){
        return ResponseEntity.ok(journalService.displayList());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteJournal(@PathVariable Integer id){
        journalService.deleteJournal(id);
        return ResponseEntity.ok("Trade deleted successfully");
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editJournal(@PathVariable Integer id, @RequestBody Journal updatedjournal){
        journalService.editJournal(id,updatedjournal);
        return ResponseEntity.ok("Trade updated successfully");
    }

    @GetMapping("/filter-trades")
    public ResponseEntity<?> filterTrade(FilterTrade filterTrade){
        return ResponseEntity.ok(journalService.filterTrade(filterTrade));
    }

}
