import React,{useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import "../styles/AddAuctions.css"
import $ from "jquery"
import M from "materialize-css"
import ImageUpload from "../components/ImageUpload"

//#4db6ac

export default function AddAuction(){

        const[role,setRole] = useState("");

        const[itemName,setItemName] = useState("");
        const[itemCategory,setItemCategory] = useState(1);
        const[itemDesc,setItemDesc] = useState("");
        const[itemQuant,setItemQuant] = useState("");
        const[itemPrice,setItemPrice] = useState("");

        const history = useHistory();

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
            ////////////////////////////////////////////////////////////////////////////

        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setRole(response.data.user[0].role);
            } else {
                history.push("/register");
            }
        });

        },[]);

        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);
        });


        const addNewAuction=()=>{
            let imgBase64 = getBase64Image(document.getElementById("uploadedImg"));

            Axios.post("http://localhost:3001/addNewAuctions",{
                itemName: itemName,
                itemCategory: itemCategory,
                itemDesc: itemDesc,
                itemQuant: itemQuant,
                itemPrice: itemPrice,
                imgBase64: imgBase64,
            }).then((response) => {

            });
            history.push("/auctions")
        };

        //Change img to base64 string
        function getBase64Image(img) {
            let canvas = document.createElement("canvas");
            canvas.width = 128;//img.width;
            canvas.height = 128;//img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0,128,128);
            let dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }


        return(
            <div>
                <Navbar/>
                <div className="row">
                    <div className="col s1">

                    </div>
                    <div className="col s5">
                        <h3 id="napisDodaj" className="textWhite"><b>Dodaj nową ofertę</b></h3>
                        <form id="newOfferForm">

                            <div className="row">
                                <label className="textWhite" htmlFor="last_name"><b>Nazwa produktu:</b></label>
                                <input
                                    id="itemName"
                                    type="text"
                                    className="validate"
                                    onChange={(e)=>
                                        setItemName(e.target.value)
                                    }
                                />
                            </div>

                            <br></br><br></br>
                            <div className="row">
                                <label id="labelKategoria" htmlFor="itemKategoria" className="textWhite"><b>Kategoria:</b></label>
                                <div id="selectInput" className="input-field">
                                    <select
                                        id="itemKategoria"
                                        onChange={(e)=> {
                                            setItemCategory(e.target.value);
                                        }
                                        }
                                    >
                                        <optgroup label="AGD">
                                            <option value="1">Telewizory</option>
                                            <option value="2">Pralki</option>
                                            <option value="3">Lodówki</option>
                                        </optgroup>
                                        <optgroup label="Komputery i laptopy">
                                            <option value="4">Podzespoły komputerowe</option>
                                            <option value="5">Myszki</option>
                                            <option value="6">Klawiatury</option>
                                        </optgroup>
                                        <optgroup label="Ubrania">
                                            <option value="7">Koszulki męskie</option>
                                            <option value="8">Koszulki damskie</option>
                                            <option value="9">Krawaty</option>
                                        </optgroup>
                                    </select>


                                </div>
                            </div>

                            <br></br><br></br>
                            <div className="row">
                                <label htmlFor="itemTextAre" className="textWhite"><b>Szczegółowy opis:</b></label>
                                <textarea
                                    id="itemTextAre"
                                    className="materialize-textarea"
                                    onChange={(e)=>
                                        setItemDesc(e.target.value)
                                    }
                                ></textarea>
                            </div>

                            <br></br><br></br>
                            <div className="row">
                                <label htmlFor="last_name" className="textWhite"><b>Ilosc dostępnych sztuk: </b></label>
                                <input
                                    id="itemCena"
                                    type="text"
                                    className="validate"
                                    onChange={(e)=>
                                        setItemQuant(e.target.value)
                                    }
                                />szt
                            </div>

                            <br></br><br></br>
                            <div className="row">
                                <label htmlFor="last_name" className="textWhite"><b>Cena jednostkowa produktu: </b></label>
                                <input
                                    id="itemCena"
                                    type="text"
                                    className="validate"
                                    onChange={(e)=>
                                        setItemPrice(e.target.value)
                                    }
                                />zł
                            </div>


                        </form>


                    </div>
                    <div id="imageCol" className="col s4">
                            <ImageUpload/>
                    </div>
                    <div id="divSubmit" className="col s2">
                        <form>
                            <div id="btnRow" className="row">
                                <button onClick={addNewAuction} className="btn waves-effect waves-light" type="submit" name="action">Dodaj ofertę
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
            );

}
