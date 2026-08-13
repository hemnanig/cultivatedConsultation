package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

    @Query("select o from Opportunity o join fetch o.author order by o.createdAt desc")
    List<Opportunity> findAllWithAuthorOrderByCreatedAtDesc();
}
