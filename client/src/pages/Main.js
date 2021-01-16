import React,{useState, useEffect} from "react";
import Axios from "axios";

import User from "../components/User";
import Admin from "../components/Admin";

export default function Main(){

    const[role,setRole] = useState("");
    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{

        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setRole(response.data.user[0].role);
            }
        });
    },[]);
    
    return(
        <div>
            {role === "user" && <User />}
            {role === "admin" && <Admin />}
        </div>
    )
}