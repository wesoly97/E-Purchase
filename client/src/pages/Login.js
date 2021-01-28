import React, {useState, useEffect} from "react"
import Axios from "axios"; //http request library
import { useHistory } from 'react-router-dom';
import "../styles/Register.css"

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
        <div className="main">
            <div>
                <div>
                <h1>Login</h1>
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Username..."
                    onChange={(e)=>
                        setUsername(e.target.value)
                    }
                />
                <label>Password</label>
                <input type="password"
                       placeholder="Password..."
                       onChange={(e)=>
                           setPassword(e.target.value)
                       }
                />
                <button onClick={login} className="btn waves-effect waves-light" type="submit" name="action">Login
                    <i className="material-icons right">send</i>
                </button>

            </div>

        </div>
            <br></br><br></br><br></br>
            <div>
                <h5>Nie masz konta?
                    <button id="btnGoToRegsiter" onClick={goToRegister} className="btn waves-effect amber" type="submit" name="action">Zarejestruj się...
                        <i className="material-icons right">account_circle</i>
                    </button>
                </h5>
            </div>
         
        </div>
    );
}