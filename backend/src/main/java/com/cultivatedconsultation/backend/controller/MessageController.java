package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.*;
import com.cultivatedconsultation.backend.model.AppUser;
import com.cultivatedconsultation.backend.model.MembershipStatus;
import com.cultivatedconsultation.backend.model.Message;
import com.cultivatedconsultation.backend.model.NotificationType;
import com.cultivatedconsultation.backend.repository.AppUserRepository;
import com.cultivatedconsultation.backend.repository.MessageRepository;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import com.cultivatedconsultation.backend.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 1:1 direct messaging between approved community members. Conversations
 * aren't a stored entity — they're derived on the fly from the Message rows
 * involving the current user, grouped by counterpart. Fine at POC scale;
 * worth a real Conversation table once message volume grows.
 */
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final AppUserRepository appUserRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public MessageController(MessageRepository messageRepository, AppUserRepository appUserRepository,
                              CurrentUserService currentUserService, NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.appUserRepository = appUserRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @GetMapping("/conversations")
    public List<ConversationResponse> conversations(Authentication authentication) {
        AppUser me = requireApproved(authentication);
        List<Message> all = messageRepository.findAllInvolving(me);

        // findAllInvolving is already newest-first, so the first message we see
        // for a given counterpart is that conversation's most recent message.
        Map<Long, ConversationBuilder> byCounterpart = new LinkedHashMap<>();
        for (Message m : all) {
            boolean fromMe = m.getSender().getId().equals(me.getId());
            AppUser counterpart = fromMe ? m.getRecipient() : m.getSender();
            ConversationBuilder builder = byCounterpart.computeIfAbsent(counterpart.getId(), id -> new ConversationBuilder(counterpart));
            if (builder.lastMessage == null) {
                builder.lastMessage = m.getContent();
                builder.lastMessageAt = m.getCreatedAt();
                builder.lastMessageFromMe = fromMe;
            }
            if (!fromMe && m.getReadAt() == null) {
                builder.unreadCount++;
            }
        }

        return byCounterpart.values().stream()
                .map(b -> new ConversationResponse(AuthorSummary.from(b.counterpart), b.lastMessage, b.lastMessageAt, b.lastMessageFromMe, b.unreadCount))
                .toList();
    }

    @GetMapping("/with/{userId}")
    public List<MessageResponse> thread(Authentication authentication, @PathVariable Long userId) {
        AppUser me = requireApproved(authentication);
        AppUser other = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));

        // Opening the thread marks anything they sent us as read.
        List<Message> unread = messageRepository.findByRecipientAndSenderAndReadAtIsNull(me, other);
        if (!unread.isEmpty()) {
            Instant now = Instant.now();
            unread.forEach(m -> m.setReadAt(now));
            messageRepository.saveAll(unread);
        }

        return messageRepository.findThread(me, other).stream()
                .map(MessageResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponse send(Authentication authentication, @Valid @RequestBody SendMessageRequest request) {
        AppUser me = requireApproved(authentication);
        if (request.recipientId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can't message yourself");
        }
        AppUser recipient = appUserRepository.findById(request.recipientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
        if (recipient.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can only message approved community members");
        }

        Message message = new Message();
        message.setSender(me);
        message.setRecipient(recipient);
        message.setContent(request.content());
        MessageResponse response = MessageResponse.from(messageRepository.save(message));

        notificationService.notify(recipient, NotificationType.NEW_MESSAGE,
                "New message from " + me.getName(), "/messages/" + me.getId());

        return response;
    }

    private AppUser requireApproved(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (user.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }
        return user;
    }

    private static class ConversationBuilder {
        final AppUser counterpart;
        String lastMessage;
        Instant lastMessageAt;
        boolean lastMessageFromMe;
        long unreadCount;

        ConversationBuilder(AppUser counterpart) {
            this.counterpart = counterpart;
        }
    }
}
