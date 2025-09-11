import { connect } from "react-redux";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/login";
import Home from "./components/home";
import Header from "./components/header";
import { getUserAuth } from "./actions";

function App(props) {

  useEffect(() => {
    props.getUserAuth();
  }, []);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/header" element={<Header />} /> */}

        </Routes>
      </Router>
    </div>
  );
}


const mapStateToProps = (state) => {
  return{};
};

const mapDispatchToProps = (dispatch) => ({
  
    getUserAuth: () => dispatch(getUserAuth()),
 
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
