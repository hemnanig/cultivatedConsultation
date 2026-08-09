package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
}
