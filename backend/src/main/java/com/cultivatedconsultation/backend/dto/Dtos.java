package com.cultivatedconsultation.backend.dto;

import com.cultivatedconsultation.backend.model.Announcement;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.ConsultationGroup;
import com.cultivatedconsultation.backend.model.CredentialStatus;
import com.cultivatedconsultation.backend.model.GroupMembership;
import com.cultivatedconsultation.backend.model.GroupRole;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.Message;
import com.cultivatedconsultation.backend.model.Notification;
import com.cultivatedconsultation.backend.model.NotificationType;
import com.cultivatedconsultation.backend.model.Opportunity;
import com.cultivatedconsultation.backend.model.OpportunityType;
import com.cultivatedconsultation.backend.model.Post;
import com.cultivatedconsultation.backend.model.Reply;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
            String licenseNumber,
            String licenseState,
            CredentialStatus credentialStatus,
            MembershipStatus membershipStatus,
            boolean admin,
            boolean publicDirectoryOptIn
    ) {
        public static MeResponse from(AppUser u) {
            return new MeResponse(u.getId(), u.getEmail(), u.getName(), u.getBadge(), u.getBio(),
                    u.getSpecialties(), u.getLicenseNumber(), u.getLicenseState(), u.getCredentialStatus(),
                    u.getMembershipStatus(), u.isAdmin(), u.isPublicDirectoryOptIn());
        }
    }

    /** Own-profile edit. All fields optional/nullable — a user can update just one field at a time. */
    public record UpdateProfileRequest(
            @Size(max = 255) String badge,
            @Size(max = 1000) String bio,
            @Size(max = 500) String specialties,
            Boolean publicDirectoryOptIn
    ) {}

    /** Submits (or resubmits) a credential for admin review. Always moves status to PENDING_REVIEW. */
    public record SubmitCredentialRequest(
            @NotBlank @Size(max = 100) String licenseNumber,
            @NotBlank @Size(max = 50) String licenseState
    ) {}

    /** Read-only view of another approved member, for the directory/search screen. */
    public record MemberResponse(Long id, String name, String badge, String bio, String specialties, CredentialStatus credentialStatus) {
        public static MemberResponse from(AppUser u) {
            return new MemberResponse(u.getId(), u.getName(), u.getBadge(), u.getBio(), u.getSpecialties(), u.getCredentialStatus());
        }
    }

    public record CreatePostRequest(
            @NotBlank @Size(max = 4000) String content,
            boolean anonymous
    ) {}

    public record CreateGroupRequest(
            @NotBlank @Size(max = 255) String name,
            @Size(max = 1000) String description
    ) {}

    public record GroupResponse(Long id, String name, String description, Long createdById, Instant createdAt, int memberCount) {
        public static GroupResponse from(ConsultationGroup g, int memberCount) {
            return new GroupResponse(g.getId(), g.getName(), g.getDescription(), g.getCreatedBy().getId(), g.getCreatedAt(), memberCount);
        }
    }

    public record GroupMemberResponse(Long id, String name, String badge, CredentialStatus credentialStatus, GroupRole role) {
        public static GroupMemberResponse from(GroupMembership m) {
            return new GroupMemberResponse(m.getMember().getId(), m.getMember().getName(), m.getMember().getBadge(),
                    m.getMember().getCredentialStatus(), m.getRole());
        }
    }

    public record AddGroupMemberRequest(@NotNull Long memberId) {}

    public record CreateReplyRequest(
            @NotBlank @Size(max = 4000) String content
    ) {}

    public record AuthorSummary(Long id, String name, String badge, CredentialStatus credentialStatus) {
        public static AuthorSummary from(AppUser u) {
            return new AuthorSummary(u.getId(), u.getName(), u.getBadge(), u.getCredentialStatus());
        }

        /**
         * Masked view for an anonymous post shown to a regular member — no id,
         * no name, so there's nothing here a client could use to link back to
         * a profile. Badge and credential status stay, since "Anonymous
         * Independently Licensed Clinician" is the whole point per the brief.
         */
        public static AuthorSummary anonymous(String badge, CredentialStatus credentialStatus) {
            return new AuthorSummary(null, null, badge, credentialStatus);
        }
    }

    public record ReplyResponse(Long id, AuthorSummary author, String content, Instant createdAt) {
        public static ReplyResponse from(Reply r) {
            return new ReplyResponse(r.getId(), AuthorSummary.from(r.getAuthor()), r.getContent(), r.getCreatedAt());
        }
    }

    public record PostResponse(
            Long id, AuthorSummary author, String content, Instant createdAt, List<ReplyResponse> replies, boolean anonymous
    ) {
        /**
         * viewer decides whether an anonymous post's real author is revealed:
         * admins and the author themselves see it, everyone else sees the
         * masked AuthorSummary. Non-anonymous posts always reveal.
         */
        public static PostResponse from(Post p, AppUser viewer) {
            boolean revealIdentity = !p.isAnonymous() || viewer.isAdmin() || p.getAuthor().getId().equals(viewer.getId());
            AuthorSummary author = revealIdentity
                    ? AuthorSummary.from(p.getAuthor())
                    : AuthorSummary.anonymous(p.getAuthor().getBadge(), p.getAuthor().getCredentialStatus());
            return new PostResponse(
                    p.getId(),
                    author,
                    p.getContent(),
                    p.getCreatedAt(),
                    p.getReplies().stream().map(ReplyResponse::from).toList(),
                    p.isAnonymous()
            );
        }
    }

    public record SendMessageRequest(
            @NotNull Long recipientId,
            @NotBlank @Size(max = 4000) String content
    ) {}

    public record MessageResponse(Long id, Long senderId, Long recipientId, String content, Instant createdAt) {
        public static MessageResponse from(Message m) {
            return new MessageResponse(m.getId(), m.getSender().getId(), m.getRecipient().getId(), m.getContent(), m.getCreatedAt());
        }
    }

    /** One row in the conversation list — the other person, the last message, and how many are unread from them. */
    public record ConversationResponse(
            AuthorSummary counterpart, String lastMessage, Instant lastMessageAt, boolean lastMessageFromMe, long unreadCount
    ) {}

    public record NotificationResponse(
            Long id, NotificationType type, String message, String linkPath, Instant createdAt, boolean read
    ) {
        public static NotificationResponse from(Notification n) {
            return new NotificationResponse(n.getId(), n.getType(), n.getMessage(), n.getLinkPath(), n.getCreatedAt(), n.getReadAt() != null);
        }
    }

    public record UnreadCountResponse(long count) {}

    public record CreateAnnouncementRequest(
            @NotBlank @Size(max = 1000) String message
    ) {}

    public record AnnouncementResponse(Long id, String message, String createdByName, Instant createdAt) {
        public static AnnouncementResponse from(Announcement a) {
            return new AnnouncementResponse(a.getId(), a.getMessage(), a.getCreatedBy().getName(), a.getCreatedAt());
        }
    }

    public record CreateOpportunityRequest(
            @NotNull OpportunityType type,
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 2000) String description
    ) {}

    public record OpportunityResponse(
            Long id, OpportunityType type, String title, String description, AuthorSummary author, Instant createdAt
    ) {
        public static OpportunityResponse from(Opportunity o) {
            return new OpportunityResponse(o.getId(), o.getType(), o.getTitle(), o.getDescription(),
                    AuthorSummary.from(o.getAuthor()), o.getCreatedAt());
        }
    }

    /** Only the fields a member explicitly agreed to show to unauthenticated public visitors. */
    public record PublicMemberResponse(String name, String badge, String bio, String specialties, CredentialStatus credentialStatus) {
        public static PublicMemberResponse from(AppUser u) {
            return new PublicMemberResponse(u.getName(), u.getBadge(), u.getBio(), u.getSpecialties(), u.getCredentialStatus());
        }
    }

    /** Shape a browser's pushManager.subscribe() call returns — passed straight through. */
    public record PushSubscriptionRequest(
            @NotBlank String endpoint,
            @NotBlank String p256dhKey,
            @NotBlank String authKey
    ) {}

    public record UnsubscribePushRequest(@NotBlank String endpoint) {}
}
