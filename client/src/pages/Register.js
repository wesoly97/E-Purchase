import React, {useState, useEffect} from "react"
import Axios from "axios"; //http request library
import { useHistory } from 'react-router-dom';

export default function Register(){
    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState("");

    const history = useHistory();

    Axios.defaults.withCredentials = true;

    const register = () =>{
        Axios.post('http://localhost:3001/register',
            {
                username: usernameReg,
                password: passwordReg
            }).then((response)=> {
            console.log(response);
        });
    }

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

    const logout=()=>{
        Axios.post('http://localhost:3001/logout').then(r => {})
        setLoginStatus(false);
    };

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setLoginStatus(response.data.user[0].username);
            }
        });
    }, []);

    return(
        <div className="App">
            <div>
                <h1>Register</h1>
                <label>Username</label>
                <input
                    type="text"
                    onChange={(e)=>
                        setUsernameReg(e.target.value)
                    }
                />
                <label>Password</label>
                <input
                    type="text"
                    onChange={(e)=>
                        setPasswordReg(e.target.value)
                    }
                />
                <button onClick={register}>Register</button>
            </div>
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
                <button onClick={login}>Login</button>
            </div>
            <button onClick={logout}>LOGOUT</button>
            <h1>{loginStatus}</h1>
        </div>
    );
}