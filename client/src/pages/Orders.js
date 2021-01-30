import React,{useState, useEffect} from "react";
import Axios from "axios";

import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import Carousel from"../layout/Carousel";
import Card from"../layout/Card";
import '../styles/Home.css'
import Foot from "../layout/Footer";
import $ from "jquery";
import M from "materialize-css";
import { Modal, Button,Icon,Dropdown,Autocomplete } from 'react-materialize';

export default function Main(){

    const[role,setRole] = useState("");
    const[orders,setOrders] = useState("");

    const history = useHistory();

    let tmpId = " ";
    let tmpHref = " ";
    let text = " ";
    let tmpOrderPrice = 0;
    let licznik=0;
    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{
        getUserOrders();

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

    const getUserOrders=()=>{
        Axios.get("http://localhost:3001/getUserOrders").then((response) => {
            let ordersTmp = [];
            for(let i = 0; i<response.data.length;i++){
                ordersTmp.push(JSON.parse(response.data[i].orderItems));
                if(i===response.data.length-1){
                    setOrders(ordersTmp);
                    console.log(orders);
                }
            }

        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        let elems = document.querySelectorAll('.modal');
        let instances = M.Modal.init(elems);
    });
  
    const trigger = <Button className="btn simpleBtn deep-orange lighten-2" ><Icon left>people_outline</Icon>Zamówienie</Button>;

    const sendOpinion=(itemId,opinion)=>{
        console.log(opinion)
        Axios.post('http://localhost:3001/addOpinion',
            {
                itemId: itemId,
                opinion:document.getElementById(opinion).value
            }).then((response)=> {
        });
        
    };
    if(typeof(orders[0]) !== 'undefined' && orders[0] != null) {
        return (
            <div>
                <Navbar/>
                <div className="container">
                {orders.map((order, index) => (
                    <div className="row ">
                        <div>
                            <Modal  header={"Zamówiene nr."+(index+1)} trigger={trigger}>
                                {
                                    order.map((orderPart, index) => (
                                        <div className="row">
                                            <div className="col s3">
                                                <p>{"Przedmiot: "+orderPart.itemName}</p>
                                            </div>
                                            <div className="col s3">
                                                <p>{"ILOŚĆ: "+orderPart.itemQuantity}</p>
                                            </div>
                                            <div className="col s3">
                                                <p>{"CENA:"+orderPart.itemPrice}</p>
                                            </div>
                                            <p hidden="true">{tmpOrderPrice += orderPart.itemPrice}</p>
                                            <p hidden="true" id="itemId">{orderPart.id}</p>
                                            <div className="col s3">
                                            <p hidden="true">{licznik+=1}</p> 
                                            <p hidden="true">{text="Zamówiene nr."+(licznik)}</p> 
                                            <p hidden="true">{text=text+orderPart.itemId}</p> 
                                            
                                            <Dropdown
                                            id={text}
                                            options={{
                                            alignment: 'left',
                                            autoTrigger: true,
                                            closeOnClick: false,
                                            }}
                                            trigger={<Button node="button">Dodaj opinie</Button>}>
                                            <form> 
                                                             
                                            <input id="Opinion" type="text" className="xd" id={"input"+text} placeholder="Wprowadż opinie"></input>
                                            <Button onClick={sendOpinion.bind(null,orderPart.itemId,"input"+text)} node="button" type="submit"waves="light">
                                            Wyślij opinie
                                            <Icon right>
                                            send
                                            </Icon>
                                            </Button>
                                            </form>     
                                            </Dropdown>
                                            </div>
                                        </div>
                                     
                                    ))
             
                                }
                                <p>Kwota zamówienia: {tmpOrderPrice}zł</p>
                            </Modal>
                            <p hidden="true">{tmpOrderPrice=0}</p>
                        </div>
                        </div>    
                    ))}
                    
                    </div>
                    <Foot></Foot>
                </div>
            
        )
    }
    else{
        return(
            <div>
                <Navbar/>
                <div className="container">

                    <div className="row grey lighten-1">
                        <h3>Zamówienia</h3>
                    </div>
                </div>
                
                <Foot></Foot>
            </div>

        )
    }
}