package com.cultivatedconsultation.backend.dto;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.Post;
import com.cultivatedconsultation.backend.model.Reply;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

/**
 * All request/response shapes live here for now — split into separate files once
 * this grows past the POC's two features.
 */
public class Dtos {

    public record MeResponse(
            Long id,
            String email,
            String name,
            String badge,
            String bio,
            String specialties,
            MembershipStatus membershipStatus,
            boolean admin
    ) {
        public static MeResponse from(AppUser u) {
            return new MeResponse(u.getId(), u.getEmail(), u.getName(), u.getBadge(), u.getBio(),
                    u.getSpecialties(), u.getMembershipStatus(), u.isAdmin());
        }
    }

    /** Own-profile edit. All fields optional/nullable — a user can update just one field at a time. */
    public record UpdateProfileRequest(
            @Size(max = 255) String badge,
            @Size(max = 1000) String bio,
            @Size(max = 500) String specialties
    ) {}

    /** Read-only view of another approved member, for the directory/search screen. */
    public record MemberResponse(Long id, String name, String badge, String bio, String specialties) {
        public static MemberResponse from(AppUser u) {
            return new MemberResponse(u.getId(), u.getName(), u.getBadge(), u.getBio(), u.getSpecialties());
        }
    }

    public record CreatePostRequest(
            @NotBlank @Size(max = 4000) String content
    ) {}

    public record CreateReplyRequest(
            @NotBlank @Size(max = 4000) String content
    ) {}

    public record AuthorSummary(Long id, String name, String badge) {
        public static AuthorSummary from(AppUser u) {
            return new AuthorSummary(u.getId(), u.getName(), u.getBadge());
        }
    }

    public record ReplyResponse(Long id, AuthorSummary author, String content, Instant createdAt) {
        public static ReplyResponse from(Reply r) {
            return new ReplyResponse(r.getId(), AuthorSummary.from(r.getAuthor()), r.getContent(), r.getCreatedAt());
        }
    }

    public record PostResponse(
            Long id, AuthorSummary author, String content, Instant createdAt, List<ReplyResponse> replies
    ) {
        public static PostResponse from(Post p) {
            return new PostResponse(
                    p.getId(),
                    AuthorSummary.from(p.getAuthor()),
                    p.getContent(),
                    p.getCreatedAt(),
                    p.getReplies().stream().map(ReplyResponse::from).toList()
            );
        }
    }
}
