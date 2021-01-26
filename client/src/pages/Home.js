import React, {useEffect, useState} from "react";
import Axios from "axios";

import {useHistory} from 'react-router-dom';
import Navbar from "../layout/Navbar";
import Carousel from "../layout/Carousel";
import Card from "../layout/Card";
import '../styles/Home.css'
import $ from "jquery";
import logo from "../img/1.jpg"

export default function Main(){

    const[role,setRole] = useState("");
    const history = useHistory();

    const[tmpImg1,setTmpImg1] = useState("");
    const[tmpImg2,setTmpImg2] = useState("");
    const[tmpImg3,setTmpImg3] = useState("");
    const[tmpImg4,setTmpImg4] = useState("");

    Axios.defaults.withCredentials = true;//zajebiscie wazne
    useEffect(()=>{
        createThreeImages().then(r => console.log(","));
        //let img2 = getImage(imgNums[1]);
        //let img3 = getImage(imgNums[2]);
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


    async function createThreeImages(){
        await Axios.get('http://localhost:3001/getNumberOfImages',
                {
                }).then((response)=> {
                    let imgNum = response.data;
                    runSetImages(imgNum[0], imgNum[1], imgNum[2], imgNum[3]).then(r  => console.log("test"))
                }
    )}

    //////////////////////////////////////
    async function runSetImages(img1,img2,img3,img4){
        await Promise.all([
            (async()=>console.log(await setImg1(img1)))(),
            (async()=>console.log(await setImg2(img2)))(),
            (async()=>console.log(await setImg3(img3)))(),
            (async()=>console.log(await setImg4(img4)))(),
        ]);
    }


    async function setImg1(img){
        await Axios.post('http://localhost:3001/getImage',
            {
                imgNum: img
            }).then((response)=> {
            setTmpImg1('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
            console.log("SET IMAGE 1");
        });
    }

    async function setImg2(img){
        await Axios.post('http://localhost:3001/getImage',
            {
                imgNum: img
            }).then((response)=> {
            setTmpImg2('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
            console.log("SET IMAGE 2");
        });
    }

    async function setImg3(img){
        await Axios.post('http://localhost:3001/getImage',
            {
                imgNum: img
            }).then((response)=> {
            setTmpImg3('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
            console.log("SET IMAGE 3");
        });
    }

    async function setImg4(img){
        await Axios.post('http://localhost:3001/getImage',
            {
                imgNum: img
            }).then((response)=> {
            setTmpImg4('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
            console.log("SET IMAGE 4");
        });
    }

    window.onload = function() {
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
            window.location.reload();
        }
    }

    //////////////////////////////////////
    if(typeof(tmpImg4) !== 'undefined' && tmpImg4 != null) {
        return (
            <div>
                <Navbar/>
                <div className="container">
                    <Carousel/>
                    <div className="row grey lighten-1">
                        <h3>Najbardziej popularne!</h3>
                        <div className="col s8 m5 l3 center-align">
                            <Card
                                tmpImg={tmpImg1}
                            />
                        </div>
                        <div className="col s8 m5 l3 center-align">
                            <Card
                                tmpImg={tmpImg2}
                            />
                        </div>
                        <div className="col s8 m5 l3 center-align">
                            <Card
                                tmpImg={tmpImg3}
                            />
                        </div>
                        <div className="col s8 m5 l3 center-align">
                            <Card
                                tmpImg={tmpImg4}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                <Navbar/>
                <div className="container">
                    <Carousel/>
                    <div className="row grey lighten-1">
                        <h3>Najbardziej popularne!</h3>
                        <div className="col s8 m5 l3 center-align">
                            <Card

                            />
                        </div>
                        <div className="col s8 m5 l3 center-align">
                            <Card

                            />
                        </div>
                        <div className="col s8 m5 l3 center-align">
                            <Card

                            />
                        </div>
                        <div className="col s8 m5 l3 center-align">
                            <Card

                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}