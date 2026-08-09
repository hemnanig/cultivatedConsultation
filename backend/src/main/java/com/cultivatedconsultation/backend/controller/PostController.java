package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.*;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.Post;
import com.cultivatedconsultation.backend.model.Reply;
import com.cultivatedconsultation.backend.repository.PostRepository;
import com.cultivatedconsultation.backend.repository.ReplyRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

    public PostController(PostRepository postRepository, ReplyRepository replyRepository,
                           CurrentUserService currentUserService) {
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<PostResponse> list(Authentication authentication) {
        requireApproved(authentication);
        return postRepository.findAllWithAuthorOrderByCreatedAtDesc().stream()
                .map(PostResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(Authentication authentication, @Valid @RequestBody CreatePostRequest request) {
        AppUser author = requireApproved(authentication);
        Post post = new Post();
        post.setAuthor(author);
        post.setContent(request.content());
        return PostResponse.from(postRepository.save(post));
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
        return ReplyResponse.from(replyRepository.save(reply));
    }

    private AppUser requireApproved(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (user.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }
        return user;
    }
}
