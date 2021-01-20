import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Axios from "axios"; 
import { useHistory } from 'react-router-dom';
import logo from '../img/1.jpg';
import M,{options} from 'materialize-css'
import '../styles/Carousel.css'
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, options);
  });

const Carousel = () => {
    
const [loginStatus, setLoginStatus] = useState("");
Axios.defaults.withCredentials = true;
const history = useHistory();
   return(
  <div class="carousel">
  <a class="carousel-item" href="#one!"><img src={logo} /></a>
  <a class="carousel-item" href="#two!"><img src={logo} /></a>
  <a class="carousel-item" href="#three!"><img src={logo} /></a>
  <a class="carousel-item" href="#four!"><img src={logo} /></a>
  <a class="carousel-item" href="#five!"><img src={logo} /></a>
</div>



   );
};

export default  Carousel
