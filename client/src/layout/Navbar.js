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
           <div className="row">

        <nav>
            <div className="nav-wrapper grey darken-3">
                <div className="container">
                    <div className="row">
                        <div className="col s2">
                            <Link to="/Home" className="brand-logo ">E-Purchase</Link>
                        </div>
                    <div className="col s1">
                        <a href="#" className="sidenav-trigger" data-target="mobile-nav">
                            <i className="material-icons">menu</i>
                        </a>
                    </div>
                    <div className="col s3">
                        <form action="" method="post">
                            <div className="input-field hide-on-med-and-down">
                                <input id="search" type="search" name="search"></input>
                                <label className="label-icon" for="search">
                                    <i class="material-icons">search</i></label>
                                    <i className="material-icons">close</i>
                            </div>
                        </form>
                    </div>
                    <div className="col s5">
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
       </div>
   );
};

export default  Navbar