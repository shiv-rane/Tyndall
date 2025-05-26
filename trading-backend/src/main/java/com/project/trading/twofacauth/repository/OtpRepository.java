package com.project.trading.twofacauth.repository;

import com.project.trading.auth.model.User;
import com.project.trading.twofacauth.model.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity,Integer> {

   Optional<OtpEntity> findByUser(User user);
}
