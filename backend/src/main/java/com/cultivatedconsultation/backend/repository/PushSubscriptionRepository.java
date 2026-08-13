package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByEndpoint(String endpoint);
    List<PushSubscription> findByUser(AppUser user);

    // Derived delete queries load matching entities then call EntityManager.remove()
    // on each — unlike the inherited delete(entity)/deleteById(id) from JpaRepository
    // (whose methods are @Transactional on SimpleJpaRepository itself), this custom
    // one isn't covered by that and needs its own @Transactional or it 404s at
    // runtime with "No EntityManager with actual transaction available".
    @Transactional
    void deleteByEndpoint(String endpoint);
}
