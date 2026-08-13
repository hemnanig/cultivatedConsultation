package com.cultivatedconsultation.backend.controller;

import com.cultivatedconsultation.backend.dto.Dtos.*;
import com.cultivatedconsultation.backend.model.*;
import com.cultivatedconsultation.backend.repository.*;
import com.cultivatedconsultation.backend.security.CurrentUserService;
import com.cultivatedconsultation.backend.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Groups of Interest — private, selectively-invited group discussions. This is
 * the live site's actual dual-relationship safeguard: a clinician can create a
 * group and hand-pick exactly who's in it, so they can discuss a case with
 * peers of their choosing without exposing it to the whole community (e.g. a
 * former client who happens to also be a platform member). Group posts reuse
 * the same Post/Reply entities as the public feed — see Post.group (null
 * means public).
 */
@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final ConsultationGroupRepository groupRepository;
    private final GroupMembershipRepository membershipRepository;
    private final AppUserRepository appUserRepository;
    private final PostRepository postRepository;
    private final ReplyRepository replyRepository;
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public GroupController(ConsultationGroupRepository groupRepository,
                            GroupMembershipRepository membershipRepository,
                            AppUserRepository appUserRepository,
                            PostRepository postRepository,
                            ReplyRepository replyRepository,
                            CurrentUserService currentUserService,
                            NotificationService notificationService) {
        this.groupRepository = groupRepository;
        this.membershipRepository = membershipRepository;
        this.appUserRepository = appUserRepository;
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<GroupResponse> myGroups(Authentication authentication) {
        AppUser me = requireApproved(authentication);
        return membershipRepository.findByMemberOrderByJoinedAtDesc(me).stream()
                .map(m -> GroupResponse.from(m.getGroup(), memberCount(m.getGroup())))
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GroupResponse create(Authentication authentication, @Valid @RequestBody CreateGroupRequest request) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = new ConsultationGroup();
        group.setName(request.name());
        group.setDescription(request.description());
        group.setCreatedBy(me);
        group = groupRepository.save(group);

        GroupMembership membership = new GroupMembership();
        membership.setGroup(group);
        membership.setMember(me);
        membership.setRole(GroupRole.OWNER);
        membershipRepository.save(membership);

        return GroupResponse.from(group, 1);
    }

    @GetMapping("/{groupId}")
    public GroupResponse get(Authentication authentication, @PathVariable Long groupId) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = findGroup(groupId);
        requireMembership(me, group);
        return GroupResponse.from(group, memberCount(group));
    }

    @GetMapping("/{groupId}/members")
    public List<GroupMemberResponse> members(Authentication authentication, @PathVariable Long groupId) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = findGroup(groupId);
        requireMembership(me, group);
        return membershipRepository.findByGroupOrderByJoinedAtAsc(group).stream()
                .map(GroupMemberResponse::from)
                .toList();
    }

    @PostMapping("/{groupId}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public GroupMemberResponse addMember(Authentication authentication, @PathVariable Long groupId,
                                          @Valid @RequestBody AddGroupMemberRequest request) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = findGroup(groupId);
        GroupMembership requesterMembership = requireMembership(me, group);
        if (requesterMembership.getRole() != GroupRole.OWNER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the group owner can add members");
        }

        AppUser target = appUserRepository.findById(request.memberId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
        if (target.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can only add approved community members");
        }
        if (membershipRepository.existsByGroupAndMember(group, target)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already a member of this group");
        }

        GroupMembership membership = new GroupMembership();
        membership.setGroup(group);
        membership.setMember(target);
        membership.setRole(GroupRole.MEMBER);
        GroupMemberResponse response = GroupMemberResponse.from(membershipRepository.save(membership));

        notificationService.notify(target, NotificationType.GROUP_ADDED,
                "You were added to " + group.getName(), "/groups/" + group.getId());

        return response;
    }

    @DeleteMapping("/{groupId}/members/{memberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(Authentication authentication, @PathVariable Long groupId, @PathVariable Long memberId) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = findGroup(groupId);
        GroupMembership requesterMembership = requireMembership(me, group);

        boolean removingSelf = memberId.equals(me.getId());
        if (!removingSelf && requesterMembership.getRole() != GroupRole.OWNER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the group owner can remove other members");
        }
        if (removingSelf && requesterMembership.getRole() == GroupRole.OWNER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The group owner can't leave their own group");
        }

        AppUser target = appUserRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found"));
        GroupMembership toRemove = membershipRepository.findByGroupAndMember(group, target)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not a member of this group"));
        membershipRepository.delete(toRemove);
    }

    @GetMapping("/{groupId}/posts")
    public List<PostResponse> posts(Authentication authentication, @PathVariable Long groupId) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = findGroup(groupId);
        requireMembership(me, group);
        return postRepository.findByGroupWithAuthorOrderByCreatedAtDesc(group).stream()
                .map(PostResponse::from)
                .toList();
    }

    @PostMapping("/{groupId}/posts")
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(Authentication authentication, @PathVariable Long groupId,
                                    @Valid @RequestBody CreatePostRequest request) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = findGroup(groupId);
        requireMembership(me, group);

        Post post = new Post();
        post.setAuthor(me);
        post.setContent(request.content());
        post.setGroup(group);
        return PostResponse.from(postRepository.save(post));
    }

    @PostMapping("/{groupId}/posts/{postId}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    public ReplyResponse reply(Authentication authentication, @PathVariable Long groupId, @PathVariable Long postId,
                                @Valid @RequestBody CreateReplyRequest request) {
        AppUser me = requireApproved(authentication);
        ConsultationGroup group = findGroup(groupId);
        requireMembership(me, group);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        if (post.getGroup() == null || !post.getGroup().getId().equals(groupId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found in this group");
        }

        Reply reply = new Reply();
        reply.setPost(post);
        reply.setAuthor(me);
        reply.setContent(request.content());
        ReplyResponse response = ReplyResponse.from(replyRepository.save(reply));

        if (!post.getAuthor().getId().equals(me.getId())) {
            notificationService.notify(post.getAuthor(), NotificationType.NEW_REPLY,
                    me.getName() + " replied to your post in " + group.getName(), "/groups/" + group.getId());
        }

        return response;
    }

    private int memberCount(ConsultationGroup group) {
        return membershipRepository.findByGroupOrderByJoinedAtAsc(group).size();
    }

    private ConsultationGroup findGroup(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group not found"));
    }

    private GroupMembership requireMembership(AppUser me, ConsultationGroup group) {
        return membershipRepository.findByGroupAndMember(group, me)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a member of this group"));
    }

    private AppUser requireApproved(Authentication authentication) {
        AppUser user = currentUserService.resolve(authentication);
        if (user.getMembershipStatus() != MembershipStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is not approved yet");
        }
        return user;
    }
}
