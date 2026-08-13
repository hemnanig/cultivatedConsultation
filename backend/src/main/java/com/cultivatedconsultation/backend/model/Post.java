package com.cultivatedconsultation.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "post")
@Getter
@Setter
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private AppUser author;

    // null = public community feed. Non-null = scoped to that Group of Interest,
    // only visible/postable by its members.
    @ManyToOne
    @JoinColumn(name = "group_id")
    private ConsultationGroup group;

    @Column(nullable = false, length = 4000)
    private String content;

    // Public-feed-only (see PostController) — hides the author's identity from
    // everyone except the author themselves and admins. Replies are never
    // anonymous, per the product brief.
    @Column(nullable = false)
    private boolean anonymous = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reply> replies = new ArrayList<>();
}
