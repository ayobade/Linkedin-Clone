import styled from "styled-components";

const Header = () => {
  return (
    <Container>
      <Content>
        <Logo>
          <a href="/home">
            <img src="/images/home-logo.svg" alt="" />
          </a>
        </Logo>
        <Search>
          <div>
            <SearchIcon>
              <img src="/images/search-icon.svg" alt="Search" />
            </SearchIcon>
            <input type="text" placeholder="Search" />
          </div>
        </Search>
        <Nav>
          <NavListWrap>
            <NavList className="active">
                <a>
                    <img src="/images/nav-home.svg" alt="Home" />
                    <span>Home</span>
                </a>
            </NavList>

            <NavList>
                <a>
                    <img src="/images/nav-network.svg" alt="Home" />
                    <span>My Network</span>
                </a>
            </NavList>

            <NavList>
                <a>
                    <img src="/images/nav-jobs.svg" alt="Home" />
                    <span>Jobs</span>
                </a>
            </NavList>

            <NavList>
                <a>
                    <img src="/images/nav-messaging.svg" alt="Home" />
                    <span>Messaging</span>
                </a>
            </NavList>

            <NavList>
                <a>
                    <img src="/images/nav-notifications.svg" alt="Home" />
                    <span>Notifications</span>
                </a>
            </NavList>

            <User>
              <a>
                <img src="/images/user.svg" alt="User" />
                <span>Me <img className="drop" src="/images/down-icon.svg" alt="Arrow Down" /></span>
              </a>

            
            </User>

            <Work>
              <a>
                <img src="/images/nav-work.svg" alt="Work" />
                <span>Work <img className="drop" src="/images/down-icon.svg" alt="Arrow Down" /></span>
              </a>
            </Work>

          </NavListWrap>
        </Nav>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  left: 0;
  padding: 0 24px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  height: 52px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-height: 100%;
  max-width: 1128px;
`;

const Logo = styled.span`
  margin-right: auto;
  font-size: 0px;
`;

const Search = styled.div`
  opacity: 1;
  position: relative;
  flex-grow: 1;
  max-width: 280px;
  
  & > div {
    position: relative;
    width: 100%;
  }
  
  input {
    border: 1px solid #dce6f1;
    box-shadow: none;
    background-color:rgb(255, 255, 255);
    border-radius: 32px;
    color: rgba(0, 0, 0, 0.9);
    width: 100%;
    padding: 0 8px 0 40px;
    line-height: 1.75;
    font-size: 14px;
    font-weight: 400;
    height: 34px;
    vertical-align: text-top;
    outline: none;
    
    &:focus {
    border: 2px solid rgb(0, 0, 0);
    
      background-color: #ffffff;
    }
    
    &::placeholder {
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;


const Nav = styled.nav`
margin-left: auto;
display: block;

@media (max-width: 768px) {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  padding: 12px 0;
}
`;



const NavListWrap = styled.ul`
display: flex;
flex-wrap: nowrap;
list-style-type: none;
`;

const NavList = styled.li`
display: flex;
align-items: center;

a {
   align-items: center; 
   display: flex;
   background: transparent;
   flex-direction: column;
   font-size: 12px;
   font-weight: 400;
   justify-content: center;
   line-height: 1.5;
   min-height: 42px;
   min-width: 80px;
   position: relative;
   text-decoration: none;

   span {
     color: rgba(0,0,0,0.6);
     display: flex;
     align-items: center;
     position: relative;
     
     &::after {
       content: "";
       position: absolute;
       bottom: -8px;
       left: 50%;
       transform: translateX(-50%) scaleX(0);
       width: 100%;
       height: 2px;
       background-color: rgba(0,0,0,0.9);
       transition: transform 0.2s ease-in-out;
     }
   }
}

&:hover a span {
  color: rgba(0,0,0,0.9);
}

&.active a span {
  color: rgba(0,0,0,0.9);
  
  &::after {
    transform: translateX(-50%) scaleX(1);
  }
}
`;

const User = styled(NavList)`
a > svg{
width: 24px;
border-radius: 50%;
}

a > img{
width: 24px;
height: 24px;
border-radius: 50%;
}

span{
display: flex;
align-items: center;
gap: 4px;
}

a span::after{
  display: none;
}

.drop{
  width: 12px;
  height: 12px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  display: none;
}
`;
 
 const Work = styled(User)`
 border-left: 1px solid rgba(0,0,0,0.08);
 
 @media (max-width: 768px) {
  display: none;
 }
`;


export default Header;
