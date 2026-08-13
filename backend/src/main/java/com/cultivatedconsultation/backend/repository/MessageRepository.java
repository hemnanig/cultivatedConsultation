package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("select m from Message m where (m.sender = :a and m.recipient = :b) or (m.sender = :b and m.recipient = :a) order by m.createdAt asc")
    List<Message> findThread(@Param("a") AppUser a, @Param("b") AppUser b);

    @Query("select m from Message m where m.sender = :me or m.recipient = :me order by m.createdAt desc")
    List<Message> findAllInvolving(@Param("me") AppUser me);

    List<Message> findByRecipientAndSenderAndReadAtIsNull(AppUser recipient, AppUser sender);
}
