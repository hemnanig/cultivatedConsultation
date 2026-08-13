package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByEndpoint(String endpoint);
    List<PushSubscription> findByUser(AppUser user);
    void deleteByEndpoint(String endpoint);
}
