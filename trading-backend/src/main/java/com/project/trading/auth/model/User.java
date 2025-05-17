package com.project.trading.auth.model;

import com.project.trading.journal.model.Journal;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(nullable = false)
    String name;

    @Column(unique = true, nullable = false)
    String email;

    @Column(nullable = false)
    String password;

    @Column
    Long initial_capital;

    @Column(nullable = false, columnDefinition = "boolean default false")
    Boolean isPremium;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Journal> trades;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getInitial_capital() {return initial_capital;}

    public void setInitial_capital(Long initial_capital) {this.initial_capital = initial_capital;}

    public Boolean getPremium() {
        return isPremium;
    }

    public void setPremium(Boolean premium) {
        isPremium = premium;
    }

}
