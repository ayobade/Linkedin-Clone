import styled from "styled-components";
import { connect } from "react-redux";

const LeftSide = (props) => {
  return (
    <Container>
      <ProfileCard>
        <CardBackground />
        <ProfilePhoto src={props.user && props.user.photoURL && props.user.photoURL !== 'null' ? props.user.photoURL : "/images/user.svg"} alt="Profile" onError={(e)=>{e.currentTarget.src="/images/user.svg"}} />
        
        <ProfileName>
          {props.user && props.user.displayName
            ? props.user.displayName.trim().split(" ")[0] || "Hello"
            : "Hello"}
        </ProfileName>

        <UpdateProfile>Update Profile</UpdateProfile>
      </ProfileCard>

      <AnalyticsCard>
        <AnalyticsItem>
          <AnalyticsText>
            <span>Profile viewers</span>
            <span>View all analytics</span>
          </AnalyticsText>
          <AnalyticsNumber>0</AnalyticsNumber>
        </AnalyticsItem>
      </AnalyticsCard>

      <PremiumCard>
        <PremiumText>Access exclusive tools & insights</PremiumText>
        <PremiumOffer>
          <PremiumIcon>🔶</PremiumIcon>
          <PremiumOfferText>Try 1 month for USD 0</PremiumOfferText>
        </PremiumOffer>
      </PremiumCard>

      <NavigationCard>
        <NavItem>
          <NavIcon src="/images/item-icon.svg" alt="Saved items" />
          <NavText>Saved items</NavText>
        </NavItem>
        <NavItem>
          <NavIcon src="/images/nav-network.svg" alt="Groups" />
          <NavText>Groups</NavText>
        </NavItem>
        <NavItem>
          <NavIcon src="/images/feed-icon.svg" alt="Newsletters" />
          <NavText>Newsletters</NavText>
        </NavItem>
        <NavItem>
          <NavIcon src="/images/plus-icon.svg" alt="Events" />
          <NavText>Events</NavText>
        </NavItem>
      </NavigationCard>
    </Container>
  );
};

const Container = styled.div`
  grid-area: leftside;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  overflow: hidden;
`;

const ProfileCard = styled(Card)`
  text-align: center;
  position: relative;
`;

const CardBackground = styled.div`
  background: url("/images/card-bg.svg");
  background-size: cover;
  background-position: center;
  height: 60px;
  width: 100%;
`;

const ProfilePhoto = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid white;
  margin: -36px auto 8px;
  display: block;
`;

const ProfileName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 8px;
`;

const ProfileTitle = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 2px;
`;

const UpdateProfile = styled.div`
  font-size: 12px;
  color: #0a66c2;
  margin-bottom: 16px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const ProfileLocation = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
`;

const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 12px;
`;

const CompanyIcon = styled.span`
  font-size: 12px;
`;

const CompanyName = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

const AnalyticsCard = styled(Card)`
  padding: 16px;
`;

const AnalyticsItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AnalyticsText = styled.div`
  display: flex;
  flex-direction: column;

  span:first-child {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 1px;
  }

  span:last-child {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.9);
    font-weight: 600;
  }
`;

const AnalyticsNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0a66c2;
`;

const PremiumCard = styled(Card)`
  padding: 16px;
`;

const PremiumText = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 6px;
`;

const PremiumOffer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PremiumIcon = styled.span`
  font-size: 12px;
`;

const PremiumOfferText = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
`;

const NavigationCard = styled(Card)`
  padding: 8px 0;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const NavIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 12px;
`;

const NavText = styled.span`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
`;

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  };
};

export default connect(mapStateToProps)(LeftSide);
