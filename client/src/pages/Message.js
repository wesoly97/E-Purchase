import React,{useState, useEffect, useRef} from "react";
import Axios from "axios";

import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import Materialize from "materialize-css";
import $ from 'jquery';
import Foot from "../layout/Footer";
export default function Main(){

    const history = useHistory();
    Axios.defaults.withCredentials = true;//zajebiscie wazne

    const [role,setRole] = useState("");
    const [messageText, setMessageText] = useState("");
    const [idFrom, setIdFrom] = useState("");
    const [idTo, setIdTo] = useState(""); // user id to who we write message
    const [messages, setMessages] = useState([]);
    const [interlocutorArray, setInterlocutorArray] = useState([]);
    const [username, setUsername] = useState("");
    const [writeTo, setWriteTo] = useState("");
    let interlocutors = [];
    let messes = [];

    Axios.get('http://localhost:3001/accountInfo',
    ).then((response)=> {
        console.log(response);
        setIdFrom(response.data[0].res1.id);
    });

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


    // Pobieranie listy osób do rozmowy
    useEffect(() => {
        Axios.post("http://localhost:3001/message/getlist", {
            idFrom: idFrom
        }).then((response) => {
            //setInterlocutorArray([]);
            setInterlocutorArray(response.data.result);

        })
    }, [idFrom]);

    // Pobieranie wiadomości
    useEffect(() => {
        Axios.post("http://localhost:3001/message/get", {
            idFrom: idFrom,
            idTo: idTo
        }).then((response) => {
            setMessages(response.data.result);
            messes = [];

        });
    }, [idFrom, idTo, messageText]);


    for (const [index, value] of messages.entries()){
        if(index === messages.length-1){
            if(value.UsersFrom === idTo){
                messes.push(<div className="col s10 m10 l10">
                    <div className="card blue-grey darken-1">
                        <div  className="card-content white-text">
                            <span className="card-title">{value.username}</span>
                            <p>{value.contents}</p>
                        </div>
                    </div>
                </div>)
            }
            if(value.UsersFrom === idFrom) { //tabIndex="0" autofocus="autofocus"
                messes.push(<div className="col s10 m10 offset-s2 offset-l2 offset-m2">
                    <div className="card lime lighten-4">
                        <div  className="card-content black-text">
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

    // Nowa wiadomość po kliknięciu lupki
    const newMessage = () => {
        Axios.post("http://localhost:3001/message/findUser", {
            name: username
        }).then((response) => {
            if(response.data.result[0] != null){
                setIdTo(response.data.result[0].id);
                Materialize.toast({html: 'Pobieranie rozmowy...'});
                Materialize.toast({html: 'Piszesz wiadomość do ' + username});
                setWriteTo(">> Nowa wiadomość do " + username);
            }
            else {
                Materialize.toast({html: 'Nie znaleziono użytkownika!'});
            }
        })
    }

    // Wybór osoby do rozmowy z panelu po boku
    const selectInterlocutor = (id) =>{
        history.push("/message");
        setIdTo(id);
        Materialize.toast({html: 'Pobieranie rozmowy...'});
    }


    // Scrolluje na koniec wiadomości, kiedy zostaną pobrane
    useEffect(() => {
        $(document).ready(function (){
            $("#scroll").animate({ scrollTop: $('#scroll').prop("scrollHeight")});
        });

    }, [messes]);


    for(const [index, value] of interlocutorArray.entries()){
        interlocutors.push(<a href="#" value={value.UsersFrom} onClick={() => selectInterlocutor(value.UsersFrom)} className="collection-item grey darken-3">{value.username}</a>)
    }


    const sendMessage = () => {
        Axios.post("http://localhost:3001/message/send", {
            messageText: messageText,
            idFrom: idFrom,
            idTo: idTo
        }).then((response) => {
        });
        document.getElementById("messageText").value = "";

        setMessageText("");
        Materialize.toast({html: 'Wiadomość została wysłana'});
        history.push("/message");

    };


    return(
        <div>
            <Navbar/>

            <div className="container grey darken-4">
            <h1 style={{textAlign: "center", paddingTop: "20px", color: "white", fontSize: "40px", fontWeight: "lighter"}}>Wiadomości <span style={{fontSize: "medium"}}>{writeTo}</span></h1>
                <hr style={{border: "1px solid white"}}/>
                <div className="row ">
                    <div className="col s3">
                        <div class="row">
                            <div class="col s9">
                                <div className="input-field inline">
                                    <input style={{color: "rgb(51, 204, 204)"}} onChange={(e) => setUsername(e.target.value)} id="searchUser" type="text" class="validate"/>
                                    <label htmlFor="searchUser">Wyszukaj użytkownika</label>
                                </div>
                            </div>
                            <div class="col s3">
                                <a onClick={newMessage} className="btn-floating btn-large waves-effect waves-light red"><i
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
            <br></br><br></br><br></br><br></br><br></br>
            <Foot></Foot>
        </div>
    )

}