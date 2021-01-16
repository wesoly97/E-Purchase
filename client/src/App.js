import React from "react"
import {BrowserRouter as Router, Route} from "react-router-dom";
import Register from "./pages/Register";
import Main from "./pages/Main";

function App(){

    return(
        <Router>
            <Route path="/register" exact render={(props) => <Register/>} />
            <Route path="/" exact render={(props) => <Main/>} />
        </Router>
    );


}

export default App;