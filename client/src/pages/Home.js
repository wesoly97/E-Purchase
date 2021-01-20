import React,{useState, useEffect} from "react";
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import Carousel from"../layout/Carousel";
export default function Main(){

    const[role,setRole] = useState("");
    const history = useHistory();

    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setRole(response.data.user[0].role);
            }
            else{
                history.push("/register");
            }
        });
    },[]);
    
    return(
        <div>
            <Navbar/>
            <Carousel/>
            <h1>Home</h1>
        </div>
    )
}