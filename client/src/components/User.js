import React from "react";
import Axios from "axios";
import { useHistory } from 'react-router-dom';

export default function User(){

    const history = useHistory();

    const logout=()=>{
        Axios.post('http://localhost:3001/logout').then(r => {});
        history.push("/register");
    };

    return(
        <div>
            <h1>User</h1>
            <button onClick={logout}>LOGOUT</button>
        </div>
    )
}