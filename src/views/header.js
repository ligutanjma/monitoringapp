import React, {useState} from 'react';
import { Modal, Button } from 'react-bootstrap'
import AuthService from '../services/AuthService'
import { useLocation,Link as NavLink} from 'react-router-dom'
import NMFICLOGO from '../assets/NMFICLOGO.jpg'
import { useAuth } from '../components/auth'

import { Navbar, Nav} from 'react-bootstrap'
import {ButtonField} from '../reusable/Button/ButtonField'

export const Header = props => {
  const { logout } = useAuth()
  const [modalShow, setModalShow] = useState(false);
  let location = useLocation()


  const MyVerticallyCenteredModal=(props)=>{

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to logout?</h4>
          
        </Modal.Body>
        <Modal.Footer>
          <ButtonField buttonStyle="btns-cancel" onClick={props.onHide}>
                        Close
          </ButtonField>
          <ButtonField buttonStyle="btns-primary" onClick={Logout}>
            Confirm Logout
          </ButtonField>
        </Modal.Footer>
      </Modal>
    );
    }

  const Logout=()=>{
    logout()
    // setAuthToken()
    setModalShow(false)
  }
  console.log(AuthService.loggedIn())
  return ( AuthService.loggedIn() ? (
    <div>
      <div className="w3-padding-large w3-border w3-center" style={{backgroundColor: "#F26122"}}>
        <div className="w3-row w3-hide-medium w3-hide-small">

          {/* Show when Screen is Large */}
          <div className="w3-col s4" style={{paddingRight:"10px", marginTop:"6px"}}>
            <img src={NMFICLOGO} alt="NMFIC's Logo" style={{borderRadius:"15px 50px 50px 15px"}} />
          </div>
          <div className="w3-col s8 w3-text-white w3-wide justify-content-start" >
            <h3 className="w3-xxlarge ">UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES</h3>
            {/* <h3 className="w3-xxlarge">AND TECHNOLOGY OF</h3>
            <h3 className="w3-xxlarge">SOUTHERN PHILIPPINES</h3> */}
            <h3  >Data Management System</h3>
          </div>
        </div>

          {/* Show when Screen is Medium */}
          <div className="w3-hide-large w3-hide-small w3-text-white" style={{whiteSpace: "nowrap"}}>
                <h4>NORTHERN MINDANAO</h4>
                <h4>FOOD INNOVATION CENTER</h4>
          </div>

          {/* Show when Screen is Small */}
          <div className="w3-hide-large w3-hide-medium w3-text-white" style={{whiteSpace: "nowrap"}}>
            <h6 >NORTHERN MINDANAO</h6>
            <h6>FOOD INNOVATION CENTER</h6>
          </div>
      </div>
            
        
            <Navbar className="w3-display-container w3-center w3-hide-small w3-hide-medium" style={{maxWidth: "1500px",}}>
              <Nav 
              className="w3-bar w3-light-grey w3-round w3-display-bottommiddle" 
              style={{bottom:"-10px", boxShadow:"0 4px 8px rgb(0,0,0,0.2), 0 16px 32px rgb(0,0,0,0.1)",}}>
                  <NavLink className="w3-bar-item" to="/customers"  style={location.pathname==='/customers' || location.pathname.indexOf("customers")!==-1?{fontWeight:"bold", color:"#007bff"}: {color:"gray"}}>Customers</NavLink>
                  <NavLink className="w3-bar-item" to="/sessions"   style={location.pathname==='/sessions'  || location.pathname.indexOf("sessions")!==-1?{fontWeight:"bold",  color:"#007bff"}: {color:"gray"}}>Sessions</NavLink>
                  <NavLink className="w3-bar-item" to="/users"  style={location.pathname==='/users'  || location.pathname.indexOf("users")!==-1?{fontWeight:"bold",  color:"#007bff"}: {color:"gray"}}>Users</NavLink>
                  <button onClick={()=> setModalShow(true)} className="w3-bar-item"  style={{color:"gray",fontWeight:"bold"}}>Logout</button>
              </Nav>
              <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </Navbar>
          {/* <AuthContext.Consumer>
          {(value) => (value.userProfile.is_superuser ?<a href="/users" className="w3-bar-item w3-button" >
                Users
            </a>: null
          )}
          </AuthContext.Consumer> */}
        
        <Navbar className=" w3-display-container w3-center w3-hide-large" style={{maxWidth: "1500px",}}>
          <Nav className="w3-light-grey w3-display-bottommiddle w3-round" 
            style={{bottom:"-22px", boxShadow:"4px 4px 8px 4px rgb(0,0,0,0.2), 16px 16px 32px 16px rgb(0,0,0,0.1)"}}>
        
            <NavLink className="w3-bar-item w3-margin" to="/customers"  style={location.pathname==='/customers' || location.pathname.indexOf("customers")!==-1?{fontWeight:"bold", color:"#007bff"}: {color:"gray"}}>
                Customers
            </NavLink>
            <NavLink className="w3-bar-item w3-margin" to="/sessions" style={location.pathname==='/sessions'  || location.pathname.indexOf("sessions")!==-1?{fontWeight:"bold",  color:"#007bff"}: {color:"gray"}}>
                Sessions
            </NavLink>
            <NavLink className="w3-bar-item w3-margin" to="/users"   style={location.pathname==='/users'  || location.pathname.indexOf("users")!==-1?{ fontWeight:"bold", color:"#007bff"}: {color:"gray"}}>Users</NavLink>
            <button onClick={()=> setModalShow(true)} className="w3-bar-item" style={{color:"gray",fontWeight:"bold", border:"none"}}>Logout</button>
          </Nav>
        </Navbar>
      <br/>
    </div>) : null )
    
      }
    