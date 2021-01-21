import React,{useState, useEffect} from "react";
import Axios from "axios";

import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import "../styles/Auctions.css"
import $ from "jquery"
import M from "materialize-css"

export default function Main(){

    const[role,setRole] = useState("");
    const[itemsToShow,setItemsToShow] = useState("");
    const history = useHistory();


    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setRole(response.data.user[0].role);
                //Get items from database
                Axios.get("http://localhost:3001/getAllAuctions").then((response)=>{
                        setItemsToShow(response.data); //genialne <3
                });

            }
            else{
                history.push("/register");
            }
        });

    },[]);

    const addAuction=()=>{
        history.push("/addAuction");
    };

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    });


    if(typeof(itemsToShow[0]) !== 'undefined' && itemsToShow[0] != null)
    {
        return (

            <div>
                <Navbar/>
                <div className="container">
                <div className="row">

                    <div className="col s4">
                        <h1>AUKCJE</h1>
                        <button onClick={addAuction} className="btn waves-effect waves-light" type="submit" name="action">Dodaj
                            aukcję
                            <i className="material-icons right">send</i>
                        </button>
                    </div>

                    <div className="col s8">
                        <div className="listWrapper">
                            <div id="opinions" className="right">
                            <ul className="collection">
                                {/*listing of items*/}
                                {itemsToShow.map((item, index) => (
                                    <li className="collection-item ">
                                        <div key={index}>
                                            <p><b>Nazwa:</b>    {item.name}</p>
                                            <p><b>Opis:</b>     {item.description}</p>
                                            <p><b>Ilosc:</b>    {item.quantity}szt</p>
                                            <p><b>Cena:</b>     {item.price}zł</p>
                                            {/*WYSKAKUJECE OKIENKO Z INFO*/}
                                            <button data-target="modal1" className="btn modal-trigger">Modal</button>
                                            {/*WYSKAKUJECE OKIENKO Z INFO*/}

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    </div>

                </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <Navbar/>
        )
    }
}