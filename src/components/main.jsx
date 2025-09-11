import styled from "styled-components";
import { useState, useEffect } from "react";
import db from "../firebase";
import PostModal from "./PostModal";
import { connect } from "react-redux";
import { fetchPostsAPI, updatePostReactionAPI, deletePostAPI, addCommentAPI, toggleCommentLikeAPI, deleteCommentAPI, addReplyAPI } from "../actions";

const Main = (props) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Recent");
    const [showHiringCard, setShowHiringCard] = useState(true);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [openCommentId, setOpenCommentId] = useState(null);
    const [commentTextById, setCommentTextById] = useState({});
    const [commentsById, setCommentsById] = useState({});
    const [repliesById, setRepliesById] = useState({});
    const [openReplyId, setOpenReplyId] = useState(null);
    const [replyTextById, setReplyTextById] = useState({});

    const loadComments = async (postId) => {
        try {
            const snap = await db.collection("posts").doc(postId).collection("comments").orderBy("timestamp", "asc").get();
            const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setCommentsById((prev) => ({ ...prev, [postId]: items }));
            
            for (const comment of items) {
                const repliesSnap = await db.collection("posts").doc(postId).collection("comments").doc(comment.id).collection("replies").orderBy("timestamp", "asc").get();
                const replies = repliesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
                setRepliesById((prev) => ({ ...prev, [`${postId}-${comment.id}`]: replies }));
            }
        } catch (err) { console.error(err); }
    };

    const formatTimeAgo = (ts) => {
        try {
            let ms = 0;
            if (!ts) return "now";
            if (typeof ts.toMillis === "function") {
                ms = ts.toMillis();
            } else if (ts.seconds) {
                ms = ts.seconds * 1000;
            } else if (ts instanceof Date) {
                ms = ts.getTime();
            } else {
                return "now";
            }
            const diff = Date.now() - ms;
            if (diff < 60000) return "now";
            const minutes = Math.floor(diff / 60000);
            if (minutes < 60) return `${minutes}m`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h`;
            const days = Math.floor(hours / 24);
            if (days < 7) return `${days}d`;
            const weeks = Math.floor(days / 7);
            if (weeks < 4) return `${weeks}w`;
            const months = Math.floor(days / 30);
            if (months < 12) return `${months}mo`;
            const years = Math.floor(days / 365);
            return `${years}y`;
        } catch {
            return "now";
        }
    };

    useEffect(() => {
        if (props.fetchPosts) props.fetchPosts("Recent");
    }, [props.fetchPosts]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!menuOpenId) return;
            const menuEl = document.getElementById(`post-menu-${menuOpenId}`);
            const triggerEl = document.getElementById(`post-menu-trigger-${menuOpenId}`);
            const target = e.target;
            if (menuEl && triggerEl) {
                if (!menuEl.contains(target) && !triggerEl.contains(target)) {
                    setMenuOpenId(null);
                }
            } else {
                setMenuOpenId(null);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuOpenId]);


    return (
        <Container>
            {showHiringCard && (
                <HiringCard>
                    <CloseBtn onClick={() => setShowHiringCard(false)}>×</CloseBtn>
                    <HiringProfile>
                        <ProfileContainer>
                            <HiringProfileImg src={props.user && props.user.photoURL && props.user.photoURL !== 'null' ? props.user.photoURL : "/images/user.svg"} alt="Profile" onError={(e)=>{e.currentTarget.src="/images/user.svg"}} />
                            <HiringBadge>#HIRING</HiringBadge>
                        </ProfileContainer>
                    </HiringProfile>
                    <HiringTitle>Hi {props.user && props.user.displayName ? props.user.displayName.trim().split(" ")[0] || "there" : "there"}, are you hiring?</HiringTitle>
                    <HiringDesc>Discover free and easy ways to find a great hire, fast.</HiringDesc>
                    <HiringActions>
                        <HiringBtn $primary onClick={() => setShowHiringCard(false)}>Yes, I'm hiring</HiringBtn>
                        <HiringBtn onClick={() => setShowHiringCard(false)}>No, not right now</HiringBtn>
                    </HiringActions>
                </HiringCard>
            )}

            <StartPostCard>
                <PostHeader>
                    <ProfileImg src={props.user && props.user.photoURL && props.user.photoURL !== 'null' ? props.user.photoURL : "/images/user.svg"} alt="Profile" onError={(e)=>{e.currentTarget.src="/images/user.svg"}} />
                    <PostInput 
                        placeholder="Start a post" 
                        onClick={() => setIsPostModalOpen(true)}
                        readOnly
                    />
                </PostHeader>
                <PostActions>
                    <ActionBtn>
                        <StartIconWrapper $bg="#2e7d32">
                            <StartIcon src="/images/video-svgrepo-com.svg" alt="Video" />
                        </StartIconWrapper>
                        <ActionText>Video</ActionText>
                    </ActionBtn>
                    <ActionBtn>
                        <StartIconWrapper $bg="#1976d2">
                            <StartIcon src="/images/photo-svgrepo-com.svg" alt="Photo" />
                        </StartIconWrapper>
                        <ActionText>Photo</ActionText>
                    </ActionBtn>
                    <ActionBtn>
                        <StartIconWrapper $bg="#e86d48">
                            <StartIcon src="/images/journal-svgrepo-com.svg" alt="Write article" />
                        </StartIconWrapper>
                        <ActionText>Write article</ActionText>
                    </ActionBtn>
                </PostActions>
            </StartPostCard>

            <SortSection>
                <SortLine />
                <SortBy onClick={() => setIsSortOpen(!isSortOpen)}>
                    <SortLabel>Sort by:</SortLabel>
                    <SortValue>{selectedSort}</SortValue>
                    <SortArrow>▼</SortArrow>
                </SortBy>
                {isSortOpen && (
                    <SortDropdown>
                        <SortOption 
                            active={selectedSort === "Top"}
                            onClick={() => {
                                setSelectedSort("Top");
                                if (props.fetchPosts) props.fetchPosts("Top");
                                setIsSortOpen(false);
                            }}
                        >
                            Top
                        </SortOption>
                        <SortOption 
                            active={selectedSort === "Recent"}
                            onClick={() => {
                                setSelectedSort("Recent");
                                if (props.fetchPosts) props.fetchPosts("Recent");
                                setIsSortOpen(false);
                            }}
                        >
                            Recent
                        </SortOption>
                    </SortDropdown>
                )}
            </SortSection>

            <PostModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
            />
            {Array.isArray(props.posts) && props.posts.length === 0 && (
                <div style={{ color: 'rgba(0,0,0,0.6)', fontSize: 14, padding: 8 }}>No posts yet</div>
            )}
            {Array.isArray(props.posts) && props.posts.length > 0 && props.posts.map((post) => (
                <FeedPostCard key={post.id}>
                    <PostCardHeader>
                        <PostAuthorInfo>
                            <PostAuthorImg src={post.user?.photoURL || "/images/user.svg"} alt={post.user?.displayName || "User"} />
                            <AuthorDetails>
                                <AuthorName>{post.user?.displayName || "User"}</AuthorName>
                                <AuthorTitle>{post.user?.email || ""}</AuthorTitle>
                                <PostMeta>
                                    <PostTime>{formatTimeAgo(post.timestamp)}</PostTime>
                                    <GlobeIcon>🌐</GlobeIcon>
                                    <ConnectionBadge>• 1st</ConnectionBadge>
                                </PostMeta>
                            </AuthorDetails>
                        </PostAuthorInfo>
                        <PostOptions>
                            {(props.user && post.user && props.user.uid === post.user.uid) && (
                                <MoreBtn id={`post-menu-trigger-${post.id}`} onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === post.id ? null : post.id); }}>⋯</MoreBtn>
                            )}
                            {menuOpenId === post.id && (props.user && post.user && props.user.uid === post.user.uid) && (
                                <PostMenu id={`post-menu-${post.id}`} onClick={(e) => e.stopPropagation()}>
                                    <MenuItemButton onClick={() => props.deletePost(post.id, props.user, selectedSort)}>Delete</MenuItemButton>
                                </PostMenu>
                            )}
                        </PostOptions>
                    </PostCardHeader>

                    <PostContent>
                        <PostText>{post.description}</PostText>
                    </PostContent>

                    {(post.imageUrl || (post.imageUrls && post.imageUrls.length > 0)) && (
                        <PostImage>
                            {post.imageUrls && post.imageUrls.length > 1 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                                    {post.imageUrls.map((u) => (
                                        <img key={u} src={u} alt="Post" style={{ width: '100%', borderRadius: 8, maxHeight: 240, objectFit: 'cover' }} />
                                    ))}
                                </div>
                            ) : (
                                <img src={post.imageUrl || post.imageUrls[0]} alt="Post" />
                            )}
                        </PostImage>
                    )}

                    <PostStats>
                        <Reactions>
                            <ReactionImg src="https://static-exp1.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb" alt="Like" />
                            <ReactionImg src="https://static-exp1.licdn.com/sc/h/5thsbmikm6a8uov24ygwd914f" alt="Celebrate" />
                            <ReactionCount>{typeof post.likesCount === 'number' ? post.likesCount : 0}</ReactionCount>
                        </Reactions>
                        <PostEngagement>
                            <EngagementText>{typeof post.commentsCount === 'number' ? post.commentsCount : 0} comments</EngagementText>
                            <EngagementDot>·</EngagementDot>
                            <EngagementText>{typeof post.repostCount === 'number' ? post.repostCount : 0} reposts</EngagementText>
                        </PostEngagement>
                    </PostStats>
                    <FeedPostActions>
                        <FeedPostActionBtn onClick={() => props.reactToPost(post.id, 'like', props.user, selectedSort)} $active={Array.isArray(post.likedBy) && props.user && post.likedBy.includes(props.user.uid)}>
                            <ActionSvg src="/images/thumb-up-svgrepo-com.svg" alt="Like" $active={Array.isArray(post.likedBy) && props.user && post.likedBy.includes(props.user.uid)} />
                        </FeedPostActionBtn>
                        <FeedPostActionBtn onClick={() => { const next = openCommentId === post.id ? null : post.id; setOpenCommentId(next); if (next) loadComments(post.id); }}>
                            <ActionSvg src="/images/comment-2-svgrepo-com.svg" alt="Comment" />
                        </FeedPostActionBtn>
                        <FeedPostActionBtn onClick={() => props.reactToPost(post.id, 'repost', props.user, selectedSort)} $repostActive={Array.isArray(post.repostedBy) && props.user && post.repostedBy.includes(props.user.uid)}>
                            <ActionSvg src="/images/repost-round-svgrepo-com.svg" alt="Repost" $repostActive={Array.isArray(post.repostedBy) && props.user && post.repostedBy.includes(props.user.uid)} />
                        </FeedPostActionBtn>
                        <FeedPostActionBtn>
                            <ActionSvg src="/images/send-email-svgrepo-com.svg" alt="Send" />
                        </FeedPostActionBtn>
                    </FeedPostActions>

                    {openCommentId === post.id && (
                        <CommentArea>
                            <CommentRow>
                                <CommentAvatar src={props.user && props.user.photoURL && props.user.photoURL !== 'null' ? props.user.photoURL : "/images/user.svg"} alt="Me" onError={(e)=>{e.currentTarget.src="/images/user.svg"}} />
                                <CommentInputWrapper>
                                    <CommentInput 
                                        placeholder="Add a comment..."
                                        value={commentTextById[post.id] || ""}
                                        onChange={(e) => setCommentTextById({ ...commentTextById, [post.id]: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && (commentTextById[post.id] || '').trim()) {
                                                props.addComment(post.id, props.user, commentTextById[post.id], selectedSort);
                                                setCommentTextById({ ...commentTextById, [post.id]: "" });
                                            }
                                        }}
                                    />
                                    <CommentRight>
                                        <CommentIcon role="img" aria-label="emoji">🙂</CommentIcon>
                                        <CommentIcon>
                                            <img src="/images/photo.svg" alt="Attach" />
                                        </CommentIcon>
                                        <CommentPostBtn 
                                            disabled={!((commentTextById[post.id] || '').trim())}
                                            onClick={() => {
                                                if ((commentTextById[post.id] || '').trim()) {
                                                    props.addComment(post.id, props.user, commentTextById[post.id], selectedSort);
                                                    setCommentTextById({ ...commentTextById, [post.id]: "" });
                                                    loadComments(post.id);
                                                }
                                            }}
                                        >Post</CommentPostBtn>
                                    </CommentRight>
                                </CommentInputWrapper>
                            </CommentRow>

                            {Array.isArray(commentsById[post.id]) && commentsById[post.id].length > 0 && (
                                <CommentsList>
                                    {commentsById[post.id].map((c) => (
                                        <CommentItem key={c.id}>
                                            <CommentAvatar src={c.user?.photoURL || "/images/user.svg"} alt={c.user?.displayName || ""} />
                                            <CommentBubble>
                                                <CommentHeader>
                                                    <CommentName>{c.user?.displayName || "User"}</CommentName>
                                                    <CommentTime>{formatTimeAgo(c.timestamp)}</CommentTime>
                                                </CommentHeader>
                                                <CommentTextRow>
                                                    <CommentText>{c.text}</CommentText>
                                                    {(props.user && c.user && props.user.uid === c.user.uid) && (
                                                        <SmallMenuWrap>
                                                            <SmallMenuTrigger onClick={(e) => { e.stopPropagation(); setMenuOpenId(`c-${c.id}`); }}>⋯</SmallMenuTrigger>
                                                            {menuOpenId === `c-${c.id}` && (
                                                                <SmallMenu onClick={(e) => e.stopPropagation()}>
                                                                    <MenuItemButton onClick={() => { props.deleteComment(post.id, c.id, props.user); setMenuOpenId(null); loadComments(post.id); }}>Delete</MenuItemButton>
                                                                </SmallMenu>
                                                            )}
                                                        </SmallMenuWrap>
                                                    )}
                                                </CommentTextRow>
                                                <CommentActionsRow>
                                                    <CommentActionBtn onClick={() => { props.toggleCommentLike(post.id, c.id, props.user); setTimeout(() => loadComments(post.id), 200); }} $active={Array.isArray(c.likedBy) && props.user && c.likedBy.includes(props.user.uid)}>
                                                        Like {typeof c.likesCount === 'number' ? c.likesCount : 0}
                                                    </CommentActionBtn>
                                                    <CommentActionBtn onClick={() => setOpenReplyId(openReplyId === c.id ? null : c.id)}>
                                                        Reply
                                                    </CommentActionBtn>
                                                </CommentActionsRow>
                                                
                                                {openReplyId === c.id && (
                                                    <ReplyArea>
                                                        <ReplyInputWrapper>
                                                            <ReplyRow>
                                                                <ReplyInput
                                                                    placeholder="Write a reply..."
                                                                    value={replyTextById[c.id] || ""}
                                                                    onChange={(e) => setReplyTextById({ ...replyTextById, [c.id]: e.target.value })}
                                                                />
                                                                <ReplyRight>
                                                                    <ReplyPostBtn
                                                                        onClick={() => {
                                                                            if (replyTextById[c.id]?.trim()) {
                                                                                props.addReply(post.id, c.id, props.user, replyTextById[c.id]);
                                                                                setReplyTextById({ ...replyTextById, [c.id]: "" });
                                                                                setOpenReplyId(null);
                                                                                setTimeout(() => loadComments(post.id), 500);
                                                                            }
                                                                        }}
                                                                        disabled={!replyTextById[c.id]?.trim()}
                                                                    >Reply</ReplyPostBtn>
                                                                </ReplyRight>
                                                            </ReplyRow>
                                                        </ReplyInputWrapper>
                                                    </ReplyArea>
                                                )}
                                                
                                                {Array.isArray(repliesById[`${post.id}-${c.id}`]) && repliesById[`${post.id}-${c.id}`].length > 0 && (
                                                    <RepliesList>
                                                        {repliesById[`${post.id}-${c.id}`].map((reply) => (
                                                            <ReplyItem key={reply.id}>
                                                                <ReplyAvatar src={reply.user?.photoURL || "/images/user.svg"} alt={reply.user?.displayName || ""} />
                                                                <ReplyBubble>
                                                                    <ReplyHeader>
                                                                        <ReplyName>{reply.user?.displayName || "User"}</ReplyName>
                                                                        <ReplyTime>{formatTimeAgo(reply.timestamp)}</ReplyTime>
                                                                    </ReplyHeader>
                                                                    <ReplyText>{reply.text}</ReplyText>
                                                                    <ReplyActionsRow>
                                                                        <ReplyActionBtn onClick={() => { props.toggleCommentLike(post.id, reply.id, props.user); setTimeout(() => loadComments(post.id), 200); }} $active={Array.isArray(reply.likedBy) && props.user && reply.likedBy.includes(props.user.uid)}>
                                                                            Like {typeof reply.likesCount === 'number' ? reply.likesCount : 0}
                                                                        </ReplyActionBtn>
                                                                        <ReplyActionBtn onClick={() => setOpenReplyId(openReplyId === `reply-${reply.id}` ? null : `reply-${reply.id}`)}>
                                                                            Reply
                                                                        </ReplyActionBtn>
                                                                    </ReplyActionsRow>
                                                                    
                                                                    {openReplyId === `reply-${reply.id}` && (
                                                                        <NestedReplyArea>
                                                                            <NestedReplyInputWrapper>
                                                                                <NestedReplyRow>
                                                                                    <NestedReplyInput
                                                                                        placeholder="Write a reply..."
                                                                                        value={replyTextById[`reply-${reply.id}`] || ""}
                                                                                        onChange={(e) => setReplyTextById({ ...replyTextById, [`reply-${reply.id}`]: e.target.value })}
                                                                                    />
                                                                                    <NestedReplyRight>
                                                                                        <NestedReplyPostBtn
                                                                                            onClick={() => {
                                                                                                if (replyTextById[`reply-${reply.id}`]?.trim()) {
                                                                                                    props.addReply(post.id, c.id, props.user, replyTextById[`reply-${reply.id}`]);
                                                                                                    setReplyTextById({ ...replyTextById, [`reply-${reply.id}`]: "" });
                                                                                                    setOpenReplyId(null);
                                                                                                    setTimeout(() => loadComments(post.id), 500);
                                                                                                }
                                                                                            }}
                                                                                            disabled={!replyTextById[`reply-${reply.id}`]?.trim()}
                                                                                        >Reply</NestedReplyPostBtn>
                                                                                    </NestedReplyRight>
                                                                                </NestedReplyRow>
                                                                            </NestedReplyInputWrapper>
                                                                        </NestedReplyArea>
                                                                    )}
                                                                </ReplyBubble>
                                                            </ReplyItem>
                                                        ))}
                                                    </RepliesList>
                                                )}
                                            </CommentBubble>
                                        </CommentItem>
                                    ))}
                                    <HideCommentsRow>
                                        <HideCommentsBtn onClick={() => setOpenCommentId(null)}>Hide comments</HideCommentsBtn>
                                    </HideCommentsRow>
                                </CommentsList>
                            )}
                        </CommentArea>
                    )}
                </FeedPostCard>
            ))}

            <FeedPostCard>
                <PostCardHeader>
                    <PostAuthorInfo>
                        <PostAuthorImg src="/images/user.svg" alt="Emmanuel Michael" />
                        <AuthorDetails>
                            <AuthorName>Emmanuel Michael, C...</AuthorName>
                            <AuthorTitle>Design @ Multigate | Ex-Nomba</AuthorTitle>
                            <PostMeta>
                                <PostTime>5d</PostTime>
                                <GlobeIcon>🌐</GlobeIcon>
                                <ConnectionBadge>• 1st</ConnectionBadge>
                            </PostMeta>
                        </AuthorDetails>
                    </PostAuthorInfo>
                    <PostOptions></PostOptions>
                </PostCardHeader>

                <PostContent>
                    <PostText>
                        Improving Delivery Experience: A UX Concept for Smoother Deliveries on <PostLink>Chowdeck</PostLink> ...more
                    </PostText>
                </PostContent>

                <PostImage>
                    <img src="/images/lets-scoot.jpg" alt="Mobile App Interface" />
                </PostImage>

                <PostStats>
                    <Reactions>
                        <ReactionImg src="https://static-exp1.licdn.com/sc/h/d310t2g24pvdy4pt1jkedo4yb" alt="Like" />
                        <ReactionImg src="https://static-exp1.licdn.com/sc/h/5thsbmikm6a8uov24ygwd914f" alt="Celebrate" />
                        <ReactionCount>597</ReactionCount>
                    </Reactions>
                    <PostEngagement>
                        <EngagementText>8 comments</EngagementText>
                        <EngagementDot>·</EngagementDot>
                        <EngagementText>3 reposts</EngagementText>
                    </PostEngagement>
                </PostStats>
                <FeedPostActions>
                    <FeedPostActionBtn>
                        <ActionSvg src="/images/thumb-up-svgrepo-com.svg" alt="Like" />
                    </FeedPostActionBtn>
                    <FeedPostActionBtn>
                        <ActionSvg src="/images/comment-2-svgrepo-com.svg" alt="Comment" />
                    </FeedPostActionBtn>
                    <FeedPostActionBtn>
                        <ActionSvg src="/images/repost-round-svgrepo-com.svg" alt="Repost" />
                    </FeedPostActionBtn>
                    <FeedPostActionBtn>
                        <ActionSvg src="/images/send-email-svgrepo-com.svg" alt="Send" />
                    </FeedPostActionBtn>
                </FeedPostActions>
            </FeedPostCard>
        </Container>
    );
};

const Container = styled.div`
    grid-area: main;
`;

const Card = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
    overflow: hidden;
`;

const StartPostCard = styled(Card)`
    padding: 16px;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`;

const ProfileImg = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 12px;
`;

const PostInput = styled.input`
    flex: 1;
    background-color: #f3f2ef;
    border: 1px solid transparent;
    border-radius: 24px;
    padding: 12px 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    outline: none;
    cursor: pointer;
    
    &:hover {
        background-color: #e9e5df;
    }
    
    &:focus {
        background-color: white;
        border-color: #0a66c2;
    }
    
    &::placeholder {
        color: rgba(0, 0, 0, 0.6);
    }
`;

const PostActions = styled.div`
    display: flex;
    justify-content: space-around;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const ActionBtn = styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
`;

const ActionIcon = styled.span`
    font-size: 20px;
    margin-right: 8px;
`;

const ActionText = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.6);
`;

const StartIconWrapper = styled.span`
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background-color: ${props => props.$bg || '#e9e5df'};
    margin-right: 8px;
`;

const StartIcon = styled.img`
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
    opacity: 0.95;
`;

const HiringCard = styled(Card)`
    padding: 24px;
    text-align: center;
    position: relative;
`;

const CloseBtn = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        border-radius: 50%;
    }
`;

const HiringProfile = styled.div`
    margin-bottom: 16px;
`;

const ProfileContainer = styled.div`
    position: relative;
    display: inline-block;
`;

const HiringProfileImg = styled.img`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid #8f5849;
`;

const HiringBadge = styled.div`
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #0a66c2;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
    white-space: nowrap;
`;

const HiringTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 8px;
`;

const HiringDesc = styled.p`
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 24px;
`;

const HiringActions = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
`;

const HiringBtn = styled.button`
    flex: 1;
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #0a66c2;
    
    ${props => props.$primary ? `
        background-color: #0a66c2;
        color: white;
        
        &:hover {
            background-color: #004182;
        }
    ` : `
        background-color: white;
        color: #0a66c2;
        
        &:hover {
            background-color: rgba(10, 102, 194, 0.04);
        }
    `}
`;

const SortSection = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    position: relative;
`;

const SortLine = styled.div`
    flex: 1;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.15);
    margin-right: 16px;
`;

const SortBy = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
`;

const SortLabel = styled.span`
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
`;

const SortValue = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
`;

const SortArrow = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

const SortDropdown = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 120px;
    z-index: 1000;
    margin-top: 4px;
    overflow: hidden;
`;

const SortOption = styled.div`
    padding: 12px 16px;
    font-size: 14px;
    cursor: pointer;
    
    ${props => props.active ? `
        font-weight: 600;
        color: rgba(0, 0, 0, 0.9);
        background-color: rgba(0, 0, 0, 0.04);
    ` : `
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
    `}
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
`;

const FeedPostCard = styled(Card)`
    padding: 16px;
`;

const PostCardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;

const PostAuthorInfo = styled.div`
    display: flex;
    align-items: flex-start;
`;

const PostAuthorImg = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 12px;
`;

const AuthorDetails = styled.div`
    flex: 1;
`;

const AuthorName = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 2px;
`;

const AuthorTitle = styled.div`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
`;

const PostMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const PostTime = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

const GlobeIcon = styled.span`
    font-size: 12px;
`;

const ConnectionBadge = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

const PostOptions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
`;

const PostMenu = styled.div`
    position: absolute;
    top: 24px;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 8px 0;
    z-index: 10;
`;

const MenuItemButton = styled.button`
    display: block;
    width: 100%;
    padding: 10px 16px;
    background: none;
    border: none;
    text-align: left;
    font-size: 14px;
    cursor: pointer;
    color: rgba(0,0,0,0.8);

    &:hover { background: rgba(0,0,0,0.04); }
`;

const MenuItemDisabled = styled.div`
    padding: 10px 16px;
    font-size: 14px;
    color: rgba(0,0,0,0.4);
`;

const MoreBtn = styled.button`
    background: none;
    border: none;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    padding: 4px;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        border-radius: 50%;
    }
`;

const PostContent = styled.div`
    margin-bottom: 12px;
`;

const PostText = styled.div`
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 1.4;
`;

const PostLink = styled.span`
    color: #0a66c2;
    font-weight: 600;
`;

const PostImage = styled.div`
    margin-bottom: 12px;
    
    img {
        width: 100%;
        border-radius: 8px;
        max-height: 400px;
        object-fit: cover;
    }
`;

const PostStats = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const Reactions = styled.div`
    display: flex;
    align-items: center;
`;

const ReactionImg = styled.img`
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #fff;
    object-fit: cover;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.08);

    &:not(:first-child) {
        margin-left: -6px;
    }
`;

const ReactionCount = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 8px;
`;

const PostEngagement = styled.div`
    display: flex;
    align-items: center;
`;

const EngagementText = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

const EngagementDot = styled.span`
    margin: 0 6px;
    color: rgba(0,0,0,0.6);
`;

const FeedPostActions = styled.div`
    display: flex;
    justify-content: space-around;
    padding-top: 8px;
`;

const FeedPostActionBtn = styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
`;

const ActionSvg = styled.img`
    width: 22px;
    height: 22px;
    opacity: 0.95;
    filter: ${props => props.$active ? 'invert(31%) sepia(92%) saturate(1118%) hue-rotate(187deg) brightness(89%) contrast(99%)' : props.$repostActive ? 'invert(23%) sepia(98%) saturate(3783%) hue-rotate(350deg) brightness(95%) contrast(94%)' : 'none'};
`;

const CommentArea = styled.div`
    padding-top: 10px;
`;

const CommentRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
`;

const CommentAvatar = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
`;

const CommentInputWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 20px;
    padding: 6px 8px 6px 12px;
`;

const CommentInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: rgba(0,0,0,0.9);
    background: transparent;
`;

const CommentRight = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    img { width: 18px; height: 18px; opacity: 0.75; }
`;

const CommentIcon = styled.span`
    font-size: 16px;
    color: rgba(0,0,0,0.7);
`;

const CommentPostBtn = styled.button`
    background: #0a66c2;
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;

    &:disabled {
        background: rgba(0,0,0,0.15);
        color: rgba(0,0,0,0.5);
        cursor: not-allowed;
    }
`;

const CommentsList = styled.div`
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const CommentItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
`;

const CommentBubble = styled.div`
    background: #f2f2f2;
    border-radius: 12px;
    padding: 8px 10px;
    max-width: 100%;
    width: 100%;
`;

const CommentHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
`;

const CommentName = styled.span`
    font-weight: 600;
    font-size: 12px;
    color: rgba(0,0,0,0.9);
`;

const CommentTime = styled.span`
    font-size: 11px;
    color: rgba(0,0,0,0.6);
`;

const CommentText = styled.div`
    font-size: 13px;
    color: rgba(0,0,0,0.9);
    line-height: 1.3;
`;

const CommentTextRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
`;

const SmallMenuWrap = styled.div`
    position: relative;
`;

const SmallMenuTrigger = styled.button`
    background: none;
    border: none;
    font-size: 14px;
    color: rgba(0,0,0,0.6);
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;

    &:hover { background: rgba(0,0,0,0.06); }
`;

const SmallMenu = styled.div`
    position: absolute;
    top: 18px;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 20;
`;

const ReplyArea = styled.div`
    margin-top: 8px;
`;

const ReplyInputWrapper = styled.div`
    background: white;
    border-radius: 8px;
    padding: 8px;
    border: 1px solid #e0e0e0;
`;

const ReplyRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 8px;
`;

const ReplyInput = styled.textarea`
    flex: 1;
    border: none;
    outline: none;
    resize: none;
    font-size: 13px;
    line-height: 1.3;
    min-height: 32px;
    max-height: 80px;
    font-family: inherit;
`;

const ReplyRight = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const ReplyPostBtn = styled.button`
    background: #0a66c2;
    color: white;
    border: none;
    border-radius: 16px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const RepliesList = styled.div`
    margin-top: 8px;
    padding-left: 16px;
    border-left: 2px solid #e0e0e0;
`;

const ReplyItem = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
`;

const ReplyAvatar = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
`;

const ReplyBubble = styled.div`
    background: #f8f8f8;
    border-radius: 12px;
    padding: 6px 8px;
    max-width: 100%;
    width: 100%;
`;

const ReplyHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
`;

const ReplyName = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: rgba(0,0,0,0.9);
`;

const ReplyTime = styled.span`
    font-size: 11px;
    color: rgba(0,0,0,0.6);
`;

const ReplyText = styled.div`
    font-size: 12px;
    color: rgba(0,0,0,0.9);
    line-height: 1.3;
`;

const ReplyActionsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
`;

const ReplyActionBtn = styled.button`
    background: none;
    border: none;
    font-size: 11px;
    color: rgba(0,0,0,0.6);
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    
    &:hover { background: rgba(0,0,0,0.06); }
    
    ${props => props.$active && `
        color: #0a66c2;
        font-weight: 600;
    `}
`;

const NestedReplyArea = styled.div`
    margin-top: 6px;
`;

const NestedReplyInputWrapper = styled.div`
    background: white;
    border-radius: 6px;
    padding: 6px;
    border: 1px solid #e0e0e0;
`;

const NestedReplyRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 6px;
`;

const NestedReplyInput = styled.textarea`
    flex: 1;
    border: none;
    outline: none;
    resize: none;
    font-size: 12px;
    line-height: 1.3;
    min-height: 28px;
    max-height: 70px;
    font-family: inherit;
`;

const NestedReplyRight = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const NestedReplyPostBtn = styled.button`
    background: #0a66c2;
    color: white;
    border: none;
    border-radius: 14px;
    padding: 4px 12px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    
    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

const HideCommentsRow = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 8px;
`;

const HideCommentsBtn = styled.button`
    background: none;
    border: none;
    color: #0a66c2;
    font-weight: 600;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 4px;
    font-size: 12px;
    
    &:hover { background: rgba(10,102,194,0.08); }
`;

const CommentActionsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
`;

const CommentActionBtn = styled.button`
    background: none;
    border: none;
    font-size: 12px;
    color: ${props => props.$active ? '#0a66c2' : 'rgba(0,0,0,0.6)'};
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;

    &:hover { background: rgba(0,0,0,0.04); }
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        posts: state.articleState.posts,
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchPosts: (sort) => dispatch(fetchPostsAPI(sort)),
    reactToPost: (postId, reaction, user, sort) => dispatch(updatePostReactionAPI(postId, user, reaction, sort)),
    deletePost: (postId, user, sort) => dispatch(deletePostAPI(postId, user, sort)),
    addComment: (postId, user, text, sort) => dispatch(addCommentAPI(postId, user, text, sort)),
    toggleCommentLike: (postId, commentId, user) => dispatch(toggleCommentLikeAPI(postId, commentId, user)),
    deleteComment: (postId, commentId, user) => dispatch(deleteCommentAPI(postId, commentId, user)),
    addReply: (postId, commentId, user, text) => dispatch(addReplyAPI(postId, commentId, user, text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);



