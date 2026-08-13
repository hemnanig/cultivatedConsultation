package com.cultivatedconsultation.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * A single user's reaction to either a Post or a Reply — exactly one of
 * `post`/`reply` is set (enforced by a DB check constraint), never both.
 * One reaction per user per target, enforced by unique constraints on
 * (post_id, user_id) and (reply_id, user_id) — setting a new type overwrites
 * the existing row rather than adding another.
 */
@Entity
@Table(name = "reaction")
@Getter
@Setter
@NoArgsConstructor
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "reply_id")
    private Reply reply;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReactionType type;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
