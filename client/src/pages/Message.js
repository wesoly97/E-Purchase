import React,{useState, useEffect} from "react";
import Axios from "axios";

import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import Materialize from "materialize-css";
import $ from 'jquery';

export default function Main(){

    const history = useHistory();
    Axios.defaults.withCredentials = true;//zajebiscie wazne


    const [role,setRole] = useState("");
    const [messageText, setMessageText] = useState("");
    const [idFrom, setIdFrom] = useState(1);
    const [idTo, setIdTo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [interlocutorArray, setInterlocutorArray] = useState([]);
    const [username, setUsername] = useState("");
    let interlocutors = [];
    let messes = [];


    useEffect(()=>{
        $(document).ready(function(){
            if(document.URL.indexOf("#")===0){
              
        //jQuerry reload page once after load to make 'select' work - stupid but works
        //$(document).ready(function(){
        // if(document.URL.indexOf("#")===-1){
        //main
                let url = document.URL+"#";
                window.location = "#";
                window.location.reload(true);
            }
        });

        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setRole(response.data.user[0].role);
                setIdFrom(response.data.user[0].id)
            }
            else{
                history.push("/register");
            }
        });
        //getUserId();
        getInterlocutor();
        //getMessages();
    },[]);




    /*

    const getUserId = () => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setRole(response.data.user[0].role);
                setIdFrom(response.data.user[0].id);
            }
            else{
                history.push("/register");
            }
        });
    }*/

    //getUserId();

    function abc(){
        Materialize.updateTextFields();
    }

    const getInterlocutor = () => {
        Axios.post("http://localhost:3001/message/getlist", {
            idFrom: idFrom
        }).then((response) => {
            setInterlocutorArray([]);
            setInterlocutorArray(response.data.result);
        })
    }


    const getMessages = () => {
        history.push("/message");
        Axios.post("http://localhost:3001/message/get", {
            idFrom: idFrom,
            idTo: idTo
        }).then((response) => {
            setMessages(response.data.result);
            messes = [];
            // = response.data.result;
        })

    };




    for(const [index, value] of interlocutorArray.entries()){
        interlocutors.push(<a value={value.UsersFrom} onClick={() => selectInterlocutor(value.UsersFrom)} className="collection-item ">{value.username}</a>)
    }

    const selectInterlocutor = (id) =>{
        history.push("/message");
        setIdTo(id);
        setMessages([]);
        getMessages();
    }



    for (const [index, value] of messages.entries()){
        if(index === messages.length-1){
            if(value.UsersFrom === idTo){
                messes.push(<div className="col s10 m10 l10">
                    <div className="card blue-grey darken-1">
                        <div tabIndex="0" autofocus="autofocus" className="card-content white-text">
                            <span className="card-title">{value.username}</span>
                            <p>{value.contents}</p>
                        </div>
                    </div>
                </div>)
            }
            if(value.UsersFrom === idFrom) {
                messes.push(<div className="col s10 m10 offset-s2 offset-l2 offset-m2">
                    <div className="card lime lighten-4">
                        <div tabIndex="0" autofocus="autofocus" className="card-content black-text">
                            <span className="card-title right-align">Ja</span>
                            <p className="right-align">{value.contents}</p>
                        </div>
                    </div>
                </div>)
            }
        }
        else {
            if(value.UsersFrom === idTo){
                messes.push(<div className="col s10 m10 l10">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">{value.username}</span>
                            <p>{value.contents}</p>
                        </div>
                    </div>
                </div>)
            }
            if(value.UsersFrom === idFrom) {
                messes.push(<div className="col s10 m10 offset-s2 offset-l2 offset-m2">
                    <div className="card lime lighten-4">
                        <div className="card-content black-text">
                            <span className="card-title right-align">Ja</span>
                            <p className="right-align">{value.contents}</p>
                        </div>
                    </div>
                </div>)
            }
        }


    }


    const sendMessage = () => {
        Axios.post("http://localhost:3001/message/send", {
            messageText: messageText,
            idFrom: idFrom,
            idTo: idTo
        }).then((response) => {

        });
        document.getElementById("messageText").value = "";
        history.push('/message');
        setMessageText("");
        Materialize.toast({html: 'Wiadomość została wysłana'});
        getMessages();
        history.push("/message");
    };
    return(
        <div>
            <Navbar/>
            <div className="container">
            <h1>Wiadomości</h1>
                <div className="row grey darken-4">
                    <div className="col s3">
                        <div class="row">
                            <div class="col s9">
                                <div className="input-field inline">
                                    <input style={{color: "rgb(51, 204, 204)"}} onChange={(e) => setUsername(e.target.value)} id="searchUser" type="text" class="validate"/>
                                    <label htmlFor="searchUser">Wyszukaj użytkownika</label>
                                </div>
                            </div>
                            <div class="col s3">
                                <a className="btn-floating btn-large waves-effect waves-light red"><i
                                    className="material-icons">search</i></a>
                            </div>
                        </div>
                        <div className="collection">
                            {interlocutors}
                        </div>
                    </div>
                    <div className="col s9">
                        <div id="scroll" style={{overflowY: "auto", height: "400px", overflowX: "hidden"}}>
                            <div className="row">
                                {messes}
                                <input id="scrollHere" type="hidden"/>

                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s9">
                                <input style={{color: "#ebfafa"}}  id="messageText" type="text" className="validate" onChange={(e) =>
                                    setMessageText(e.target.value)
                                }/>
                                <label htmlFor="message">Wpisz wiadomość</label>
                            </div>
                            <div class="col s3 ">
                                <br/>
                                <a id="sendButton" className="waves-effect waves-light btn valign-wrapper" onClick={sendMessage}><i className="material-icons left">send</i>Wyślij wiadomość</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}