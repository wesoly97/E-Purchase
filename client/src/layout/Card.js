import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Axios from "axios"; 
import { useHistory } from 'react-router-dom';
import logo from '../img/1.jpg';
import M,{options} from 'materialize-css'
import '../styles/Card.css'
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, options);
  });

const Carousel = () => {
    
const [loginStatus, setLoginStatus] = useState("");
Axios.defaults.withCredentials = true;
const history = useHistory();
   return(
    <div className="card  grey lighten-1">
    <a href="#1">            
    <div className="card-image ">
   
    <img src={logo} class="responsive-img circle" height="256" width="256"></img>
     </div>
     <div className="card-content">
     <p>tylko teraz 10 zl!</p>
    </div>
    </a>  
</div>



   );
};

export default  Carousel
