package com.cultivatedconsultation.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * "Groups of Interest" — a private, selectively-invited discussion group.
 * This is the live site's actual dual-relationship safeguard: a clinician
 * hand-picks exactly who's in a group, so they can discuss a case with peers
 * of their choosing without exposing it to the whole community (e.g. a
 * former client who also happens to be a platform member).
 */
@Entity
@Table(name = "consultation_group")
@Getter
@Setter
@NoArgsConstructor
public class ConsultationGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 1000)
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private AppUser createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
