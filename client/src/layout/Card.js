import React, {useState,useEffect} from 'react'
import Axios from "axios";
import M, {options} from 'materialize-css'
import '../styles/Card.css'
import logo from "../img/logo.png"

export default function Main(props){

        Axios.defaults.withCredentials = true;

        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.carousel');
            var instances = M.Carousel.init(elems, options);
        });

    if(typeof(props.tmpImg) !== 'undefined' && props.tmpImg != null) {
        return (
            <div className="card background">
                <a href="#1">
                    <div className="card-image ">
                        <img src={props.tmpImg} className="responsive-img  " height="256" width="256"></img>
                    </div>
                    <div className="card-content">
                    </div>
                </a>
            </div>
        );
    }
    else{
        return (
            <div className="card">
                <a href="#1">
                    <div className="card-image ">
                        <img src={logo} className="responsive-img  " height="256" width="256"></img>
                    </div>
                    <div className="card-content">
                    </div>
                </a>
            </div>
        );
    }
}
