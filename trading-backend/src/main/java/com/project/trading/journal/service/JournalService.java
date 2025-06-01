package com.project.trading.journal.service;

import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.journal.dto.FilterTrade;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

    public void addJournal(Journal journal){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        journal.setUser(user);
        journalRepository.save(journal);
    }
    public List<Journal> displayList(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return journalRepository.findByUserOrderByCreatedAtDesc(user);
    }
    public void editJournal(Integer id,Journal updatedJournal){
        Journal existingJournal = journalRepository.findById(id).orElseThrow();
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!existingJournal.getUser().getEmail().equals(email)){
            throw new SecurityException("You don't have permission to edit this");
        }
        existingJournal.setDate(updatedJournal.getDate());
        existingJournal.setSymbol(updatedJournal.getSymbol());
        existingJournal.setTradeType(updatedJournal.getTradeType());
        existingJournal.setOptionType(updatedJournal.getOptionType());
        existingJournal.setEntryPrice(updatedJournal.getEntryPrice());
        existingJournal.setEntryTime(updatedJournal.getEntryTime());
        existingJournal.setExitPrice(updatedJournal.getExitPrice());
        existingJournal.setExitTime(updatedJournal.getExitTime());
        existingJournal.setQuantity(updatedJournal.getQuantity());
        existingJournal.setPnl(updatedJournal.getPnl());
        existingJournal.setStrategy(updatedJournal.getStrategy());
        existingJournal.setNote(updatedJournal.getNote());

        journalRepository.save(existingJournal);
    }
    public void deleteJournal(Integer Id){
        Journal journal = journalRepository.findById(Id).orElseThrow();
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!journal.getUser().getEmail().equals(email)){
            throw new SecurityException("You don't have permission to delete this");
        }
        journalRepository.delete(journal);
    }

    public List<Journal> filterTrade(FilterTrade filterTrade){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Journal> journals = journalRepository.findByUserEmailAndDateBetweenOrderByDateAsc(email, filterTrade.getStartDate(),filterTrade.getEndDate());
        return journals;
    }

}
