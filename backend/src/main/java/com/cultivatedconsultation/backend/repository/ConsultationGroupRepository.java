package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.ConsultationGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationGroupRepository extends JpaRepository<ConsultationGroup, Long> {
}
