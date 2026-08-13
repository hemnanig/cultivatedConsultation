package com.cultivatedconsultation.backend.repository;

import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.Post;
import com.cultivatedconsultation.backend.model.Reaction;
import com.cultivatedconsultation.backend.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByPostAndUser(Post post, AppUser user);
    Optional<Reaction> findByReplyAndUser(Reply reply, AppUser user);
    void deleteByPostAndUser(Post post, AppUser user);
    void deleteByReplyAndUser(Reply reply, AppUser user);
    List<Reaction> findByPost(Post post);
    List<Reaction> findByReply(Reply reply);
    List<Reaction> findByPostIn(Collection<Post> posts);
    List<Reaction> findByReplyIn(Collection<Reply> replies);
}
