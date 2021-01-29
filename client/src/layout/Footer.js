import React,{useState,useEffect } from 'react'
import {Link} from 'react-router-dom'
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import '../styles/Footer.css'
import Icon from '@mdi/react'
import { mdiFacebook,mdiTwitter, mdiInstagram,mdiLinkedin,mdiAccountBox,mdiBriefcaseCheck,mdiCartVariant,mdiMessageProcessingOutline,mdiShoppingSearch,mdiShopping} from '@mdi/js'
const Foot = () => {

    const [loginStatus, setLoginStatus] = useState("");
    Axios.defaults.withCredentials = true;
    const history = useHistory();
    document.addEventListener('DOMContentLoaded', function() {
       
    });
    
    return(
      <div>
    <footer id="first-footer" className="page-footer grey darken-4 footer">
      <div className="container">
        <div className="row">
        <div class="col s5 ">
        <h5 class="white-text">Social Media:</h5>
        <a className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">                     
        <Icon path={mdiFacebook}
        title="Facebook"
        size={1}
        color="white"
        />
        </i>
				</a>
   			<a className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">       
        <Icon path={mdiTwitter}
        title="Twitter"
        size={1}
        color="white"
        />
        </i>
				</a>
					 
        <a className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">       
        <Icon path={mdiInstagram}
        title="Instagram"
        size={1}
        color="white"
        />
        </i>
				</a>
        <a className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">       
        <Icon path={mdiLinkedin}
        title="Linkedin"
        size={1}
        color="white"
        />
        </i>
				</a>
              </div>
              <div className="col s2">
              <h5 class="white-text">Our GITHUBs:</h5>
					 <a href="https://github.com/wesoly97" className="footer-icon-link btn-floating waves-effect waves-light">
						 <i class="footer-icon" aria-hidden="true">MW</i>
					 </a>
					 <a href="https://github.com/kmurczkiewicz" className="footer-icon-link btn-floating waves-effect waves-light">
						 <i class="footer-icon" aria-hidden="true">KM</i>
					 </a>
					 <a href="https://github.com/HubertDrzymalski" className="footer-icon-link btn-floating waves-effect waves-light">
						<i class="footer-icon" aria-hidden="true">HD</i>
					 </a>
           <a href="https://github.com/szyman-9" className="footer-icon-link btn-floating waves-effect waves-light">
						<i className="footer-icon" aria-hidden="true">ŁS</i>
					 </a>
				
          </div>
              {/*  

*/}
 <div class="col s5 push-s2">
        <h5 class="white-text">Navigation:</h5>
        
        <Link to="/account" className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">                     
        <Icon path={mdiAccountBox}
        title="Moje konto"
        size={1}
        color="white"
        />
        </i>
				</Link>
        <Link to="/orders" className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">                     
        <Icon path={mdiBriefcaseCheck}
        title="Zamówienia"
        size={1}
        color="white"
        />
        </i>
				</Link>
					 
        <Link to="/cart" className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">                     
        <Icon path={mdiCartVariant}
        title="Koszyk"
        size={1}
        color="white"
        />
        </i>
				</Link>
        <Link to="/message" className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">                     
        <Icon path={mdiMessageProcessingOutline}
        title="Wiadomości"
        size={1}
        color="white"
        />
        </i>
				</Link>
        <Link to="/auctions" className="footer-social-link btn-floating waves-effect waves-light">
				<i class="Aukcje" aria-hidden="true">                     
        <Icon path={mdiShoppingSearch}
        title="User Profile"
        size={1}
        color="white"
        />
        </i>
				</Link>
        <Link to="/addAuction" className="footer-social-link btn-floating waves-effect waves-light">
				<i class="footer-icon" aria-hidden="true">                     
        <Icon path={mdiShopping}
        title="Dodaj aukcje"
        size={1}
        color="white"
        />
        </i>
				</Link>
              </div>
        </div>
        <div className="row">
         

          </div>
        <div className="row">
          <div className="center-align s3">
            <p> &copy; 2021. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
    </div>
    )};

export default  Foot