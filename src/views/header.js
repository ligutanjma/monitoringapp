import React, {useState} from 'react'
import { Modal, Button } from 'react-bootstrap'
import AuthService from '../services/AuthService'
import {  useLocation} from 'react-router-dom'
import NMFICLOGO from '../assets/NMFICLOGO.jpg'
import {  useAuth } from '../components/auth'

import { Navbar, Nav, NavLink} from 'react-bootstrap'

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
          <Button variant="outline-dark" onClick={props.onHide}>Close</Button>
          <Button variant="danger" onClick={Logout}>Confirm Logout</Button>
        </Modal.Footer>
      </Modal>
    );
    }

  const Logout=()=>{
    logout()
    // setAuthToken()
    setModalShow(false)
  }
  return ( AuthService.loggedIn() ? (
    <div>
      <div className="w3-padding-large w3-border w3-center" style={{backgroundColor: "#F26122"}}>
        <div className="w3-row w3-hide-medium w3-hide-small">

          {/* Show when Screen is Large */}
          <div className="w3-col s4" style={{paddingRight:"10px", marginTop:"6px"}}>
            <img src={NMFICLOGO} alt="NMFIC's Logo" style={{borderRadius:"15px 50px 50px 15px"}} />
          </div>
          <div className="w3-col s8 w3-text-white w3-wide justify-content-start" >
            <h3 className="w3-xxlarge">UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES</h3>
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
              style={{bottom:"-13px", boxShadow:"0 4px 8px rgb(0,0,0,0.2), 0 16px 32px rgb(0,0,0,0.1)",}}>
                  <NavLink className="w3-bar-item" href="/customers" active={location.pathname==='/customers'}>Customers</NavLink>
                  <NavLink className="w3-bar-item" href="/sessions"  active={location.pathname==='/sessions'}>Sessions</NavLink>
                  <NavLink className="w3-bar-item" href="/users"  active={location.pathname==='/users'}>Users</NavLink>
                  <NavLink onClick={()=> setModalShow(true)} className="w3-bar-item" >Logout</NavLink>
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
            style={{bottom:"-13px", boxShadow:"4px 4px 8px 4px rgb(0,0,0,0.2), 16px 16px 32px 16px rgb(0,0,0,0.1)"}}>
        
            
            <NavLink className="w3-bar-item" href="/customers" active={location.pathname==='/customers'}>
                Customers
            </NavLink>
            <NavLink className="w3-bar-item" href="/sessions" active={location.pathname==='/sessions'} >
                Sessions
            </NavLink>
            <NavLink className="w3-bar-item" href="/users"  active={location.pathname==='/users'}>Users</NavLink>
            <NavLink onClick={()=> setModalShow(true)} className="w3-bar-item">Logout</NavLink>
          </Nav>
        </Navbar>
      <br/>
    </div>) : null )
    
      }
    