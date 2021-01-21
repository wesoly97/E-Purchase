import React,{useState, useEffect} from "react";
import Axios from "axios";
import User from "../components/User";
import Admin from "../components/Admin";
import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import $ from "jquery";
import M from "materialize-css";

import "../styles/accountStyles.css"

export default function Account(){

    const[role,setRole] = useState("");
    const history = useHistory();

    const[nick,setNick] = useState("");

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);
      });

    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{

        $(document).ready(function(){
            //Check if the current URL contains '#'
            if(document.URL.indexOf("#")===-1){
                // Set the URL to whatever it was plus "#".
                let url = document.URL+"#";
                window.location = "#";

                //Reload the page
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
                <div class="row">

                    <div class="col s6">
                    <h1>Informacje o koncie</h1>
                    </div>

                </div>

            <div class="row">
            <div class="col s6">
                
                <br></br>
                <h3>Nick: {nick}</h3>
                <h3>Rola: {role}</h3>
                <h3>Reputacja: <a class="btn-floating tooltipped pulse " data-position="bottom" data-tooltip="Skala reputacji do max 5 gwiazdek"><i class=" material-icons">star</i></a></h3>
                <h3>Zweryfikowany : <a class="btn-floating tooltipped green pulse" data-position="bottom" data-tooltip="Aby być zweryfikowanym musisz mieć conajmniej 10 opini"><i class="material-icons">done</i></a></h3>
            </div>

            <div class="col s6">
            <h2>Historia Zakupów</h2>
                <div class="listWrapper">
                <div id="buyingHistory" class="right"></div>
                    <ul class="collection">
                        {/*listing of bought products*/}
                        <li class="collection-item avatar ">
                        <img src="https://www.qries.com/images/banner_logo.png" alt="" class="circle"></img>
                        <span class="title"><h6>Nazwa produktu</h6></span>
                        <p id="description">
                            sprzedajacy<br></br>
                            cena<br></br>
                            <a href="#!" class="secondary-content tooltipped" data-position="bottom" data-tooltip="Wyslij wiadomosc do sprzedajacego"><i class="material-icons">mail</i></a>
                        </p>
                        </li>
                    </ul>
                    </div>
                    </div>
                    
            </div>

            <div class="row">

                <div class="col s6">
                <h1>Stan konta:</h1>
                <h3 id="h3money">pieniadze</h3>
                <a class="btn-large tooltipped btn-small pulse green" data-position="bottom" data-tooltip="Dodaj pieniadze"><i class=" material-icons">attach_money</i></a>
                <a class="btn-large tooltipped btn-small pulse red" data-position="bottom" data-tooltip="Usun pieniadze"><i class=" material-icons">money_off</i></a>
                </div>

                <div class="col s6">
            <h2>Opinie kupujących</h2>
                <div class="listWrapper">
                <div id="opinions" class="right"></div>
                    <ul class="collection">
                        {/*listing of opinions*/}
                        <li class="collection-item  ">
                        <span class="title"><h6>nick kupujacego</h6></span>
                        <p id="description">
                            opinia<br></br>
                        </p>
                        </li>
                    </ul>
                    </div>
                    </div>

            </div>
        </div>
        </div>
        
    )
}