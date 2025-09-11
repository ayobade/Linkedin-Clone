import styled from "styled-components";
import { useState, useEffect } from "react";
import PostModal from "./PostModal";
import { connect } from "react-redux";
import { fetchPostsAPI, updatePostReactionAPI } from "../actions";

const Main = (props) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState("Recent");
    const [showHiringCard, setShowHiringCard] = useState(true);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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
                            <MoreBtn>⋯</MoreBtn>
                            <CloseBtn>×</CloseBtn>
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
                        <FeedPostActionBtn>
                            <ActionSvg src="/images/comment-2-svgrepo-com.svg" alt="Comment" />
                        </FeedPostActionBtn>
                        <FeedPostActionBtn onClick={() => props.reactToPost(post.id, 'repost', props.user, selectedSort)} $repostActive={Array.isArray(post.repostedBy) && props.user && post.repostedBy.includes(props.user.uid)}>
                            <ActionSvg src="/images/repost-round-svgrepo-com.svg" alt="Repost" $repostActive={Array.isArray(post.repostedBy) && props.user && post.repostedBy.includes(props.user.uid)} />
                        </FeedPostActionBtn>
                        <FeedPostActionBtn>
                            <ActionSvg src="/images/send-email-svgrepo-com.svg" alt="Send" />
                        </FeedPostActionBtn>
                    </FeedPostActions>
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
                    <PostOptions>
                        <MoreBtn>⋯</MoreBtn>
                        <CloseBtn>×</CloseBtn>
                    </PostOptions>
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

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        posts: state.articleState.posts,
    };
};

const mapDispatchToProps = (dispatch) => ({
    fetchPosts: (sort) => dispatch(fetchPostsAPI(sort)),
    reactToPost: (postId, reaction, user, sort) => dispatch(updatePostReactionAPI(postId, user, reaction, sort)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);



