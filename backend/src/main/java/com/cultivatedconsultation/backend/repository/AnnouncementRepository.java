package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("select a from Announcement a join fetch a.createdBy order by a.createdAt desc")
    List<Announcement> findAllWithCreatedByOrderByCreatedAtDesc();
}
