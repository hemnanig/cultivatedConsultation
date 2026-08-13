package com.cultivatedconsultation.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Google's stable subject identifier — this, not email, is the true unique key for the account.
    @Column(name = "google_sub", nullable = false, unique = true)
    private String googleSub;

    @Column(nullable = false)
    private String email;

    private String name;

    // Free-text for the POC. Real credential-verified badges come later per the product brief.
    private String badge;

    // Free-text bio shown on the member's profile.
    @Column(length = 1000)
    private String bio;

    // Comma-separated specialty/interest tags (e.g. "Perinatal Mental Health, Trauma, EMDR").
    // A proper normalized tag table is overkill for the POC's directory search.
    @Column(length = 500)
    private String specialties;

    @Enumerated(EnumType.STRING)
    @Column(name = "membership_status", nullable = false)
    private MembershipStatus membershipStatus = MembershipStatus.PENDING;

    @Column(name = "is_admin", nullable = false)
    private boolean admin = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
