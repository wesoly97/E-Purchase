import React, {useState, useEffect} from "react"
import Axios from "axios"; //http request library
import { useHistory } from 'react-router-dom';
import "../styles/Register.css"
import Materialize from "materialize-css";

export default function Register(){
    //User data to register
    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [city, setCity] = useState('');
    const [postCode, setPostCode] = useState('');

    const [street, setStreet] = useState("");
    const [phoneContact, setPhoneContact] = useState("");

    const history = useHistory();
    const [loginStatus, setLoginStatus] = useState("");
    //
    Axios.defaults.withCredentials = true; //enable cookies

    const register = () =>{
        // Checking username
        if (!usernameReg.match(/^[a-zA-Z0-9_]+$/)){
            Materialize.toast({html: "Nazwa użytkownika niepoprawna!"});
        }

        // Checking password
        else if (!passwordReg.match(/^[\w\W]+$/) || passwordReg === "" || passwordReg.length < 6){
            Materialize.toast({html: "Hasło musi zawierać inne znaki lub jest za krótkie!"});
        }

        // Checking name
        else if (!name.match(/^[a-zA-Z]+$/)) {
            Materialize.toast({html: "Niedozwolone znaki w imieniu!"});
        }

        // Checking surname
        else if (!surname.match(/^[a-zA-Z]+$/)) {
            Materialize.toast({html: "Niedozwolone znaki w nazwisku!"});
        }

        // Checking city
        else if (!city.match(/[a-zA-Z]+\W*/)) {
            Materialize.toast({html: "Niedozwolone znaki nazwie miasta!"});
        }

        // If everything is OK
        else{
            Axios.post('http://localhost:3001/register',
                {
                    username: usernameReg,
                    password: passwordReg,
                    name: name,
                    surname: surname,
                    city: city,
                    postCode: postCode,
                    street: street,
                    phoneNumber: phoneContact
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
        }
    };

    const goToLogin=()=>{
      history.push("/login");
    };


    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setLoginStatus(response.data.user[0].username);
            }
        });

    }, []);

    // Changing first letter to upper case after changing state of variables (name, surname, city)
    useEffect(() => {
        setName(name.charAt(0).toUpperCase() + name.slice(1));
        setSurname(surname.charAt(0).toUpperCase() + surname.slice(1));
        setCity(city.charAt(0).toUpperCase() + city.slice(1));
    }, [name, surname, city]);

    return(
        <div className="main">
                    <h1>Register</h1>
                        <div className="row">
                            <div className="col s4">
                                <label>Username</label>
                                <input
                                    type="text"
                                    onChange={(e)=>
                                        setUsernameReg(e.target.value)
                                    }
                                />
                                <label>Password</label>
                                <input
                                    type="password"
                                    onChange={(e)=>
                                        setPasswordReg(e.target.value)
                                    }
                                />
                            </div>
                            <div className="col s4">
                                <label>Name</label>
                                <input
                                    type="text"
                                    onChange={(e)=>
                                        setName(e.target.value)
                                    }
                                />

                                <label>Surname</label>
                                <input
                                    type="text"
                                    onChange={(e)=>
                                        setSurname(e.target.value)
                                    }
                                />
                            </div>
                            <div className="col s4">
                                <label>City</label>
                                <input
                                    type="text"
                                    onChange={(e)=>
                                        setCity(e.target.value)
                                    }
                                />

                                <label>Post code</label>
                                <input
                                    type="text"
                                    onChange={(e)=>
                                        setPostCode(e.target.value)
                                    }
                                />

                                <label>Street</label>
                                <input
                                    type="text"
                                    onChange={(e)=>
                                        setStreet(e.target.value)
                                    }
                                />

                                <label>Phone number</label>
                                <input
                                    type="text"
                                    onChange={(e)=>
                                        setPhoneContact(e.target.value)
                                    }
                                />


                                <button onClick={register} className="btn waves-effect waves-light" type="submit" name="action">Register
                                    <i className="material-icons right">send</i>
                                </button>

                                <button id="btnGoToRegsiter" onClick={goToLogin}  className="btn waves-effect amber" type="submit" name="action">Zaloguj się...
                                    <i className="material-icons right">account_circle</i>
                                </button>
                            </div>
                        </div>
        </div>
    );
}