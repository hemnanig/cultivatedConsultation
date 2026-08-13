package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.ConsultationGroup;
import com.cultivatedconsultation.backend.model.GroupMembership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMembershipRepository extends JpaRepository<GroupMembership, Long> {
    List<GroupMembership> findByMemberOrderByJoinedAtDesc(AppUser member);
    List<GroupMembership> findByGroupOrderByJoinedAtAsc(ConsultationGroup group);
    Optional<GroupMembership> findByGroupAndMember(ConsultationGroup group, AppUser member);
    boolean existsByGroupAndMember(ConsultationGroup group, AppUser member);
}
