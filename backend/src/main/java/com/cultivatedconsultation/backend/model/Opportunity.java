package com.cultivatedconsultation.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Job postings, research-participant recruitment, and supervision/training
 * offers — deliberately kept out of the main consultation feed (see brief
 * section 3.6) so clinical discussion isn't crowded out by advertising.
 * No replies/threads here; anyone interested uses the existing direct-message
 * feature to contact the poster.
 */
@Entity
@Table(name = "opportunity")
@Getter
@Setter
@NoArgsConstructor
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private AppUser author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OpportunityType type;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
