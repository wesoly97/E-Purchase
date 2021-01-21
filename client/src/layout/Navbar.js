import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Axios from "axios"; 
import '../styles/Navbar.css'
import { useHistory } from 'react-router-dom';
import M,{options} from 'materialize-css'
const Navbar = () => {
    
const [loginStatus, setLoginStatus] = useState("");
Axios.defaults.withCredentials = true;
const history = useHistory();
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });
   return(
       <div>
    <nav>
        <div className="nav-wrapper grey darken-3">
            <div className="container">
            <div class="row">
      <div class="col s2">

            <Link to="/Home" className="brand-logo ">E-Purchase</Link>
            </div>
            <div class="col s1">
           <a href="#" className="sidenav-trigger" data-target="mobile-nav">

               <i className="material-icons">menu</i>
           </a>
           </div>
           <div class="col s3">
           <form action="" method="post">
                            <div className="input-field hide-on-med-and-down">
                                <input id="search" type="search" name="search"></input>
                                <label className="label-icon" for="search"><i class="material-icons">search</i></label>
                                <i class="material-icons">close</i>
                            </div>
                        </form>
                        </div>
                        <div class="col s6">
            <ul className="right hide-on-med-and-down">

            <li> <NavLink to="/home"><i className="material-icons left">home</i>HOME</NavLink></li>
            <li> <NavLink to="/account" ><i className="material-icons left">account_circle</i>KONTO</NavLink></li>
            <li> <NavLink to="/message" ><i className="material-icons left">message</i>WIADOMOŚĆI</NavLink></li>
            <li> <NavLink to="/auctions" ><i className="material-icons left">shop</i>AUKCJE</NavLink></li>
            <li> 
            <a className="btn-floating btn-large waves-effect waves-light blue" onClick={() => {
                            Axios.post('http://localhost:3001/logout').then(r => {})
                            setLoginStatus(false);
                            history.push("/register");
               }}>
                <i className="material-icons">exit_to_app</i>
            </a>
             </li>
            </ul>
            </div>
            </div>
           </div>
           </div>
        </nav>
                <ul className="sidenav sidenav-close" id="mobile-nav">
                <li> <NavLink to="/home"><i className="material-icons left">home</i>HOME</NavLink></li>
            <li> <NavLink to="/account" ><i className="material-icons left">account_circle</i>KONTO</NavLink></li>
            <li> <NavLink to="/message" ><i className="material-icons left">message</i>WIADOMOŚĆI</NavLink></li>
            <li> <NavLink to="/auctions" ><i className="material-icons left">shop</i>AUKCJE</NavLink></li>
            <li> 
            <a href="#1" onClick={() => {
                            Axios.post('http://localhost:3001/logout').then(r => {})
                            setLoginStatus(false);
                            history.push("/register");
               }}>
                <i className="material-icons">exit_to_app</i>WYLOGUJ
            </a>
             </li>
            
                </ul>
                </div>
   );
};

export default  Navbar