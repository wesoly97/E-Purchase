import React,{useState, useEffect} from "react";
import Axios from "axios";

import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import '../styles/App.css'
import $ from "jquery";
export default function Main(){

    const[role,setRole] = useState("");
    const history = useHistory();

    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{
        //jQuerry reload page once after load to make 'select' work - stupid but works
        $(document).ready(function(){
            if(document.URL.indexOf("#")===-1){
                let url = document.URL+"#";
                window.location = "#";
                window.location.reload(true);
            }
        });

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


        </div>
    )
}