import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {NavLink} from 'react-router-dom'
import Axios from "axios"; 
import { useHistory } from 'react-router-dom';
import logo from '../img/logo.png';
import M,{options} from 'materialize-css'
import '../styles/Carousel.css'
var instance = M.Carousel.init({
  fullWidth: true
});

const Carousel = () => {
    
const [loginStatus, setLoginStatus] = useState("");
Axios.defaults.withCredentials = true;
const history = useHistory();
   return(
  <div className="carousel carousel-slider">
  <a className="carousel-item" href="#one!"><img src={logo} /></a>
  <a className="carousel-item" href="#two!"><img src={logo} /></a>
  <a className="carousel-item" href="#three!"><img src={logo} /></a>
  <a className="carousel-item" href="#four!"><img src={logo} /></a>
  <a className="carousel-item" href="#five!"><img src={logo} /></a>
</div>



   );
};

export default  Carousel
