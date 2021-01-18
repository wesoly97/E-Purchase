import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
   return(
        <nav className="nav-wrapper grey darken-3">
            <div className="container">
           {/*   
                <div id="register">
                <Link to="/register" className="brand-logo">E-Purchase</Link>
                </div>
                */}
                <div id="account">
                <Link to="/account" >Konto</Link>
                </div>
               
            </div>
        </nav>
   );
};

export default  Navbar
