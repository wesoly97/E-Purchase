import React from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import Message from "./pages/Message";
import AddAuction from "./pages/AddAuction"
import Cart from "./pages/Cart"
import Register from "./pages/Register"
import Orders from "./pages/Orders"
function App(){

    return(
        <Router>
            <Route path="/login" exact render={(props) => <Login/>} />
            <Route path="/register" exact render={(props) => <Register/>} />
            <Route path="/" exact render={(props) => <Home/>} />

            <Route path="/account" exact render={(props) => <Account/>} />
            <Route path="/home" exact render={(props) => <Home/>} />
            <Route path="/auctions" exact render={(props) => <Auctions/>} />
            <Route path="/message" exact render={(props) => <Message/>} />

            <Route path="/addAuction" exact render={(props) => <AddAuction/>} />
            <Route path="/cart" exact render={(props) => <Cart/>} />
            <Route path="/orders" exact render={(props) => <Orders/>} />
        </Router>
    )
}

export default App;