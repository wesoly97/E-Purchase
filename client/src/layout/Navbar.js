import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
   return(
        <nav className="nav-wrapper grey darken-3">
            <div className="container">
                <Link to="/register" className="brand-logo">E-Purchase</Link>
            </div>
        </nav>
   );
};

export default  Navbar
