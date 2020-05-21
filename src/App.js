import React, { useState} from "react";
import {SessionPage, AddSessions } from './container/SessionPage';
import CurrentSession from './container/CurrentSessionContainer'
import HomePage from './container/HomePage'
import Login from './components/Login'
import Signup from './components/Signup'
import PrivateRoute from './components/PrivateRoute'
import { AuthContext } from './components/auth'
import AuthService from './services/AuthService'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

// listen to connect event
const App = () => {
  const existingToken = JSON.parse(localStorage.getItem("token"));
  const [authTokens, setAuthTokens] = useState(existingToken);
  
  const setTokens = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setAuthTokens(data);
  }
  return ( 
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <Router>
          <div>
            <div>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/customer">Customers</Link>
                </li>
                <li>
                  <Link to="/sessions">Sessions</Link>
                </li>
              </ul>
            </div>
              
              <br />

              <Switch>
                <PrivateRoute exact path="/" component={HomePage} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />

                <PrivateRoute path="/customer">
                  <div><h3>Customers</h3></div>
                </PrivateRoute>
                
                <PrivateRoute path="/sessions/current" component={CurrentSession}/>
                <PrivateRoute path="/sessions/create" component={AddSessions} />
                <PrivateRoute path="/sessions" component={SessionPage} />
              </Switch>
          </div>
        </Router>
      </AuthContext.Provider>
   );
}
 
export default App; 
