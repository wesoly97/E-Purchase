import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Register from "./pages/Register";
import Main from "./pages/Main";
import Account from "./pages/Account";
function App(){

    return(
        <Router>
            <Route path="/register" exact render={(props) => <Register/>} />
            <Route path="/" exact render={(props) => <Main/>} />
            <Route path="/account" exact render={(props) => <Account/>} />
        </Router>
    )
}

export default App;