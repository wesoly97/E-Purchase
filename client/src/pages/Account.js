import React,{useState, useEffect} from "react";
import Axios from "axios";
import User from "../components/User";
import Admin from "../components/Admin";
import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";

<link rel="stylesheet" href="styles/accountStyles.css"></link>

export default function Account(){

    const[role,setRole] = useState("");
    const history = useHistory();

    const[nick,setNick] = useState("");

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

    const accountInfo = () =>{
        Axios.get('http://localhost:3001/accountInfo',
        ).then((response)=> {
                const info = response.data[0]
                setNick(info)
            console.log(response);
        });
    }

    return(
        
        <div>
            <Navbar/>
            <div class="container">
                <h1>Informacje o koncie</h1>
            <div class="row">
            <div class="col s6">
                
                <br></br>
                <h3>Nick: {nick}</h3>
                <h3>Rola: {role}</h3>
                <h3>Reputacja: <a class="btn-floating pulse "><i class=" material-icons">star</i></a></h3>
                <h3>Zweryfikowany : <a class="btn-floating green pulse"><i class="material-icons">done</i></a></h3>
            </div>

            <div class="col s6">
                <div id="buyingHistory" class="right"></div>
                    <ul class="collection with header">
                        <li class="collection-header"><h2>Historia Zakupów</h2></li>
                        <li class="collection-item avatar ">
                        <img src="https://www.qries.com/images/banner_logo.png" alt="" class="circle"></img>
                        <span class="title">Nazwa produktu</span>
                        <p id="description">
                            sprzedajacy<br></br>
                            cena<br></br>
                            <a class="btn-floating btn-small pulse green"><i class=" material-icons">star</i></a>
                            <a href="#!" class="secondary-content"><i class="material-icons">mail</i></a>
                        </p>
                        </li>
                    </ul>
                    </div>
            </div>
        </div>
        </div>
    )
}