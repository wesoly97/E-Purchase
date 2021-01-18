import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Register from "./pages/Register";
import Main from "./pages/Main";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import Message from "./pages/Message";
function App(){

    return(
        <Router>
            <Route path="/register" exact render={(props) => <Register/>} />
            <Route path="/" exact render={(props) => <Main/>} />
            <Route path="/account" exact render={(props) => <Account/>} />
            <Route path="/home" exact render={(props) => <Home/>} />
            <Route path="/auctions" exact render={(props) => <Auctions/>} />
            <Route path="/message" exact render={(props) => <Message/>} />
        </Router>
    )
}

export default App;