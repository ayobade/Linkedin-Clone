import styled from "styled-components";
import { useState, useRef } from "react";
import { connect } from "react-redux";
import { postArticleAPI } from "../actions";

const PostModal = ({ isOpen, onClose, user, postArticle, loading }) => {
    const [postContent, setPostContent] = useState("");
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleOpenFilePicker = () => !loading && fileInputRef.current && fileInputRef.current.click();

    const handleFilesSelected = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const newUrls = files.map((f) => ({ url: URL.createObjectURL(f), file: f }));
        setImages((prev) => [...prev, ...newUrls]);
        e.target.value = "";
    };

    const handleRemoveImage = (idx) => {
        if (loading) return;
        setImages((prev) => {
            const copy = [...prev];
            const [removed] = copy.splice(idx, 1);
            try { removed && removed.url && URL.revokeObjectURL(removed.url); } catch {}
            return copy;
        });
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (loading) return;
        const files = images.map((i) => i.file).filter(Boolean);
        await postArticle({
            files,
            description: postContent.trim(),
            user,
        });
        setPostContent("");
        setImages((prev) => {
            prev.forEach((i) => { try { i.url && URL.revokeObjectURL(i.url); } catch {} });
            return [];
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                {loading && (
                    <SpinnerOverlay>
                        <Spinner />
                    </SpinnerOverlay>
                )}
                <ModalHeader>
                    <CloseBtn onClick={onClose} disabled={loading}>×</CloseBtn>
                </ModalHeader>
                
                <UserSection>
                    
                    <UserProfileImg src={user && user.photoURL && user.photoURL !== 'null' ? user.photoURL : "/images/user.svg"} alt="Profile" onError={(e)=>{e.currentTarget.src="/images/user.svg"}} />
                    <UserInfo>
                        <UserName>
                            {user && user.displayName ? (user.displayName.trim().split(" ")[0] || "Hello") : "Hello"}
                            <UserDropdown>▼</UserDropdown>
                        </UserName>
                        <PostVisibility>
                            Post to Anyone
                            <VisibilityDropdown>▼</VisibilityDropdown>
                        </PostVisibility>
                    </UserInfo>
                </UserSection>

                <PostInputArea>
                    <PostTextarea
                        placeholder="What do you want to talk about?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        disabled={loading}
                    />
                    <EmojiBtn disabled={loading}>😊</EmojiBtn>
                </PostInputArea>

                {images.length > 0 && (
                    <Gallery>
                        {images.map((img, idx) => (
                            <Thumb key={img.url}>
                                <ThumbImg src={img.url} alt={`upload-${idx}`} />
                                <RemoveThumb onClick={() => handleRemoveImage(idx)} disabled={loading}>×</RemoveThumb>
                            </Thumb>
                        ))}
                    </Gallery>
                )}

                <ActionBar>
                    <LeftActions>
                        <RewriteBtn disabled={loading}>
                            ✨ Rewrite with AI
                        </RewriteBtn>
                        <MediaIcons>
                            <MediaIcon onClick={handleOpenFilePicker} disabled={loading}>📷</MediaIcon>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFilesSelected}
                                style={{ display: "none" }}
                            />
                            <MediaIcon $hideOnMobile disabled={loading}>📅</MediaIcon>
                            <MediaIcon $hideOnMobile disabled={loading}>⚙️</MediaIcon>
                            
                        </MediaIcons>
                    </LeftActions>
                    
                    <RightActions>
                        <ScheduleIcon disabled={loading}>🕐</ScheduleIcon>
                        <PostBtn disabled={loading || (!postContent.trim() && images.length === 0)} onClick={handlePost}>
                            {loading ? "Posting..." : "Post"}
                        </PostBtn>
                    </RightActions>
                </ActionBar>
            </Modal>
        </Overlay>
    );
};

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
`;

const Modal = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 552px;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
`;

const SpinnerOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
`;

const Spinner = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(10, 102, 194, 0.2);
    border-top-color: #0a66c2;
    animation: spin 0.8s linear infinite;

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px 20px 0;
`;

const CloseBtn = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const UserSection = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 0 20px 16px;
    gap: 12px;
`;

const UserProfileImg = styled.img`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
`;

const UserInfo = styled.div`
    flex: 1;
`;

const UserName = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
`;

const UserDropdown = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
`;

const PostVisibility = styled.div`
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
`;

const VisibilityDropdown = styled.span`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

const PostInputArea = styled.div`
    position: relative;
    padding: 0 20px 16px;
`;

const PostTextarea = styled.textarea`
    width: 100%;
    min-height: 120px;
    border: none;
    outline: none;
    font-size: 16px;
    font-family: inherit;
    resize: none;
    padding: 0;
    color: rgba(0, 0, 0, 0.9);
    
    &::placeholder {
        color: rgba(0, 0, 0, 0.6);
    }

    &:disabled {
        background: transparent;
        color: rgba(0, 0, 0, 0.5);
    }
`;

const EmojiBtn = styled.button`
    position: absolute;
    bottom: 8px;
    left: 20px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const Gallery = styled.div`
    padding: 0 20px 12px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
`;

const Thumb = styled.div`
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: #f3f2ef;
`;

const ThumbImg = styled.img`
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
`;

const RemoveThumb = styled.button`
    position: absolute;
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e53935;
    color: #fff;
    border: none;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

const LeftActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const RewriteBtn = styled.button`
    background: rgba(0, 0, 0, 0.04);
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &:hover {
        background: rgba(0, 0, 0, 0.08);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const MediaIcons = styled.div`
    display: flex;
    gap: 12px;
`;

const MediaIcon = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 768px) {
        display: ${props => props.$hideOnMobile ? 'none' : 'inline-flex'};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const RightActions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const ScheduleIcon = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const PostBtn = styled.button`
    background: ${props => props.disabled ? 'rgba(0, 0, 0, 0.2)' : '#0a66c2'};
    color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.4)' : 'white'};
    border: none;
    border-radius: 24px;
    padding: 8px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    
    &:hover {
        background: ${props => props.disabled ? 'rgba(0, 0, 0, 0.2)' : '#004182'};
    }
`;

const mapStateToProps = (state) => {
    return {
        user: state.userState.user,
        loading: state.articleState.loading,
    };
};

const mapDispatchToProps = (dispatch) => ({
    postArticle: (payload) => dispatch(postArticleAPI(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
