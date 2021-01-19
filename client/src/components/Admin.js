import React from "react";
import Axios from "axios";
import { useHistory } from 'react-router-dom';

export default function Admin(){

    const history = useHistory();

    const logout=()=>{
        Axios.post('http://localhost:3001/logout').then(r => {});
        history.push("/register");
    };

    return(
        <div>
            <h1>Admin</h1>
           
        </div>
    )
}