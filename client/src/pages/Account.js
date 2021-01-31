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
    const[money,setMoney] = useState("");
    const[isVerified,setisVerified] = useState("");
    const[orders,setOrders] = useState("");
    const[stars,setStars] = useState(0);

    let tmpImg = " ";
    const numbers = [1, 2, 3, 4, 5];

    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems);
      });


    const addMoney = (amounts) =>{
        Axios.post('http://localhost:3001/addMoney',
            {
                amount:amounts
            }).then((response)=> {
                    
                });
                window.location.reload(false);
    };
    const subMoney = (amounts) =>{
        Axios.post('http://localhost:3001/subMoney',
            {
                amount:amounts
            }).then((response)=> {

                });
                window.location.reload(false);
    };

    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{

        //jQuerry reload page once after load to make 'select' work - stupid but works
        accountInfo();
        getUserOrders();
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

    const accountInfo = () =>{
        Axios.get('http://localhost:3001/accountInfo',
        ).then((response)=> {
            setNick(response.data[0].res1.username);
            setName(response.data[0].res1.name);
            setSurname(response.data[0].res1.surname);
            setMoney(response.data[0].res2.value);
            setisVerified(response.data[0].res1.isVerified);
        });
    }

    const getUserOrders=()=>{
        Axios.get("http://localhost:3001/getUserOrders").then((response) => {
            let ordersTmp = [];
            for(let i = 0; i<response.data.length;i++){
                ordersTmp.push(JSON.parse(response.data[i].orderItems));
                if(i===response.data.length-1){
                    setOrders(ordersTmp);
                }
            }

        });
    }

    const getNumberOfOpinions=()=>{
        Axios.get("http://localhost:3001/getNumberOfOpinions").then((response) => {
        setStars(response.data.result[0].number)
        });
    }

    const setVerified = (stars) => {
        Axios.post('http://localhost:3001/setVerified',
            {
                number:stars
            }).then((response) => {
            });
    };



    function setImg(img, id1, id2){
        Axios.post('http://localhost:3001/getImage',
            {
                imgNum: img
            }).then((response)=> {
            let img64 = response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, "");
            document.getElementById("img"+id1+id2)
            .setAttribute(
                'src', 'data:image/png;base64,'+img64
            );
        });
    }

    if(typeof(orders[0]) !== 'undefined' && orders[0] != null) {
    return(
        
        <div>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col s6">
                        <h1 class="dontmove">Informacje o koncie</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col s6">
                        <br></br>
                        <h3><b>Nick:</b> {nick}</h3>
                        <h3><b>Imie: </b>{name}</h3>
                        <h3><b>Nazwisko:</b> {surname}</h3>
                        <h3><b>Reputacja: </b></h3>
                        {
                            
                            setVerified(stars),
                            getNumberOfOpinions(),
                            numbers.map((number) =>
                            number<=stars &&
                            <a className="btn-floating tooltipped pulse" data-position="bottom" data-tooltip="Skala reputacji do max 5 gwiazdek, zalezy od zainteresowania użytkowników"><i className=" material-icons">star</i></a>
                            )
                        }
                        <h3><b>Zweryfikowany : </b>
                        {isVerified==1 &&
                        <a className="btn-floating tooltipped green pulse" data-position="bottom" data-tooltip="Aby być zweryfikowanym musisz mieć conajmniej 3 gwiazdki reputacji"><i className="material-icons">done</i></a>
                        }
                        {isVerified==0 &&
                        <a className="btn-floating tooltipped red pulse" data-position="bottom" data-tooltip="Aby być zweryfikowanym musisz mieć conajmniej 3 gwiazdki reputacji"><i className="material-icons">close</i></a>
                        }</h3>
                        {console.log(isVerified)}
                    </div>
                    <div className="col s6">
                        <h2>Historia Zakupów</h2>
                        <div className="listWrapperr">
                            <div id="buyingHistory" className="right"></div>
                            <ul className="collection">
                                {/*listing of bought products*/}
                                {orders.map((order, index1) => (
                                        order.map((orderPart, index2) => (
                                            //setImg(orderPart.itemId),
                                            <li class="collection-item avatar ">
                                                <p hidden="true">{tmpImg = "img"+index1+index2}</p>
                                                <img id={tmpImg}  className="circle"></img>
                                                {setImg(orderPart.itemId, index1, index2)}
                                                <span className="title"><h6>{orderPart.itemName}</h6></span>
                                                <p id="description">Cena: {orderPart.itemPrice+"zł"}<br></br>
                                                Ilość: {orderPart.itemQuantity}
                                                <a href="/message" className="secondary-content tooltipped" data-position="bottom" data-tooltip="Wyslij wiadomosc do sprzedajacego"><i className="material-icons">mail</i></a>
                                                </p> 
                                            </li>
                                        ))
                                ))}
                            </ul>
                        </div>
                    </div>
                    </div>
                <div className="row">
                        <div className="col s6">
                            <h1 class="dontmove">Stan konta:</h1>
                            <h3 id="h3money">{money} zł</h3>
                            
                            <button onClick={addMoney.bind(null,100)}className="btn waves-effect waves-light tooltipped green " type="submit" name="action" data-position="bottom" data-tooltip="Dodaj pieniadze">
                            <i className=" material-icons">attach_money</i>
                            </button>

                            <button onClick={subMoney.bind(null,100)} className="btn waves-effect waves-light tooltipped red" type="submit" name="action" data-position="bottom" data-tooltip="Usun pieniadze">
                            <i className=" material-icons">money_off</i>
                            </button>

                        </div>

                    </div>
                </div>
                <Foot></Foot>
            </div>
        
    )
    }
    else {
        return(
            <div>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col s6">
                        <h1 class="dontmove">Informacje o koncie</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col s6">
                        <br></br>
                        <h3><b>Nick:</b> {nick}</h3>
                        <h3><b>Imie: </b>{name}</h3>
                        <h3><b>Nazwisko:</b> {surname}</h3>
                        <h3><b>Reputacja: </b></h3>
                        {
                            
                            setVerified(stars),
                            getNumberOfOpinions(),
                            numbers.map((number) =>
                            number<=stars &&
                            <a className="btn-floating tooltipped pulse" data-position="bottom" data-tooltip="Skala reputacji do max 5 gwiazdek, zalezy od zainteresowania użytkowników"><i className=" material-icons">star</i></a>
                            )
                        }
                        <h3><b>Zweryfikowany : </b>
                        {isVerified==1 &&
                        <a className="btn-floating tooltipped green pulse" data-position="bottom" data-tooltip="Aby być zweryfikowanym musisz mieć conajmniej 3 gwiazdki reputacji"><i className="material-icons">done</i></a>
                        }
                        {isVerified==0 &&
                        <a className="btn-floating tooltipped red pulse" data-position="bottom" data-tooltip="Aby być zweryfikowanym musisz mieć conajmniej 3 gwiazdki reputacji"><i className="material-icons">close</i></a>
                        }
                        {console.log(isVerified)}
                        </h3>
                    </div>
                    <div className="col s6">
                        <h2>Historia Zakupów</h2>
                        <div className="listWrapperr">
                            <div id="buyingHistory" className="right"></div>
                            <ul className="collection">
                                {/*listing of bought products*/}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s6">
                        <h1 class="dontmove">Stan konta:</h1>
                        <h3 id="h3money">{money} zł</h3>

                        <button onClick={addMoney.bind(null,100)}className="btn waves-effect waves-light tooltipped green " type="submit" name="action" data-position="bottom" data-tooltip="Dodaj pieniadze">
                            <i className=" material-icons">attach_money</i>
                        </button>

                        <button onClick={subMoney.bind(null,100)} className="btn waves-effect waves-light tooltipped red" type="submit" name="action" data-position="bottom" data-tooltip="Usun pieniadze">
                            <i className=" material-icons">money_off</i>
                        </button>

                    </div>

                </div>
            </div>
            <Foot></Foot>
        </div>)
    }
}
