import React,{useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import Navbar from "../layout/Navbar";
import "../styles/AddAuctions.css"
import $ from "jquery"
import M from "materialize-css"
import ImageUpload from "../components/ImageUpload"
import Foot from "../layout/Footer";
import { Select } from 'react-materialize';
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
               <div className="container">
                   <h1>Narzędzie dodawania ofert:</h1>
                    <div className="row rowaddAuctions">
                        <div className="col s12">
                            <h5>Podstawowe informacje na temat produktu:</h5>
                            <form>
                            <div className="input-field col s12">
                            <input id="nazwaProduktu" type="text" onChange={(e)=>setItemName(e.target.value) }/>
                            <label htmlFor="nazwaProduktu">Nazwa produktu</label>
                            </div>
                            <div className="col s12">
                            <div id="selectInput" className="input-field">
                            <Select
                            id="Select-9"
                            multiple={false}
                            label="Wybierz kategorie"
                            onChange={(e)=> {
                            setItemCategory(e.target.value);}}
                            options={{
                            classes: '',
                            dropdownOptions: {
                            alignment: 'left',
                            autoTrigger: true,
                            closeOnClick: true,
                            constrainWidth: true,
                            coverTrigger: true,
                            hover: false,
                            inDuration: 150,
                            onCloseEnd: null,
                            onCloseStart: null,
                            onOpenEnd: null,
                            onOpenStart: null,
                            outDuration: 250 }}}
                            value="1">
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
                    </Select>
                            </div>
                             </div>
                             <div className="input-field col s1">
                            <input id="quantity" type="text" onChange={(e)=>setItemQuant(e.target.value) }/>
                            <label htmlFor="quantity">ilość</label>
                            </div>
                            <div className="input-field col s1">
                            <input id="price" type="text" onChange={(e)=>setItemPrice(e.target.value) }/>
                            <label htmlFor="price">Cena</label>
                            </div>
                            </form>
                        </div>
                    </div>
                    <div className="row rowaddAuctions">
                        <div className="col s12">
                            <h5>Opis:</h5>
                            <form>
                            <div class="input-field col s12">
                            <textarea id="textarea" class="materialize-textarea inline"      onChange={(e)=>
                    setItemDesc(e.target.value)
                } ></textarea>
                            <label id="textAreaLabel" for="textarea " className="active">Textarea</label>
                            </div>
                            </form>
                        </div>
                    </div>
                    <div className="row rowaddAuctions">
                        <div className="col s12">
                            <h5>Dodaj zdjęcie:</h5>
                            <form>
                            <div class="input-field col s12">
                            <ImageUpload/>
                            </div>
                            </form>
                        </div>
                    </div>
                    <div className="row rowaddAuctions">
                        <div className="col s12">
                       
                            <form>
                            <div class="input-field col s10">
                            Jeżeli umieściełeś potrzebne informacje kliknij na przycisk po prawej stronie, który umieści ofrtę!
                            </div>
                            <div class="input-field col s1">
                            <div id="btnRow" className="row">
            <button onClick={addNewAuction} className="btn waves-effect waves-light" type="submit" name="action">Dodaj ofertę
                <i className="material-icons right">send</i>
            </button>
        </div>
                            </div>
                            </form>
                        </div>
                    </div>
               </div>
                <Foot></Foot>
            </div>
            );

}
