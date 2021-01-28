import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import "../styles/Auctions.css"
import $ from "jquery"
import M from "materialize-css"
import { Modal, Button, Icon, Checkbox } from 'react-materialize';


import { Modal, Button, Icon } from 'react-materialize';
import Foot from "../layout/Footer";
export default function Main() {

    const [role, setRole] = useState("");
    const [itemsToShow, setItemsToShow] = useState("");
    const [opinionsToShow, setOpinionsToShow] = useState("");
    const [category, setCategory] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("")

    let tempItemId = " ";
    let temItemName = " ";
    let tmpItemPrice = " ";

    const history = useHistory();

    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(() => {
        getCategories();
        //jQuerry reload page once after load to make 'select' work - stupid but works
        $(document).ready(function () {
            if (document.URL.indexOf("#") === -1) {
                let url = document.URL + "#";
                window.location = "#";
                window.location.reload(true);
            }
        });

        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setRole(response.data.user[0].role);
                //Get items from database
                Axios.get("http://localhost:3001/getAllAuctions").then((response) => {
                    setItemsToShow(response.data); //genialne <3

                });
                Axios.get("http://localhost:3001/getAllOpinions").then((response) => {
                    setOpinionsToShow(response.data); //genialne <3

                });
            }
            else {
                history.push("/login");
            }
        });

    }, []);

    const addAuction = () => {
        history.push("/addAuction");
    };

    const getImage = (imgNum) => {
        Axios.post('http://localhost:3001/getImage',
            {
                imgNum: imgNum
            }).then((response) => {
                //console.log(response.data.imgBase64);
                let img64 = response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, "");
                document.getElementById(imgNum)
                    .setAttribute(
                        'src', 'data:image/png;base64,' + img64
                    );
            });
    }

    const getCategories = () => {
        Axios.get('http://localhost:3001/getItemCategory',
            {
            }).then((response) => {
                setCategory(response.data);
                setCategoryFilter(response.data);
            });

    };


    const addToCart = (itemId, itemName, price) => {
        //get parent id (item id) and add it to table cart with user id
        //itemId
        Axios.post('http://localhost:3001/addItemToCart',
            {
                itemId: itemId,
                itemName: itemName,
                itemPrice: price
            }).then((response) => {
            });
    };


    document.addEventListener('DOMContentLoaded', function () {
        let elems = document.querySelectorAll('.modal');
        let instances = M.Modal.init(elems);
    });


    function Opinion(props) {
        if (opinionsToShow[0] !== 'undefined' && opinionsToShow[0] != null) {
            let opinionFiltered = opinionsToShow.filter(opinionsToShow => opinionsToShow.itemId === props.id)
            if (opinionFiltered.length > 0) {


                return <p>{opinionFiltered.map((item, index) => (<p><b>Opinia:</b>    {item.contents}</p>))}</p>;
            }
            else {
                return <h1>Brak opinii</h1>;
            }
        }
        return <h1>Brak opinii</h1>;
    }


    const trigger = <Button className="btn simpleBtn deep-orange lighten-2" ><Icon left>people_outline</Icon>Sprawdź opinie!</Button>;

    const test = () => {
        console.log("test");
    };

    if (typeof (itemsToShow[0]) !== 'undefined' && itemsToShow[0] != null && categoryFilter[0] !== 'undefined' && categoryFilter[0] != null) {
        return (

            <div>
                <Navbar />
                <div className="container">
                    <div className="row">

                        <div className="col s4">
                            <div className="row">
                                <h1>Aukcje</h1>
                                <button onClick={addAuction} className="btn waves-effect waves-light" type="submit" name="action">Dodaj
                                aukcję
                                <i className="material-icons right">send</i>
                                </button>
                            </div>
                            <br></br>
                            <div className="row">
                                <h1>Kategorie</h1>
                                {category.map((item, index) => (
                                    <div>
                                        <Checkbox
                                            id={"category" + index + 1}
                                            label={item.name}
                                            value={index + 1}
                                            onChange={test.bind(null)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col s8">
                            <div className="listWrapper">
                                <div id="opinions" className="right">
                                    <ul className="collection">
                                        {/*listing of items*/}
                                        {itemsToShow.map((item, index) => (
                                            <li className="collection-item ">
                                                <div key={index}>
                                                    <div className="row">
                                                        <div className="col s6">
                                                            <p><b>Nazwa:</b>    {item.name}</p>
                                                            <p><b>Kategoria: </b> {category[item.id_category - 1].name}</p>
                                                            <p><b>Opis:</b>     {item.description}</p>
                                                            <p><b>Ilosc:</b>    {item.quantity}szt</p>
                                                            <p><b>Cena:</b>     {item.price}zł</p>
                                                        </div>
                                                        <div id="imgDiv" className="col s6">
                                                            <img id={item.id} width="50%" height="50%" />
                                                            {getImage(item.id)}
                                                        </div>
                                                    </div>

                                                    <p hidden="true">{tempItemId = item.id}</p>
                                                    <p hidden="true">{temItemName = item.name}</p>
                                                    <p hidden="true">{tmpItemPrice = item.price}</p>
                                                    <a onClick={addToCart.bind(null, tempItemId, temItemName, tmpItemPrice)} className="waves-effect waves-light btn"><i className="material-icons left">add_shopping_cart</i>Dodaj do koszyka</a>
                                                    <a className="waves-effect amber btn simpleBtn"><i className="material-icons left">monetization_on</i>Kup teraz</a>
                                                    <Modal header={"Nazwa przedmiotu: " + item.name} trigger={trigger}>
                                                        <Opinion id={tempItemId}></Opinion>
                                                    </Modal>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <Foot></Foot>
            </div>
        )
    }
    else {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="row">
                        <div className="col s4">
                            <h1>AUKCJE</h1>
                            <button onClick={addAuction} className="btn waves-effect waves-light" type="submit" name="action">Dodaj aukcję
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </div>
                <Foot></Foot>
            </div>
        )
    }
}