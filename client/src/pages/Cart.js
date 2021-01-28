import React,{useState, useEffect} from "react";
import Axios from "axios";

import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import "../styles/Cart.css"
import $ from "jquery";
import Foot from "../layout/Footer";
export default function Main(){

    const[role,setRole] = useState("");
    const[cartContent, setCartContent] = useState("")

    const history = useHistory();

    let tmpItemImageSrc = " ";
    let tmpItemId = " "


    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{
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
                Axios.post("http://localhost:3001/getCartContent").then((resp)=>{
                    const x = resp.data;
                    setCartContent(x); //genialne <3
                    //console.log(x.data[0].itemName);
                });
            }
            else{
                history.push("/login");
            }
        });
    },[]);

    const addToCart=(itemId)=>{
        Axios.post('http://localhost:3001/addItemToCart',
            {
                itemId: itemId
            }).then((response)=> {
            window.location.reload(false);
        });
        window.location.reload(false);
    };

    const outFromCart=(itemId)=>{
        Axios.post('http://localhost:3001/removeItemFromCart',
            {
                itemId: itemId
            }).then((response)=> {
        });
        window.location.reload(false)
    };

    const submitCart=()=>{
        Axios.post('http://localhost:3001/submitCart',
            {
            }).then((response)=> {
        });
        window.location.reload(false)
    };

    const clearCart=(itemId)=>{
        Axios.post('http://localhost:3001/clearCart',
            {
                itemId: itemId
            }).then((response)=> {
        });
        window.location.reload(false);
    };

    if(typeof(cartContent[0]) !== 'undefined' && cartContent[0] != null) {
        return (
            <div>
                <Navbar/>
                <h1>Koszyk</h1>
                <div className="row">

                    <div className="col s2"></div>
                    <div className="col s8">
                        <table className="striped">
                            <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Ilość</th>
                                <th>Zdjęcie</th>
                                <th>Cena</th>
                                <th></th>
                            </tr>
                            </thead>

                            {/*Loop from db*/}
                            {cartContent.map((item, index) => (
                                <tr>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <p hidden="true">{tmpItemImageSrc = 'data:image/png;base64,'+item.itemImage64}</p>
                                    <img src={tmpItemImageSrc}/>
                                    <td>{item.price * item.quantity}zł</td>
                                    <td>
                                        <a id="btnMinusItem" onClick={clearCart.bind(null,item.itemId)} className="btn-floating btn-large waves-effect waves-light red"><i
                                            className="material-icons">remove_shopping_cart</i></a>
                                        <a id="btnMinusItem" onClick={outFromCart.bind(null,item.itemId)} className="btn-floating btn-large waves-effect waves-light red"><i
                                            className="material-icons">exposure_neg_1</i></a>
                                        <a id="btnAddItem" onClick={addToCart.bind(null,item.itemId)} className="btn-floating btn-large waves-effect waves-light green"><i
                                            className="material-icons">exposure_plus_1</i></a>

                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                    <div className="col s2">
                        <button onClick={submitCart} className="btn waves-effect blue" type="submit" name="action">Do kasy...
                            <i className="material-icons right">monetization_on</i>
                        </button>
                    </div>
                </div>
                <Foot></Foot>
            </div>
        )
    }
    else{
        return(
            <div>
                <Navbar/>
                <h1>Koszyk</h1>
                <Foot></Foot>
            </div>
            
        )
    }
}