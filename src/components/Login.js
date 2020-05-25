import React, { useState } from "react";
import { Link, Redirect } from 'react-router-dom';
import { Card, Form, Button} from 'react-bootstrap'
import { useAuth } from './auth'
import AuthService from '../services/AuthService'
import Spinner from 'react-bootstrap/Spinner'

const Login = (props) => {

  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth()
  
  function postLogin() {
    setLoading(true)
    AuthService.login(username, password)
    .then(res => {
      setLoading(false);
      setLoggedIn(true);
      setAuthTokens(res.data.token); // Setting the token in localStorage
      props.history.push('/')

    })
    .catch(err=>{
      setLoading(false);
      setIsError(true);
      setErrorMessage(err.message);
    })
    
    
  }
  

  if(loading){
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  }
  return ( 
      <Card>
          <Form>
              <Form.Group controlId="formGroupUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                      type="text" 
                      placeholder="Enter Username" 
                      onChange={e => setUsername(e.target.value)} 
                      value={username} />
              </Form.Group>
              <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                      type="password" 
                      placeholder="Password"
                      onChange={e => setPassword(e.target.value)} 
                      value={password}
                        />
              </Form.Group>
              <Button onClick={postLogin}>Sign In</Button>
          </Form>
          <Link to="/signup">Don't have an account?</Link>
      </Card>
    );
}
 
export default Login;