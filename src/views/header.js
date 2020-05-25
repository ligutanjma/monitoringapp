import React from 'react'
import { ListGroup } from 'react-bootstrap'
import AuthService from '../services/AuthService'
import { NavLink, Redirect, Prompt } from 'react-router-dom'
export const Header = props => {
        return(
            
        <div>
        <div className="w3-padding-large w3-border w3-wide w3-amber w3-text-light-grey w3-center">
          <div className="w3-row ">
            <div className="w3-col s2 w3-center w3-hide-small">Logo</div>
            <div className="w3-col s10 w3-center">
            {/* Show when Large */}
              <h2 className="w3-hide-medium w3-hide-small w3-xxxlarge">NORTHERN MINDANAO</h2>
              <h2 className="w3-hide-medium w3-hide-small w3-xxxlarge">FOOD INNOVATION CENTER</h2>
              {/* Show when Medium */}

              <h4 className="w3-hide-large w3-hide-large w3-hide-small" style={{whiteSpace: "nowrap"}}>NORTHERN MINDANAO</h4>
              <h4 className="w3-hide-large w3-hide-large w3-hide-small" style={{whiteSpace: "nowrap"}}>FOOD INNOVATION CENTER</h4>
              {/* Show only when Large */}
              <h3 className="w3-hide-medium w3-hide-small">Data Management System</h3>
            </div> 
              <h6 className="w3-hide-large w3-hide-medium" style={{whiteSpace: "nowrap"}}>NORTHERN MINDANAO</h6>
              <h6 className="w3-hide-large w3-hide-medium" style={{whiteSpace: "nowrap"}}>FOOD INNOVATION CENTER</h6>
          </div>
        </div>
        {/* <img className="w3-image" src={photographer} alt="Me" width="1500" height="300"/> */}
        
     
            <header className="w3-display-container w3-content w3-center" style={{maxWidth: "1500px"}}>

              <div className="w3-bar w3-light-grey w3-round w3-display-bottommiddle w3-hide-small" style={{bottom:"-20px"}}>
                
                <NavLink to="/" className="w3-bar-item w3-button" >
                    Home
                </NavLink>
                <NavLink to="/customers" className="w3-bar-item w3-button" >
                    Customers
                </NavLink>
                <NavLink to="/sessions" className="w3-bar-item w3-button" >
                    Sessions
                </NavLink>
                <NavLink to='/login'  >
                    <button onClick={()=> {
                        props.logout()
                        AuthService.logout()
                        }} className="w3-bar-item w3-text-black w3-button">Logout</button>
                </NavLink>
              </div>
              <div className="w3-center w3-light-grey w3-padding-16 w3-hide-large w3-hide-medium">
                <div className="w3-bar w3-light-grey">
                    <NavLink to="/" className="w3-bar-item w3-button" >
                        Home
                    </NavLink>
                    <NavLink to="/customers" className="w3-bar-item w3-button" >
                        Customers
                    </NavLink>
                    <NavLink to="/sessions" className="w3-bar-item w3-button" >
                        Sessions
                    </NavLink>
                    <button onClick={()=> {
                        props.logout()
                        AuthService.logout()
                        console.log(props.history)
                        props.history.push('/login')
                        }} className="w3-bar-item w3-button"> Logout </button>
                </div>
              </div>

            {/* <div className="w3-bar w3-light-grey w3-round w3-display-bottommiddle w3-hide-small" style={{bottom:"-20px"}}>
              <a href="/" className="w3-bar-item w3-button">Home</a>
              <a href="/customers" className="w3-bar-item w3-button">Customers</a>
              <a href="/sessions" className="w3-bar-item w3-button">Sessions</a>
            </div> */}
            </header>
           

    <br/>
    </div>
        )
    }
    export const HeaderNotLoggedIn = props => {
    
        return(
            
        <div>
        <div className="w3-padding-large w3-border w3-wide w3-amber w3-text-light-grey w3-center">
          <div className="w3-row ">
            <div className="w3-col s2 w3-center w3-hide-small">Logo</div>
            <div className="w3-col s10 w3-center">
            {/* Show when Large */}
              <h2 className="w3-hide-medium w3-hide-small w3-xxxlarge">NORTHERN MINDANAO</h2>
              <h2 className="w3-hide-medium w3-hide-small w3-xxxlarge">FOOD INNOVATION CENTER</h2>
              {/* Show when Medium */}

              <h4 className="w3-hide-large w3-hide-large w3-hide-small" style={{whiteSpace: "nowrap"}}>NORTHERN MINDANAO</h4>
              <h4 className="w3-hide-large w3-hide-large w3-hide-small" style={{whiteSpace: "nowrap"}}>FOOD INNOVATION CENTER</h4>
              {/* Show only when Large */}
              <h3 className="w3-hide-medium w3-hide-small">Data Management System</h3>
            </div> 
              <h6 className="w3-hide-large w3-hide-medium" style={{whiteSpace: "nowrap"}}>NORTHERN MINDANAO</h6>
              <h6 className="w3-hide-large w3-hide-medium" style={{whiteSpace: "nowrap"}}>FOOD INNOVATION CENTER</h6>
          </div>
        </div>
        {/* <img className="w3-image" src={photographer} alt="Me" width="1500" height="300"/> */}
        
     
            <header className="w3-display-container w3-content w3-center" style={{maxWidth: "1500px"}}>

              <div className="w3-bar w3-light-grey w3-round w3-display-bottommiddle w3-hide-small" style={{bottom:"-20px"}}>
                <a href="/login" className="w3-bar-item w3-button">login</a>
                <a href="/signup" className="w3-bar-item w3-button">Register</a>

              </div>
              <div className="w3-center w3-light-grey w3-padding-16 w3-hide-large w3-hide-medium">
                <div className="w3-bar w3-light-grey">
                  <a href="/login" className="w3-bar-item w3-button">login</a>
                  <a href="/signup" className="w3-bar-item w3-button">Register</a>
                </div>
              </div>

            {/* <div className="w3-bar w3-light-grey w3-round w3-display-bottommiddle w3-hide-small" style={{bottom:"-20px"}}>
              <a href="/" className="w3-bar-item w3-button">Home</a>
              <a href="/customers" className="w3-bar-item w3-button">Customers</a>
              <a href="/sessions" className="w3-bar-item w3-button">Sessions</a>
            </div> */}
            </header>
           

    <br/>
    </div>
        )
    }
 
