import React,{useState, useEffect} from "react";
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import $ from "jquery";
import M from "materialize-css";
import Foot from "../layout/Footer";
import "../styles/accountStyles.css"




export default function Account(){

    const[role,setRole] = useState("");
    const history = useHistory();

    const[nick,setNick] = useState("");
    const[name,setName] = useState("");
    const[surname,setSurname] = useState("");

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);
      });

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

        Axios.get('http://localhost:3001/accountInfo',
        ).then((response)=> {
            console.log(response);
            setNick(response.data.username);
            setName(response.data.name);
            setSurname(response.data.surname);
        });

    },[]);



    return(
        
        <div>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col s6">
                        <h1>Informacje o koncie</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col s6">
                        <br></br>
                        <h3><b>Nick:</b> {nick}</h3>
                        <h3><b>Imie: </b>{name}</h3>
                        <h3><b>Nazwisko:</b> {surname}</h3>
                        <h3><b>Reputacja: </b><a className="btn-floating tooltipped pulse " data-position="bottom" data-tooltip="Skala reputacji do max 5 gwiazdek"><i className=" material-icons">star</i></a></h3>
                        <h3><b>Zweryfikowany :</b> <a className="btn-floating tooltipped green pulse" data-position="bottom" data-tooltip="Aby być zweryfikowanym musisz mieć conajmniej 10 opini"><i className="material-icons">done</i></a></h3>
                    </div>
                    <div className="col s6">
                        <h2>Historia Zakupów</h2>
                        <div className="listWrapper">
                            <div id="buyingHistory" className="right"></div>
                            <ul className="collection">
                                {/*listing of bought products*/}
                                <li class="collection-item avatar ">
                                    <img src="https://www.qries.com/images/banner_logo.png" alt="" className="circle"></img>
                                    <span className="title"><h6>Nazwa produktu</h6></span>
                                    <p id="description">sprzedajacy<br></br>cena<br></br>
                                        <a href="#!" className="secondary-content tooltipped" data-position="bottom" data-tooltip="Wyslij wiadomosc do sprzedajacego"><i className="material-icons">mail</i></a>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    </div>
                <div className="row">
                        <div className="col s6">
                            <h1>Stan konta:</h1>
                            <h3 id="h3money">pieniadze</h3>
                            <a className="btn-large tooltipped btn-small pulse green" data-position="bottom" data-tooltip="Dodaj pieniadze"><i className=" material-icons">attach_money</i></a>
                            <a className="btn-large tooltipped btn-small pulse red" data-position="bottom" data-tooltip="Usun pieniadze"><i className=" material-icons">money_off</i></a>
                        </div>
                        <div className="col s6">
                            <h2>Opinie kupujących</h2>
                            <div className="listWrapper">
                                <div id="opinions" className="right"></div>
                                <ul className="collection">
                                    {/*listing of opinions*/}
                                    <li className="collection-item  ">
                                        <span className="title"><h6>nick kupujacego</h6></span>
                                        <p id="description">opinia<br></br></p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Foot></Foot>
            </div>

        
    )
}