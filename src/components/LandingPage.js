import React, { useState} from 'react';
import { Button, Container, Card, Form } from 'react-bootstrap'
import AuthService from '../services/AuthService'
import SessionDataService from '../services/SessionDataService'
import {useAuth} from '../components/auth'
import { useHistory} from 'react-router-dom'
const LandingPage = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { authTokens, setUserProfile } = useAuth()
    let history = useHistory()

    
    const handleClick = () => {
        setIsLoading(true)
        login()
      };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }else {
            event.preventDefault();
            event.stopPropagation();
            handleClick()
        }
        setValidated(true);
    };

    const login=()=> {
        
        AuthService.login(username, password)
        .then(res => {
        setIsLoading(false)
        console.log(res.data)
        setUserProfile(res.data)
        // setAuthTokens(res.data.token); // Setting the token in localStorage
        })
        .catch(err=>{
            setIsLoading(false)
            setValidated(false)
            console.log("oops")
            try{
                setErrorMessage(err.response.data.non_field_errors[0]);
            }catch{
                setErrorMessage("Please check your local connection.")
            }
            
        })
        
    }
    if(AuthService.loggedIn()){
        
        history.replace('/customers')
    }
    
    return ( 
        <div className="diagonal-split-background" style={{ display: "table", position: "absolute", height: "100%", width :"100%", overflow:"hidden"}}>
            <div style={{ display:"table-cell", verticalAlign: "middle" }}>

                <Container>
                    <Card
                        bg="light"
                        text="dark"
                        border="light"
                        style={{ heigth:"400px", width: '400px', margin:"auto", boxShadow:"0 4px 8px rgb(0,0,0,0.2), 0 16px 32px rgb(0,0,0,0.1)"}}
                    >
                        <Card.Header className="p-3">
                            <h2>LOGIN</h2>
                            <Card.Subtitle className="text-muted">
                                NMFIC's Data Management System
                            </Card.Subtitle>
                        </Card.Header>  
                        <Card.Body className="p-3">
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Control 
                                        size="lg" 
                                        type="username" 
                                        value={username} 
                                        placeholder="Username" 
                                        onChange={e=> setUsername(e.target.value)}
                                        
                                        
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        This field is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group >
                                    <Form.Control 
                                        size="lg" 
                                        type="password" 
                                        value={password} 
                                        placeholder="Password" 
                                        onChange={e=> setPassword(e.target.value)}
                                        
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        This field is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <div style={{textAlign: "center"}} >
                                    <p style={{color:"red",  margin:"0 0 0 0"}}>{errorMessage}</p>
                                </div>
                                <hr />
                                <Form.Group >
                                    <Button
                                        type="submit"
                                        size="lg"
                                        variant="light"
                                        disabled={isLoading}
                                        block
                                        style={{backgroundColor: "#F26122", color: "white"}}
                                    >
                                        {isLoading ? 'Loading...' : 'Log In'}
                                    </Button>
                                </Form.Group>

                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </div>
     );
}
 
export default LandingPage;