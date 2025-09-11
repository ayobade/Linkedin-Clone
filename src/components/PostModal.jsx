import styled from "styled-components";
import { useState } from "react";
import { connect } from "react-redux";

const PostModal = ({ isOpen, onClose, user }) => {
    const [postContent, setPostContent] = useState("");

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <CloseBtn onClick={onClose}>×</CloseBtn>
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
                    />
                    <EmojiBtn>😊</EmojiBtn>
                </PostInputArea>

                <ActionBar>
                    <LeftActions>
                        <RewriteBtn>
                            ✨ Rewrite with AI
                        </RewriteBtn>
                        <MediaIcons>
                            <MediaIcon>📷</MediaIcon>
                            <MediaIcon>📅</MediaIcon>
                            <MediaIcon>⚙️</MediaIcon>
                            <MediaIcon>➕</MediaIcon>
                        </MediaIcons>
                    </LeftActions>
                    
                    <RightActions>
                        <ScheduleIcon>🕐</ScheduleIcon>
                        <PostBtn disabled={!postContent.trim()}>
                            Post
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
    };
};

export default connect(mapStateToProps)(PostModal);
