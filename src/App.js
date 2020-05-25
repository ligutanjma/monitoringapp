import React, { useState} from "react";
import {SessionPage, AddSessions } from './container/SessionPage';
import CurrentSession from './container/CurrentSessionContainer'
import HomePage from './container/HomePage'
import {CustomerPage, AddCustomer, UpdateCustomer} from './container/CustomerPage'
import Login from './components/Login'
import Signup from './components/Signup'
import PrivateRoute from './components/PrivateRoute'
import { AuthContext } from './components/auth'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import AuthService from "./services/AuthService";
import {Header, HeaderNotLoggedIn} from "./views/header"
// listen to connect event
const App = () => {
  const existingToken = JSON.parse(localStorage.getItem("token"));
  const [authTokens, setAuthTokens] = useState(existingToken);
  
  const setTokens = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setAuthTokens(data);
  }
  return AuthService.loggedIn() ? ( 
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <Router>
          <Header logout={()=> setAuthTokens()} />
          
              <Switch>
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute path="/customers/create" component={AddCustomer} />
                <PrivateRoute path="/customers/update" component={UpdateCustomer} />
                <PrivateRoute path="/customers" component={CustomerPage} />
                <PrivateRoute path="/sessions/current" component={CurrentSession}/>
                <PrivateRoute path="/sessions/create" component={AddSessions} />
                <PrivateRoute path="/sessions" component={SessionPage} />

              </Switch>
        </Router>
      </AuthContext.Provider>
   ):
   <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <Router>
          <HeaderNotLoggedIn />
          
              <Switch>

                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
              </Switch>
        </Router>
      </AuthContext.Provider>
}
 
export default App; 
