import React, {useEffect, useState} from "react";
import Axios from "axios";
import {Parallax} from 'react-parallax';
import {useHistory} from 'react-router-dom';
import Navbar from "../layout/Navbar";
import Carousel from "../layout/Carousel";
import Card from "../layout/Card";
import '../styles/Home.css'
import $ from "jquery";
import Foot from "../layout/Footer";
import home from '../img/HomeImg.jpg';
import { mdiDotsVertical } from "@mdi/js";
export default function Main(){

    const[role,setRole] = useState("");
    const history = useHistory();
    
    const[tmpImg1,setTmpImg1] = useState("");
    const[tmpImg2,setTmpImg2] = useState("");
    const[tmpImg3,setTmpImg3] = useState("");
    const[tmpImg4,setTmpImg4] = useState("");
const [isLoading,setLoading]=useState(true);
const licznik=0;

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
    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }
    //////////////////////////////////////
    async function runSetImages(img1,img2,img3,img4){
        await Promise.all([
            (async()=>console.log(await setImg1(img1)))(),
            await timeout(1000), 
            (async()=>console.log(await setImg2(img2)))(),
            await timeout(1000), 
            (async()=>console.log(await setImg3(img3)))(),
            await timeout(1000), 
            (async()=>console.log(await setImg4(img4)))(),      
            await timeout(1000),   
            setLoading(false),
            
        ]);
    }


    async function setImg1(img){
        await Axios.post('http://localhost:3001/getImage',
            {
                imgNum: img
            }).then((response)=> {
            setTmpImg1('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
            console.log("SET IMAGE 1");
          

        }).catch();
    }

    async function setImg2(img){
        await Axios.post('http://localhost:3001/getImage',
            {
                imgNum: img
            }).then((response)=> {
            setTmpImg2('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
            console.log("SET IMAGE 2");
            
        }).catch(
            
        )
    }

        async function setImg3(img){
            await Axios.post('http://localhost:3001/getImage',
                {
                    imgNum: img
                }).then((response)=> {
                setTmpImg3('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
                console.log("SET IMAGE 3");
                
            }).catch()
        }
            async function setImg4(img){
                await Axios.post('http://localhost:3001/getImage',
                    {
                        imgNum: img
                    }).then((response)=> {
                    setTmpImg4('data:image/png;base64,'+response.data.imgBase64.replace(/(\r\n|\n|\r)/gm, ""));
                    console.log("SET IMAGE 4");
                    
                }).catch()

            }
            const image1="https://www.goodfreephotos.com/albums/other-photos/numbers/red-number-1.png"

    //////////////////////////////////////
    if(typeof(tmpImg4) !== 'undefined' && tmpImg4 != null) {
        return (
            <div>
                {!isLoading && 
                <div>
                <Navbar/>
                <div className="row homeimg">
                    <div className="col s12">
                        
                <Parallax  bgImage={home} >
                    <div className="homeimg"style={{height:1000}} ></div>
            </Parallax>
            </div>
            </div> 
                <div className="container">
 
                <div className="row">
                    
                    <div class="col s12">
                    </div>
                    </div>
                    <div className="row rowaddAuctions">
                        <h3>Musisz Zobaczyć te rzeczy!</h3>
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
                <Foot></Foot>
           </div>
           
            }
                
                
            {isLoading&&
            <div class="back">
              <div class="wrapper">
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="shadow"></div>
              <div class="shadow"></div>
              <div class="shadow"></div>
              <span>Loading</span>
              
          </div>
          </div>
           }
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
                <Foot></Foot>
            </div>
        )
    }
}