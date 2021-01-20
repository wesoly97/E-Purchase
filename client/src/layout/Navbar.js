import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Axios from "axios"; 
import { useHistory } from 'react-router-dom';
const Navbar = () => {
    
const [loginStatus, setLoginStatus] = useState("");
Axios.defaults.withCredentials = true;
const history = useHistory();
   return(
        <nav className="nav-wrapper grey darken-3">
            <div className="container">
            <Link to="/register" className="brand-logo left">E-Purchase</Link>
           
            <ul className="right hide-on-med-and-down">
                <li> <form>
            <div class="input-field">
            <input id="search" type="search" required></input>
            <label class="label-icon" for="search"><i class="material-icons red-text">search</i></label>
            <i class="material-icons">close</i>
            </div>
            </form></li>
            <li> <NavLink to="/home"><i class="material-icons left">home</i>HOME</NavLink></li>
            <li> <NavLink to="/account" ><i class="material-icons left">account_circle</i>KONTO</NavLink></li>
            <li> <NavLink to="/message" ><i class="material-icons left">message</i>WIADOMOŚĆI</NavLink></li>
            <li> <NavLink to="/auctions" ><i class="material-icons left">shop</i>AUKCJE</NavLink></li>
            <li> 
            <a class="btn-floating btn-large waves-effect waves-light blue" onClick={() => {
                            Axios.post('http://localhost:3001/logout').then(r => {})
                            setLoginStatus(false);
                            history.push("/register");
               }}>
                <i class="material-icons">exit_to_app</i>
            </a>
             </li>
            </ul>
            </div>
        </nav>
   );
};

export default  Navbar
