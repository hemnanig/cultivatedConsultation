package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.CredentialStatus;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByGoogleSub(String googleSub);
    Optional<AppUser> findByEmail(String email);
    List<AppUser> findByMembershipStatusOrderByNameAsc(MembershipStatus status);
    List<AppUser> findByCredentialStatusOrderByNameAsc(CredentialStatus status);
}
