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
        else if (!city.match(/^[a-zA-Z\W]+$/)) {
            Materialize.toast({html: "Niedozwolone znaki w nazwie miasta!"});
        }

        // Checking post-code (xx-xxx)
        else if (!postCode.match(/[0-9][0-9]\-[0-9][0-9][0-9]/)) {
            Materialize.toast({html: "Nieprawidłowy kod pocztowy (XX-XXX)!"});
        }

        // Checking street
        else if (!street.match(/[[a-zA-Z]+\W]*[0-9]*[\/]*[0-9]*/)) {
            Materialize.toast({html: "Nieprawidłowy adres"});
        }

        // Checking phone number
        else if (!phoneContact.match(/[0-9]/)) {
            Materialize.toast({html: "Numer telefonu może zawierać tylko cyfry!"});
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
        <div className="bodyRegister">    
<div className="animation">
<div className="row">
<div className="col s12 ">
<h1><span className="eLetter">E-</span><span className="restLetter">PURCHASE</span></h1> 
<h5 className="brown-text">Proszę, Zarejestruj się!</h5>
</div></div>
        <div className="container containerRegister ">
            
        <div className="row rowRegister">
       
        <form className="col s12 ">
        <h4>Dane osobowe:</h4>
          <div className="row rowRegister">
            <div className="input-field col s6">
              
              <label for="Username">Username</label>
              <input id="Username" type="text" onChange={(e)=>setUsernameReg(e.target.value)}  />
            </div>
            <div className="input-field col s6">
            
            <label for="password">Password</label>
            <input id="password" type="password"onChange={(e)=> setPasswordReg(e.target.value)} />
          </div>
            </div>
          <div className="row rowRegister">
            <div className="input-field col s6">
            
              <label for="name">Name</label>
              <input id="name" type="text"onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="input-field col s6 ">
            
            <label for="Surname">Surname</label>
            <input id="Surname" type="text"onChange={(e)=>setSurname(e.target.value)}/>
          </div>
          </div>
          <div className="row rowRegister">
          <h4 class="left-center">Adres:</h4>
            <div className="input-field col s6">
            
              <label for="City">City</label>
              <input id="City" type="text"onChange={(e)=>setCity(e.target.value)} />
            </div>
            <div className="input-field col s6 ">
            
            <label for="Postcode">Post code</label>
            <input id="Postcode" type="text" onChange={(e)=>setPostCode(e.target.value)}/>
          </div>
          </div>  
          
          <div className="row rowRegister">
            <div className="input-field col s6">
            
              <label for="Street">Street</label>
              <input id="Street" type="text"onChange={(e)=>setStreet(e.target.value)} />
            </div>
            <div className="input-field col s6 ">
            
            <label for="Phonenumber">Phone number</label>
            <input id="Phonenumber" type="text" onChange={(e)=>setPhoneContact(e.target.value)}/>
          </div>
          </div>      
              </form>

             <button onClick={register} className="btn waves-effect waves-light btnRegister brown darken-3" type="submit" name="action">Register
             <i className="material-icons right">send</i>
             </button>
             <h5>Posiadasz konto? Zaloguj sie
             <button  onClick={goToLogin}  className="btn waves-effect amber btnLogin" type="submit" name="action">Zaloguj się...
             <i className="material-icons right">account_circle</i>
             </button>
             </h5>
              </div>
            
              </div>
              </div> 
              </div>
    );
}