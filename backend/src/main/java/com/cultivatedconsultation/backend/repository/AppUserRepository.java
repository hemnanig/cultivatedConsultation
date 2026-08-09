package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByGoogleSub(String googleSub);
    Optional<AppUser> findByEmail(String email);
}
