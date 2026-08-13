package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.*;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.NotificationType;
import com.cultivatedconsultation.backend.model.Post;
import com.cultivatedconsultation.backend.model.Reply;
import com.cultivatedconsultation.backend.repository.PostRepository;
import com.cultivatedconsultation.backend.repository.ReplyRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import com.cultivatedconsultation.backend.service.NotificationService;
import com.cultivatedconsultation.backend.service.ReactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * Feature 2 of the POC: the consultation feed. Every endpoint here requires
 * APPROVED status — that's the whole point of the gate.
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;
    private final ReplyRepository replyRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;
    private final ReactionService reactionService;

    public PostController(PostRepository postRepository, ReplyRepository replyRepository,
                           CurrentUserService currentUserService, NotificationService notificationService,
                           ReactionService reactionService) {
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
        this.reactionService = reactionService;
    }

    @GetMapping
    public List<PostResponse> list(Authentication authentication) {
        AppUser me = requireApproved(authentication);
        return assemble(postRepository.findAllWithAuthorOrderByCreatedAtDesc(), me);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(Authentication authentication, @Valid @RequestBody CreatePostRequest request) {
        AppUser author = requireApproved(authentication);
        Post post = new Post();
        post.setAuthor(author);
        post.setContent(request.content());
        post.setAnonymous(request.anonymous());
        Post saved = postRepository.save(post);
        return PostResponse.from(saved, author, ReactionSummary.empty(), List.of());
    }

    @PostMapping("/{postId}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    public ReplyResponse reply(Authentication authentication, @PathVariable Long postId,
                                @Valid @RequestBody CreateReplyRequest request) {
        AppUser author = requireApproved(authentication);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        Reply reply = new Reply();
        reply.setPost(post);
        reply.setAuthor(author);
        reply.setContent(request.content());
        ReplyResponse response = ReplyResponse.from(replyRepository.save(reply), ReactionSummary.empty());

        if (!post.getAuthor().getId().equals(author.getId())) {
            notificationService.notify(post.getAuthor(), NotificationType.NEW_REPLY,
                    author.getName() + " replied to your post", "/");
        }

        return response;
    }

    // Shared with GroupController.posts()/createPost() — reactions are batched
    // in one query per feed page rather than one per post/reply.
    static List<PostResponse> assemble(List<Post> posts, AppUser me, ReactionService reactionService) {
        List<Reply> allReplies = posts.stream().flatMap(p -> p.getReplies().stream()).toList();
        Map<Long, ReactionSummary> postReactions = reactionService.summarizeForPosts(posts, me);
        Map<Long, ReactionSummary> replyReactions = reactionService.summarizeForReplies(allReplies, me);
        return posts.stream()
                .map(p -> {
                    List<ReplyResponse> replyResponses = p.getReplies().stream()
                            .map(r -> ReplyResponse.from(r, replyReactions.getOrDefault(r.getId(), ReactionSummary.empty())))
                            .toList();
                    return PostResponse.from(p, me, postReactions.getOrDefault(p.getId(), ReactionSummary.empty()), replyResponses);
                })
                .toList();
    }

    private List<PostResponse> assemble(List<Post> posts, AppUser me) {
        return assemble(posts, me, reactionService);
    }

    private AppUser requireApproved(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (user.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }
        return user;
    }
}
