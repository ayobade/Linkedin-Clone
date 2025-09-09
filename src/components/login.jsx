import styled from "styled-components";

const Login = () => {
  return (
    <Container>
      <Nav>
        <a href="/">
          <img src="/images/login-logo.svg" alt="LinkedIn" />
        </a>
        <div>
          <Join>Join now</Join>
          <SignIn>Sign in</SignIn>
        </div>
      </Nav>

      <Section>
        <LeftColumn>
          <Headline>Welcome to your professional community</Headline>

          <Buttons>
            <GoogleButton>
              <img src="/images/google.svg" alt="Google" />
              Continue with Google
            </GoogleButton>

            <MicrosoftButton>
              <img src="/images/microsoft-50.svg" alt="Microsoft" />
              Continue with Microsoft
            </MicrosoftButton>

            <EmailButton>
              Sign in with email
            </EmailButton>
          </Buttons>

          <Legal>
            By clicking Continue to join or sign in, you agree to LinkedIn’s <a href="#">User
            Agreement</a>, <a href="#">Privacy Policy</a>, and <a href="#">Cookie Policy</a>.
          </Legal>

          <Signup>
            New to LinkedIn? <a href="#">Join now</a>
          </Signup>
        </LeftColumn>

        <RightColumn>
          <HeroImage src="/images/login-hero.svg" alt="Hero" />
        </RightColumn>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  background: #ffffff;
`;

const Nav = styled.nav`
  max-width: 1128px;
  margin: auto;
  padding: 12px 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  & > a {
    width: 135px;
    height: 34px;
    display: inline-flex;
  }

  @media (max-width: 768px) {
    padding: 16px;
    & > a {
      width: 100px;
      height: 25px;
    }
  }
`;

const Join = styled.a`
  font-size: 16px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 12px;
  font-weight: 600;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.9);
  }
`;

const SignIn = styled.a`
  box-shadow: inset 0 0 0 1px #0a66c2;
  border-radius: 24px;
  color: #0a66c2;
  transition-duration: 167ms;
  font-size: 16px;
  font-weight: 600;
  line-height: 40px;
  padding: 10px 16px;
  text-decoration: none;
  text-align: center;

  &:hover {
    background-color: rgba(112, 181, 255, 0.15);
  }
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
  max-width: 1128px;
  margin: 24px auto 0;
  padding: 40px 0 60px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 24px 16px 40px;
  }
`;

const LeftColumn = styled.div`
  max-width: 700px;
`;

const Headline = styled.h1`
  font-size: 40px;
  line-height: 54px;
  font-weight: 300;
  color: #56687a;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    font-weight: 300;
  }
`;

const Buttons = styled.div`
  width: 408px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const BaseButton = styled.button`
  height: 48px;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid rgba(0,0,0,0.6);
  background: #ffffff;
  color: rgba(0,0,0,0.9);

  img { width: 24px; height: 24px; }
`;

const GoogleButton = styled(BaseButton)`
  background: #0a66c2;
  color: #ffffff;
  border: none;
`;

const MicrosoftButton = styled(BaseButton)``;

const EmailButton = styled(BaseButton)``;

const Legal = styled.p`
  width: 408px;
  margin-top: 16px;
  font-size: 12px;
  text-a
  line-height: 20px;
  color: rgba(0,0,0,0.6);

  a { color: #0a66c2; }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Signup = styled.p`
  margin-top: 28px;
  font-size: 14px;
  a { color: #0a66c2; font-weight: 600; }
  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const RightColumn = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const HeroImage = styled.img`
  width: 600px;
  height: auto;

  @media (max-width: 1280px) {
    width: 560px;
  }

  @media (max-width: 1024px) {
    width: 374px;
    margin: 24px auto 0;
  }
`;

export default Login;
