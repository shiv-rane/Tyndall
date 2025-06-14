package com.project.trading.journal.service;

import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

//    @CacheEvict(
//            value = {
//                    "summary", "recent-trade", "analytics-summary", "strategy-table",
//                    "heatstreak", "weekly-performance", "monthly-performance", "equity-curve"
//            },
//            key = "#email"
//    )
    public void addJournal(Journal journal,String email){

        User user = userRepository.findByEmail(email).orElseThrow();
        journal.setUser(user);
        journalRepository.save(journal);
    }

    public List<Journal> displayList(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return journalRepository.findByUserOrderByCreatedAtDesc(user);
    }

//    @CacheEvict(
//            value = {
//                    "summary", "recent-trade", "analytics-summary", "strategy-table",
//                    "heatstreak", "weekly-performance", "monthly-performance", "equity-curve"
//            },
//            key = "#email"
//    )
    public void editJournal(Integer id,Journal updatedJournal,String email){
        Journal existingJournal = journalRepository.findById(id).orElseThrow();

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

//    @CacheEvict(
//            value = {
//                    "summary", "recent-trade", "analytics-summary", "strategy-table",
//                    "heatstreak", "weekly-performance", "monthly-performance", "equity-curve"
//            },
//            key = "#email"
//    )
    public void deleteJournal(Integer Id,String email){
        Journal journal = journalRepository.findById(Id).orElseThrow();

        if(!journal.getUser().getEmail().equals(email)){
            throw new SecurityException("You don't have permission to delete this");
        }
        journalRepository.delete(journal);
    }

//    public List<Journal> filterTrade(@NonNull FilterTrade filterTrade){
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        return journalRepository.findByUserEmailAndDateBetweenOrderByDateAsc(email, filterTrade.getStartDate(),filterTrade.getEndDate());
//    }

}
