package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.ConsultationGroup;
import com.cultivatedconsultation.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // group is null here on purpose: this is the public community feed only,
    // now that Post can also be scoped to a Group of Interest.
    @Query("select p from Post p join fetch p.author where p.group is null order by p.createdAt desc")
    List<Post> findAllWithAuthorOrderByCreatedAtDesc();

    @Query("select p from Post p join fetch p.author where p.group = :group order by p.createdAt desc")
    List<Post> findByGroupWithAuthorOrderByCreatedAtDesc(@Param("group") ConsultationGroup group);
}
