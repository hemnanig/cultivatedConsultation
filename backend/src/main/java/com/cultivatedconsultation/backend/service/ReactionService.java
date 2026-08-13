package com.cultivatedconsultation.backend.service;

import com.cultivatedconsultation.backend.dto.Dtos.ReactionSummary;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.Post;
import com.cultivatedconsultation.backend.model.Reaction;
import com.cultivatedconsultation.backend.model.ReactionType;
import com.cultivatedconsultation.backend.model.Reply;
import com.cultivatedconsultation.backend.repository.ReactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Reaction read/write logic shared by PostController, GroupController (feed
 * assembly — reactions never differ between the public feed and group posts,
 * they reuse the same Post/Reply entities) and ReactionController (the
 * mutating endpoints).
 */
@Service
public class ReactionService {

    private final ReactionRepository reactionRepository;

    public ReactionService(ReactionRepository reactionRepository) {
        this.reactionRepository = reactionRepository;
    }

    /** Batch summary for a feed page — one query for every post instead of one per post. */
    public Map<Long, ReactionSummary> summarizeForPosts(List<Post> posts, AppUser viewer) {
        if (posts.isEmpty()) return Map.of();
        Map<Long, List<Reaction>> byPost = reactionRepository.findByPostIn(posts).stream()
                .collect(Collectors.groupingBy(r -> r.getPost().getId()));
        return posts.stream().collect(Collectors.toMap(
                Post::getId,
                p -> ReactionSummary.from(byPost.getOrDefault(p.getId(), List.of()), viewer)));
    }

    /** Batch summary for every reply across a feed page. */
    public Map<Long, ReactionSummary> summarizeForReplies(List<Reply> replies, AppUser viewer) {
        if (replies.isEmpty()) return Map.of();
        Map<Long, List<Reaction>> byReply = reactionRepository.findByReplyIn(replies).stream()
                .collect(Collectors.groupingBy(r -> r.getReply().getId()));
        return replies.stream().collect(Collectors.toMap(
                Reply::getId,
                r -> ReactionSummary.from(byReply.getOrDefault(r.getId(), List.of()), viewer)));
    }

    @Transactional
    public ReactionSummary setPostReaction(Post post, AppUser user, ReactionType type) {
        Reaction reaction = reactionRepository.findByPostAndUser(post, user).orElseGet(Reaction::new);
        reaction.setPost(post);
        reaction.setReply(null);
        reaction.setUser(user);
        reaction.setType(type);
        reactionRepository.save(reaction);
        return ReactionSummary.from(reactionRepository.findByPost(post), user);
    }

    @Transactional
    public ReactionSummary clearPostReaction(Post post, AppUser user) {
        reactionRepository.deleteByPostAndUser(post, user);
        return ReactionSummary.from(reactionRepository.findByPost(post), user);
    }

    @Transactional
    public ReactionSummary setReplyReaction(Reply reply, AppUser user, ReactionType type) {
        Reaction reaction = reactionRepository.findByReplyAndUser(reply, user).orElseGet(Reaction::new);
        reaction.setReply(reply);
        reaction.setPost(null);
        reaction.setUser(user);
        reaction.setType(type);
        reactionRepository.save(reaction);
        return ReactionSummary.from(reactionRepository.findByReply(reply), user);
    }

    @Transactional
    public ReactionSummary clearReplyReaction(Reply reply, AppUser user) {
        reactionRepository.deleteByReplyAndUser(reply, user);
        return ReactionSummary.from(reactionRepository.findByReply(reply), user);
    }
}
