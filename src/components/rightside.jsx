import styled from "styled-components";

const Rightside = () => {
    return (
        <Container>
            <PuzzleCard>
                <PuzzleTitle>Today's puzzle</PuzzleTitle>
                <PuzzleContent>
                    <PuzzleImage src="/images/feed-icon.svg" alt="Puzzle" />
                    <PuzzleInfo>
                        <PuzzleName>Zip - a quick brain teaser</PuzzleName>
                        <PuzzleTime>Solve in 60s or less!</PuzzleTime>
                        <PuzzleStats>10 connections played</PuzzleStats>
                    </PuzzleInfo>
                    <PuzzleArrow src="/images/right-icon.svg" alt="Play" />
                </PuzzleContent>
            </PuzzleCard>

            <FeedCard>
                <FeedHeader>
                    <FeedTitle>Add to your feed</FeedTitle>
                    <InfoIcon>i</InfoIcon>
                </FeedHeader>
                
                <FeedItem>
                    <CompanyLogo src="/images/feed-icon.svg" alt="OpenAI" />
                    <CompanyInfo>
                        <CompanyName>OpenAI</CompanyName>
                        <CompanyDesc>Company • Research Services</CompanyDesc>
                    </CompanyInfo>
                    <FollowBtn>Follow</FollowBtn>
                </FeedItem>

                <FeedItem>
                    <ProfileImg src="/images/user.svg" alt="Kingsley Orji" />
                    <CompanyInfo>
                        <CompanyName>Kingsley Orji</CompanyName>
                        <CompanyDesc>Senior Product Designer</CompanyDesc>
                    </CompanyInfo>
                    <FollowBtn>Follow</FollowBtn>
                </FeedItem>

                <FeedItem>
                    <CompanyLogo src="/images/feed-icon.svg" alt="Meta" />
                    <CompanyInfo>
                        <CompanyName>Meta</CompanyName>
                        <CompanyDesc>Company • Software Development</CompanyDesc>
                    </CompanyInfo>
                    <FollowBtn>Follow</FollowBtn>
                </FeedItem>

                <ViewAllLink>
                    View all recommendations
                    <ArrowIcon src="/images/right-icon.svg" alt="Arrow" />
                </ViewAllLink>
            </FeedCard>

            <PremiumAdCard>
                <AdLabel>Ad</AdLabel>
                <AdTitle>Ayobade, unlock your full potential with LinkedIn Premium</AdTitle>
                <AdProfile>
                    <AdProfileImg src="/images/user.svg" alt="Profile" />
                    <PremiumBadge>Premium</PremiumBadge>
                </AdProfile>
                <AdBenefit>See who's viewed your profile in the last 365 days</AdBenefit>
                <TryFreeBtn>Try for Free</TryFreeBtn>
            </PremiumAdCard>

            <WindowsAppCard>
                <TipBadge>TIP</TipBadge>
                <AppText>Try LinkedIn on the Windows App</AppText>
            </WindowsAppCard>

            <FooterLinks>
                <FooterRow>
                    <FooterLink>About</FooterLink>
                    <FooterLink>Accessibility</FooterLink>
                    <FooterLink>Help Center</FooterLink>
                </FooterRow>
                <FooterRow>
                    <FooterLink>Privacy & Terms</FooterLink>
                    <FooterLink>Ad Choices</FooterLink>
                </FooterRow>
                <FooterRow>
                    <FooterLink>Advertising</FooterLink>
                    <FooterLink>Business Services</FooterLink>
                </FooterRow>
                <FooterRow>
                    <FooterLink>Get the LinkedIn app</FooterLink>
                    <FooterLink>More</FooterLink>
                </FooterRow>
                <FooterBottom>
                    <LinkedInLogo>
                        <LogoIcon src="/images/home-logo.svg" alt="LinkedIn" />
                        <LogoText>LinkedIn</LogoText>
                    </LinkedInLogo>
                    <Copyright>LinkedIn Corporation © 2025</Copyright>
                </FooterBottom>
            </FooterLinks>
        </Container>
    )
}

const Container = styled.div`
    grid-area: rightside;
`;

const Card = styled.div`
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
    overflow: hidden;
`;

const PuzzleCard = styled(Card)`
    padding: 16px;
`;

const PuzzleTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 12px;
`;

const PuzzleContent = styled.div`
    display: flex;
    align-items: center;
    background-color: #f3f2ef;
    padding: 12px;
    border-radius: 6px;
`;

const PuzzleImage = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 12px;
`;

const PuzzleInfo = styled.div`
    flex: 1;
`;

const PuzzleName = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 2px;
`;

const PuzzleTime = styled.div`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 2px;
`;

const PuzzleStats = styled.div`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

const PuzzleArrow = styled.img`
    width: 16px;
    height: 16px;
`;

const FeedCard = styled(Card)`
    padding: 16px;
`;

const FeedHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const FeedTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
`;

const InfoIcon = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
`;

const FeedItem = styled.div`
    display: flex;
    align-items: center;
    padding: 12px 0;
    
    &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }
`;

const CompanyLogo = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-right: 12px;
`;

const ProfileImg = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
`;

const CompanyInfo = styled.div`
    flex: 1;
`;

const CompanyName = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 2px;
`;

const CompanyDesc = styled.div`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

const FollowBtn = styled.button`
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 16px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
    
    &::before {
        content: "+";
        font-size: 16px;
        font-weight: 600;
    }
`;

const ViewAllLink = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    cursor: pointer;
`;

const ArrowIcon = styled.img`
    width: 16px;
    height: 16px;
`;

const PremiumAdCard = styled(Card)`
    padding: 16px;
    position: relative;
`;

const AdLabel = styled.div`
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    gap: 4px;
    
    &::after {
        content: "⋯";
        font-size: 12px;
    }
`;

const AdTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 12px;
`;

const AdProfile = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const AdProfileImg = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
`;

const PremiumBadge = styled.div`
    background-color: #ff6b35;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
`;

const AdBenefit = styled.div`
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 12px;
`;

const TryFreeBtn = styled.button`
    background: white;
    border: 1px solid #0a66c2;
    border-radius: 16px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #0a66c2;
    cursor: pointer;
    
    &:hover {
        background-color: rgba(10, 102, 194, 0.04);
    }
`;

const WindowsAppCard = styled(Card)`
    padding: 12px 16px;
    display: flex;
    align-items: center;
`;

const TipBadge = styled.div`
    background-color: #ff6b35;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 8px;
`;

const AppText = styled.div`
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
`;

const FooterLinks = styled.div`
    padding: 16px 0;
    text-align: center;
`;

const FooterRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 4px;
`;

const FooterLink = styled.a`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    text-decoration: none;
    margin-right: 16px;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 2px;
    
    &:hover {
        color: #0a66c2;
    }
    
    &:nth-child(4)::after {
        content: "▼";
        font-size: 10px;
    }
    
    &:nth-child(7)::after {
        content: "▼";
        font-size: 10px;
    }
`;

const FooterBottom = styled.div`
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    text-align: center;
`;

const LinkedInLogo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
`;

const LogoIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 4px;
`;

const LogoText = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
`;

const Copyright = styled.div`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

export default Rightside;