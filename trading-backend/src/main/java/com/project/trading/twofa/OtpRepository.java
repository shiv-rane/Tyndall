package com.project.trading.twofa;

import com.project.trading.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity,Integer> {

   Optional<OtpEntity> findByUser(User user);
}
