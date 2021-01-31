import $ from 'jquery'
import React,{useState,useEffect } from 'react'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Axios from "axios";
import '../styles/Navbar.css'
import { useHistory } from 'react-router-dom';

import M,{options} from 'materialize-css'


const Navbar = () => {

    const [loginStatus, setLoginStatus] = useState("");
    const [userBalance, setUserBalance] = useState(0);

    Axios.defaults.withCredentials = true;
    const history = useHistory();
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, options);
    });
    useEffect(() => {

        Axios.get('http://localhost:3001/accountInfo',
            {
            }).then((response)=> {
            setUserBalance(response.data[0].res2.value);
        });

        let dropdowns = document.querySelectorAll(".dropdown-auctions");
        let options = {
            inDuration: 300,
            outDuration: 225,
            hover: true,
            coverTrigger: false,
            alignment: 'right'
        };
        M.Dropdown.init(dropdowns, options);

    }, []);
    useEffect(() => {
        let dropdowns = document.querySelectorAll(".dropdown-account");
        let options = {
            inDuration: 300,
            outDuration: 225,
            hover: true,
            coverTrigger: false,
            alignment: 'right'
        };
        M.Dropdown.init(dropdowns, options);

    }, []);
    return(
        <div className="row">

            <nav>
                <div className="nav-wrapper grey darken-3">
                    <div className="container">
                        <div className="row navRow">
                            <div className="col s1">
                                <Link to="/Home" className="brand-logo ">E-Purchase</Link>
                            </div>
                            <div className="col s1">
                                <a href="#" className="sidenav-trigger" data-target="mobile-nav">
                                    <i className="material-icons">menu</i>
                                </a>
                            </div>
                            <div className="col s4">
                                <form action="" method="post">
                                    <div className="input-field hide-on-med-and-down">
                                        <input id="search" type="search" name="search"></input>
                                        <label className="label-icon" for="search">
                                            <i className="material-icons">search</i></label>
                                        <i className="material-icons">close</i>
                                    </div>
                                </form>
                            </div>

                        

                            <div className="col s5">
                                <ul className="right hide-on-med-and-down">
                                    <li><a className='dropdown-account list' href='#' data-target='dropdownAccount' ><i className="material-icons left">account_circle</i>KONTO</a></li>
                                    <li> <NavLink to="/cart"><i className="material-icons left">shopping_cart</i>KOSZYK</NavLink></li>
                                    <li> <NavLink to="/message" ><i className="material-icons left">message</i>WIADOMOŚĆI</NavLink></li>
                                    <li><a className='dropdown-auctions list' href='#' data-target='dropdownAuctions' ><i className="material-icons left">shop</i>AUKCJE</a></li>
                                    <li>
                                        <a className="btn-floating btn-large waves-effect waves-light blue" onClick={() => {
                                            Axios.post('http://localhost:3001/logout').then(r => {})
                                            setLoginStatus(false);
                                            history.push("/login");
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
            <ul className="sidenav" id="mobile-nav">
            <li><form> <div className="input-field row">
            <div className="col s2">
            <i className="material-icons prefix" >search</i></div>
            <input id="search" type="search" className="col s10" placeholder="Wyszukaj przedmioty do kupienia"></input>
             <i className="material-icons">close</i>
            </div></form></li>
                <li> <NavLink to="/account"><i className="material-icons left">attach_money</i>BALANCE: {userBalance}$</NavLink></li>
                <li> <NavLink to="/home"><i className="material-icons left">home</i>HOME</NavLink></li>
                <li> <NavLink to="/account" ><i className="material-icons left">account_circle</i>INFORMACJE O KONCIE</NavLink></li>
                <li> <NavLink to="/orders" ><i className="material-icons left">business_center</i>ZAMÓWIENIA</NavLink></li>
                <li> <NavLink to="/cart"><i className="material-icons left">shopping_cart</i>KOSZYK</NavLink></li>
                <li> <NavLink to="/message" ><i className="material-icons left">message</i>WIADOMOŚĆI</NavLink></li>
                <li> <NavLink to="/auctions" ><i className="material-icons left">shop</i>WSZYSTKIE AUKCJE</NavLink></li>
                <li> <NavLink to="/addAuction" ><i className="material-icons left">shop_two</i>DODAJ AUKCJE</NavLink></li>
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
            <ul id='dropdownAuctions' className='dropdown-content'>
                <li > <NavLink to="/auctions" ><i className=" material-icons left">shop</i>Wszystkie Aukcje</NavLink></li>
                <li> <NavLink to="/addAuction" ><i className="material-icons left">shop_two</i>Dodaj Aukcje</NavLink></li>
            </ul>
            <ul id='dropdownAccount' className='dropdown-content'>
            
            <li > <NavLink to="/account" ><i className=" material-icons left">attach_money</i> Balance: ${userBalance}</NavLink></li>
                <li > <NavLink to="/account" ><i className=" material-icons left">account_circle</i>Informacje o koncie</NavLink></li>
                <li> <NavLink to="/orders" ><i className="material-icons left">business_center</i>Zamówienia</NavLink></li>
            </ul>
        </div>
    );
};

export default  Navbar