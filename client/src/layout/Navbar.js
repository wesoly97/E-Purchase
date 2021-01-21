import React,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Axios from "axios"; //http request library
import { useHistory } from 'react-router-dom';
const Navbar = () => {
    
const [loginStatus, setLoginStatus] = useState("");
Axios.defaults.withCredentials = true;
const history = useHistory();
   return(
        <nav className="nav-wrapper grey darken-3">
            <div className="container">
            <Link to="/home" className="brand-logo left">E-Purchase</Link>
           
            <ul className="right hide-on-med-and-down">
                <li> <form>
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
