import React, { useState, useEffect } from "react";
import {SessionPage, AddSessions } from './container/SessionPage';
import CurrentSession from './container/CurrentSessionContainer2'
import {CustomerPage, AddCustomer, UpdateCustomer} from './container/CustomerPage'
import {UserPage, AddUser, UpdateUser} from './container/UserPage'
import {AuditCustomer, AuditSession, AuditUser} from './container/AuditLogs'
import LandingPage from './components/LandingPage'
import PrivateRoute from './components/PrivateRoute'
import { AuthContext } from './components/auth'
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AuthService from "./services/AuthService";
import {Header} from "./views/header"
import 'bootstrap/dist/css/bootstrap.min.css';
import {FormContainer} from './reusable/FormContainer'

const App = () => {

  const existingToken = JSON.parse(localStorage.getItem("token"));
  const existingUser = JSON.parse(localStorage.getItem("user"));
  const [authTokens, setAuthTokens] = useState(existingToken);
  const [userProfile, setUserProfile] = useState(existingUser);

  const setProfile = (data) => {
    localStorage.setItem("token", JSON.stringify(data.token));
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthTokens(data.token);
    setUserProfile(data.user)
  }

  const removeToken = () => {
    AuthService.logout()
    setAuthTokens()
    setUserProfile()
  }
  const disableRefresh=(e)=>{
    if((e.which || e.keyCode) === 116 || (e.which || e.keyCode) === 82 ) e.preventDefault();
  }
  useEffect(()=>{
    window.onload = function (){
      document.onkeydown = function (e) {
        disableRefresh(e)
        
      }
    }
  }, [])
  return (
    <AuthContext.Provider value={{ authTokens, userProfile, setUserProfile:setProfile, logout: removeToken, }}>
        <Router>
          <Header/>
          <Switch>
            <PrivateRoute path="/customers/audit" component={AuditCustomer} />
            <PrivateRoute path="/customers/create" component={AddCustomer} />
            <PrivateRoute path="/customers/update" component={UpdateCustomer} />
            <PrivateRoute path="/customers" component={CustomerPage} />
            <PrivateRoute path="/sessions/audit" component={AuditSession}/>
            <PrivateRoute path="/sessions/current" component={CurrentSession}/>
            <PrivateRoute path="/sessions/create" component={AddSessions} />
            <PrivateRoute path="/sessions" component={SessionPage} />
            <PrivateRoute path="/users/audit" component={AuditUser} />
            <PrivateRoute path="/users/create" component={AddUser} />
            <PrivateRoute path="/users/update" component={UpdateUser} />
            <PrivateRoute path="/users" component={UserPage} />
            <Route path="/" component={LandingPage} />
            {/* <Route path="/" component={AddForm} /> */}
          </Switch>
        </Router>
    </AuthContext.Provider>
  )
}
 
export default App; 
