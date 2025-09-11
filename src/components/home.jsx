import styled from "styled-components";
import Header from "./header";
import Leftside from "./leftside";
import Main from "./main";
import Rightside from "./rightside";
import { connect } from "react-redux";
import {Navigate} from "react-router-dom";

const Home = (props) => {
    return (
        <Container>
            {/* {!props.user && <Navigate to="/" />} */}
            <Header />
            <Layout>
                <Leftside />
                <Main />
                <Rightside />
            </Layout>
        </Container>
    )
}


const Container = styled.div`
  min-height: 100vh;
`;

const Layout = styled.div`
  display: grid;
  grid-template-areas: "leftside main rightside";
  grid-template-columns: minmax(0, 5fr) minmax(0, 12fr) minmax(300px, 7fr);
  padding-top: 60px;
  min-height: calc(100vh - 60px);
  column-gap: 24px;
  row-gap: 24px;
  /* grid-template-rows: auto; */
  margin: 24px auto;
  max-width: 1128px;
  padding-left: 24px;
  padding-right: 24px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 60px 5px;
  }
`;

// const mapStateToProps = (state) => {
//   return {
//     user: state.userState.user,
//   };
// };



// export default connect(mapStateToProps)(Home);

export default Home;