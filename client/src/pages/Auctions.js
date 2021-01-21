import React,{useState, useEffect} from "react";
import Axios from "axios";

import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";

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


    if(typeof(itemsToShow[0]) !== 'undefined' && itemsToShow[0] != null)
    {
        return (
            <div>

                <Navbar/>
                <h1>AUKCJE</h1>
                <button onClick={addAuction} className="btn waves-effect waves-light" type="submit" name="action">Dodaj
                    aukcję
                    <i className="material-icons right">send</i>
                </button>

                <div>
                    {itemsToShow.map((item, index) => (
                        <div key={index}>
                            <p>{item.name}</p>
                            <p>{item.description}</p>
                            <p>{item.price}</p>
                            <p>{item.quantity}</p>
                            <p>============================</p>
                        </div>
                    ))}
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