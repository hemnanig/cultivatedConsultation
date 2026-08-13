package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.ReactRequest;
import com.cultivatedconsultation.backend.dto.Dtos.ReactionSummary;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.ConsultationGroup;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.Post;
import com.cultivatedconsultation.backend.model.Reply;
import com.cultivatedconsultation.backend.repository.GroupMembershipRepository;
import com.cultivatedconsultation.backend.repository.PostRepository;
import com.cultivatedconsultation.backend.repository.ReplyRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import com.cultivatedconsultation.backend.service.ReactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Reactions on posts and replies — one emoji reaction per user per target.
 * Not nested under /api/posts or /api/groups because Post/Reply ids are
 * globally unique and shared by both the public feed and Groups of
 * Interest (see Post.group); a group post's replies just get an extra
 * membership check before the reaction is recorded.
 */
@RestController
public class ReactionController {

    private final PostRepository postRepository;
    private final ReplyRepository replyRepository;
    private final GroupMembershipRepository membershipRepository;
    private final CurrentUserService currentUserService;
    private final ReactionService reactionService;

    public ReactionController(PostRepository postRepository, ReplyRepository replyRepository,
                               GroupMembershipRepository membershipRepository, CurrentUserService currentUserService,
                               ReactionService reactionService) {
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
        this.membershipRepository = membershipRepository;
        this.currentUserService = currentUserService;
        this.reactionService = reactionService;
    }

    @PutMapping("/api/posts/{postId}/reaction")
    public ReactionSummary reactToPost(Authentication authentication, @PathVariable Long postId,
                                        @Valid @RequestBody ReactRequest request) {
        AppUser me = requireApproved(authentication);
        Post post = findPost(postId);
        requireGroupAccess(post.getGroup(), me);
        return reactionService.setPostReaction(post, me, request.type());
    }

    @DeleteMapping("/api/posts/{postId}/reaction")
    public ReactionSummary unreactToPost(Authentication authentication, @PathVariable Long postId) {
        AppUser me = requireApproved(authentication);
        Post post = findPost(postId);
        requireGroupAccess(post.getGroup(), me);
        return reactionService.clearPostReaction(post, me);
    }

    @PutMapping("/api/replies/{replyId}/reaction")
    public ReactionSummary reactToReply(Authentication authentication, @PathVariable Long replyId,
                                         @Valid @RequestBody ReactRequest request) {
        AppUser me = requireApproved(authentication);
        Reply reply = findReply(replyId);
        requireGroupAccess(reply.getPost().getGroup(), me);
        return reactionService.setReplyReaction(reply, me, request.type());
    }

    @DeleteMapping("/api/replies/{replyId}/reaction")
    public ReactionSummary unreactToReply(Authentication authentication, @PathVariable Long replyId) {
        AppUser me = requireApproved(authentication);
        Reply reply = findReply(replyId);
        requireGroupAccess(reply.getPost().getGroup(), me);
        return reactionService.clearReplyReaction(reply, me);
    }

    private Post findPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
    }

    private Reply findReply(Long replyId) {
        return replyRepository.findById(replyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reply not found"));
    }

    // null group = public feed, open to every approved member. Non-null means
    // this post/reply belongs to a Group of Interest, so only its members may react.
    private void requireGroupAccess(ConsultationGroup group, AppUser me) {
        if (group != null && !membershipRepository.existsByGroupAndMember(group, me)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a member of this group");
        }
    }

    private AppUser requireApproved(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (user.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }
        return user;
    }
}
