import React, {useState, useEffect} from "react"
import Axios from "axios"; //http request library
import { useHistory } from 'react-router-dom';
import "../styles/login.css"
import { mdiLogin, mdiAccountPlusOutline } from '@mdi/js';
import Icon from '@mdi/react'
import Materialize from "materialize-css";
export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState("");

    const history = useHistory();

    Axios.defaults.withCredentials = true;

    const login = () =>{
        Axios.post('http://localhost:3001/login',
            {
                username: username,
                password: password
            }).then((response)=> {
            if(response.data.message){
                console.log(response);
                setLoginStatus(response.data.message);
                Materialize.toast({html: response.data.message}); // alert when user does not exist or wrong credentials
            }
            else{
                console.log(response);
                setLoginStatus(response.data[0].username);
                history.push("/");
            }
        });
    };

    const goToRegister=()=>{
      history.push("/register");
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setLoginStatus(response.data.user[0].username);
            }
        });
    }, []);

    return(
<div className="bodyLogin">    
<div className="animation">
<div className="row">
<div className="col s12 ">
<h1 class="size"><span className="eLetter">E-</span><span className="restLetter">PURCHASE</span></h1> 
<h5 className="brown-text size">Proszę, Zaloguj się do swojego konta</h5>
</div></div>
        <div className="container containerLogin ">
            
        <div className="row rowLogin">
       
        <form className="col s12 ">
          <div className="row rowLogin">
            <div className="input-field col s12">
            <input id="Username" type="text" onChange={(e)=>setUsername(e.target.value) }/>
              <label for="Username">Username</label>
            </div>
            </div>
          <div className="row rowLogin">
            <div className="input-field col s12">
            <input type="password"onChange={(e)=>setPassword(e.target.value)}/>
              <label for="password">Password</label>
            </div>
          </div>
         
              </form>

              <button onClick={login} className="btn waves-effect waves-light brown darken-3 btnlogin" type="submit" name="action">Login
        <i className="material-icons right"><Icon path={mdiLogin} title="Log in"size={1} color="white"/></i>
    </button>

 
    <h5 class="size">Nie masz konta?
        <button id="btnGoToRegsiter" onClick={goToRegister} className="btn waves-effect amber btnReg" type="submit" name="action">Zarejestruj się...
            <i className="material-icons right"><Icon path={mdiAccountPlusOutline} title="Log in"size={1} color="brown"/></i>
        </button>
    </h5>
              </div>
            
              </div>
              </div> 
              </div>
    );
}