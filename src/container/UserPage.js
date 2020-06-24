import React, {useState, useEffect} from 'react';
import {useAuth, AuthContext} from '../components/auth'
import UserDataService from '../services/UserDataService'
import {DataList} from '../components/DataList'
import filterFactory, { dateFilter,Comparator } from 'react-bootstrap-table2-filter';
import { Container, Row, Col, Form, Button, Modal, Table, InputGroup, FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";

const columns = [{
    dataField:"date_joined",
    text:"Date Created",
    sort:true,
    headerStyle: (column, colIndex)=>{
      return {color:"#007bff", textAlign:"center"}
    },
    filter: dateFilter({
      delay: 400,
      withoutEmptyComparatorOption: true,
      comparators: [Comparator.EQ, Comparator.GT, Comparator.LT]
    })
    },{
    dataField: 'id',
    text: 'ID',
    hidden: true
    }, {
      dataField: 'username',
      text: 'Username',
      sort: true,
      headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
      }
    },{
      dataField: 'first_name',
      text: 'First Name',
      sort: true,
      headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
      }

    },
    {
      dataField: 'last_name',
      text: 'Last Name',
      sort: true,

    }];
const small_screen_columns = [{
        dataField: 'id',
        text: 'ID',
        hidden: true
        }, {
          dataField: 'username',
          text: 'Username',
          sort: true,
          headerStyle: (column, colIndex)=>{
            return {color:"#007bff", textAlign:"center"}
          }
        },{
          dataField: 'last_name',
          text: 'Last Name',
          sort: true,
          headerStyle: (column, colIndex)=>{
            return {color:"#007bff", textAlign:"center"}
          }
    
        }];

export const UserPage = (props)=>{
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([])
    const [data, setData] = useState({})
    const { authTokens } = useAuth()
    var options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + authTokens
      }
    }
    useEffect(()=> {
      setLoading(true)
      UserDataService.getAll(options)
        .then(response => {
          setData(response.data)
          setUsers(response.data.results)
          setLoading(false)
        })
        .catch(e => {
          setLoading(false)
          console.log(e);
        });
        return ()=> UserDataService.cancelToken()
    },[])
    return(
        <DataList name="User" placeholder="Username / First Name / Last Name" loading={loading} columns={columns} small_screen_columns={small_screen_columns} data= {users} prop={props} count={data.count}/>
    )
}

export const AddUser = (props) => {
  const [ first_name, setfirst_name] = useState("")
  const [ last_name, setlast_name] = useState("")
  const [ username, setUsername] = useState("")
  const [ password, setPassword] = useState("")
  const [ confirm_password, setConfirmPassword] = useState("")
  const [errMessage, setErrMessage] = useState("")
  const [authorizationErrorMessage, setAuthorizationErrorMessage] = useState("")

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [passValidated, setPassValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  let {userProfile} = useAuth()
  const { authTokens } = useAuth()
  let history= useHistory()
 

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClick = () => {
    if(userProfile.is_superuser){

      setLoading(true)
      add_user()
    }else{

      setLoading(false)
      setAuthorizationErrorMessage("You are not allowed to create new user. Please contact your supervisor.")
    }
    }
  
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
  }else {

      event.preventDefault();
      event.stopPropagation();
      if(password===confirm_password){
          setErrMessage("")
          setAuthorizationErrorMessage("")
          setValidated(true);
          handleShow()

      }else{
          setErrMessage("Your Password do not match!")
          setValidated(false);
          
      }
    }

  };
  
  
  const add_user =()=>{
      var data = {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "password": password,
        
      };
      var options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + authTokens
        }
      }
      UserDataService.create(data, options)
        .then(response => {
          setLoading(false)
          history.push({pathname:'/users'})
        })
        .catch(e => {
          setLoading(false)
          try{
            setAuthorizationErrorMessage(e.response.data.username[0])
          }catch{
            setAuthorizationErrorMessage("Something went wrong. Please try again.")
          }
          });
          
          
        
  
    }
  return (
      <AuthContext.Consumer>
      {  value=> (

          <div className="w3-container" style={{width:"500px",margin:"auto", paddingTop: "10px"}}>
            <br />
            <div className="w3-row" >
              <h2 className="w3-text-white" style={{textAlign: "center", margin: "0 0 15px", textShadow:"2px 2px 4px #000000"}}>Create New User</h2>
            </div>
            <div className="w3-row">
              <div className="w3-container" style={{width:"500px",  borderColor: "lightgrey", borderWidth : "1px", borderStyle: "solid", padding : "10px", 
              boxShadow:"2px 4px 8px 2px rgb(0,0,0,0.2), 4px 8px 16px 4px rgb(0,0,0,0.1),"}}>
              <Form name="formera" noValidate validated={validated} onSubmit={handleSubmit}>
              
              <Form.Group  controlId="username" >
                <Form.Label column="md">
                  Username:
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="sm" 
                    value={username} 
                    onChange={e=>setUsername(e.target.value)} 
                    type="text" 
                    placeholder="User Name"
                    required
                     />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid username.
                    </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group  controlId="password" >
                <Form.Label column="md">
                  Password
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="sm" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    type="password" 
                    placeholder="Password"
                    required
                     />
                  <code >{errMessage}</code>

                </Col>
              </Form.Group>

              <Form.Group  controlId="confirm_password" >
                <Form.Label column="md">
                  Confirm Password
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="sm" 
                    value={confirm_password} 
                    onChange={e=>setConfirmPassword(e.target.value)} 
                    type="password" 
                    placeholder="Confirm Password"
                    required
                     />
                    <code >{errMessage}</code>
                </Col>
              </Form.Group>

              <Form.Group  controlId="FormFirstName">
                <Form.Label column="md">
                  First Name
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="md" 
                    value={first_name} 
                    onChange={e=>setfirst_name(e.target.value)} 
                    type="text" 
                    placeholder="First Name" 
                    required

                    />
                </Col>
              </Form.Group>
              


              <Form.Group  controlId="last_name">
                <Form.Label column="md">
                  Last Name
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="md" 
                    value={last_name} 
                    onChange={e=>setlast_name(e.target.value)} 
                    type="text" 
                    placeholder="Last Name" 
                    required

                    />
                </Col>
              </Form.Group>

           
              <Form.Group  controlId="footer">
                <Row className="mx-auto">
                  <Col >
                    <Link to="/users">
                      <Button  variant="danger">Cancel</Button>
                    </Link>
                    <Button className="px-4 mx-4" variant="outline-success" type="submit">Save</Button>
                    {/* <Button variant="outline-primary" onClick={(event)=> handleSubmit(event)} block>Save</Button> */}
                  </Col>
                </Row>
              </Form.Group>
              

            </Form>
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mr-4">
                  <Container >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th colSpan="2">ARE THE DETAILS BELOW CORRECT?</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Username:</td>
                          <td>{username}</td>
                        </tr>
                        <tr>
                          <td>First Name:</td>
                          <td>{first_name}</td>
                        </tr>
                        
                        <tr>
                          <td>Last Name:</td>
                          <td>{last_name}</td>
                        </tr>
                        
                      </tbody>
                    </Table>
                    <div style={{textAlign: "center"}} >
                      <code >{errMessage}</code>
                      <code >{authorizationErrorMessage}</code>
                    </div>
                  </Container>
                </Modal.Body>
                <Modal.Footer className="justify-content-start mx-2">
                
                  <Button variant="danger" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="success"
                    disabled={isLoading}
                    onClick={!isLoading ? handleClick : null}
                  >
                    {isLoading ? 'Loading…' : 'Add User'}
                  </Button>
                </Modal.Footer>
              </Modal>
              </div>
              
            </div>
            <br />
          </div>
      )}
      </AuthContext.Consumer>
  )
}
export const UpdateUser = (props) => {

  const [ first_name, setfirst_name] = useState(props.location.state.first_name)
  const [ last_name, setlast_name] = useState(props.location.state.last_name)
  const [ username, setUsername] = useState(props.location.state.username)
  const [ password, setPassword] = useState("")
  const [ confirm_password, setConfirmPassword] = useState("")
  const [is_staff, setStaff] = useState(props.location.state.is_staff);
  const [super_user, setSuperuser] = useState(props.location.state.super_user);
  const [errMessage, setErrMessage] = useState("")
  const [authorizationErrorMessage, setAuthorizationErrorMessage] = useState("")
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { authTokens } = useAuth()
  let {userProfile} = useAuth()
  let history=useHistory()

  useEffect(() => {
    setfirst_name(props.location.state.first_name)
    setlast_name(props.location.state.last_name)
    setUsername(props.location.state.username)

  }, [props]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClick = () => {
    if (userProfile.is_superuser) {
      
      setLoading(true)
      update_user()
    }else{
      setLoading(false)
      setAuthorizationErrorMessage("You are not allowed to update this user. Please contact your supervisor.")
    }
  };
  
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
  }else {

      event.preventDefault();
      event.stopPropagation();
      if(password===confirm_password){
          setErrMessage("")
          setAuthorizationErrorMessage("")
          setValidated(true);
          handleShow()

      }else{
          setErrMessage("Your Password do not match!")
          setValidated(false);
          
      }
    }

  };
  
  
  const update_user =()=>{

      var data = {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "super_user": super_user,
        "is_staff": is_staff
      };
      var options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'JWT ' + authTokens
        }
      }
      UserDataService.patch(props.location.state.id, data, options)
        .then(response => {
          setLoading(false)
          history.push({pathname:'/users'})
        })
        .catch(e => {
          setErrMessage("Something went wrong. Please try again!")
        
        });
          
          
        
  
    }
    
  return (
      <AuthContext.Consumer>
      {  value=> (

          <div className="w3-container "  style={{width:"500px",margin:"auto", paddingTop: "10px"}}>
            <br />
            <div className="w3-row" >
              <h3 className="justify-content-center" style={{ textAlign:"center"}}>UPDATE USER: <i style={{ textTransform: "uppercase"}}>{username}</i></h3>

            </div>
            <div className="w3-row">
              <div className="w3-container" style={{ borderColor: "lightgrey", borderWidth : "1px", borderStyle: "solid", padding : "10px", 
              boxShadow:"2px 4px 8px 2px rgb(0,0,0,0.2), 4px 8px 16px 4px rgb(0,0,0,0.1)"}}>
              <Form name="formera" noValidate validated={validated} onSubmit={handleSubmit}>
              {/* <fieldset>
                    <Form.Group className="w3-large">
                      <Col  style={{padding:"10px 15px"}}>
                        
                        <Form.Check
                          
                          value={props.location.state.is_staff}
                          inline
                          type="checkbox"
                          name="JobType"
                          label="Staff"
                          id="staff"
                          onChange={(e)=> setStaff(prevState=> !prevState)}
                          required
                        />
                        <Form.Check
                          
                          value={props.location.state.is_superuser}
                          inline
                          type="checkbox"
                          name="JobType"
                          label="Admin"
                          id="staff"
                          onChange={(e)=> setSuperuser(prevState=> !prevState)}
                          required
                        />
                      </Col>
                    </Form.Group>
                </fieldset> */}
              <Form.Group  controlId="username" >
                <Form.Label column="md">
                  Username:
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="sm" 
                    value={username} 
                    onChange={e=>setUsername(e.target.value)} 
                    type="text" 
                    placeholder="User Name"
                    disabled
                     />
                    
                </Col>
              </Form.Group>


              <Form.Group  controlId="FormFirstName">
                <Form.Label column="md">
                  First Name
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="md" 
                    value={first_name} 
                    onChange={e=>setfirst_name(e.target.value)} 
                    type="text" 
                    placeholder="First Name" 
                    required

                    />
                </Col>
              </Form.Group>
              


              <Form.Group  controlId="last_name">
                <Form.Label column="md">
                  Last Name
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="md" 
                    value={last_name} 
                    onChange={e=>setlast_name(e.target.value)} 
                    type="text" 
                    placeholder="Last Name" 
                    required

                    />
                </Col>
              </Form.Group>

              
              <Form.Group  controlId="password" >
                <Form.Label column="md">
                  Password
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="sm" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    type="password" 
                    placeholder="Password"
                    
                     />
                  <code >{errMessage}</code>

                </Col>
              </Form.Group>

              <Form.Group  controlId="confirm_password" >
                <Form.Label column="md">
                  Confirm Password
                </Form.Label>
                <Col>
                  <Form.Control 
                    size="sm" 
                    value={confirm_password} 
                    onChange={e=>setConfirmPassword(e.target.value)} 
                    type="password" 
                    placeholder="Confirm Password"
                    
                     />
                    <code >{errMessage}</code>
                </Col>
              </Form.Group>

           
              <Form.Group  controlId="footer">
                <Row className="mx-auto">
                  <Col >
                    <Link to="/users">
                      <Button  variant="danger">Cancel</Button>
                    </Link>
                    <Button className="px-4 mx-4" variant="outline-success" type="submit">Save</Button>
                    {/* <Button variant="outline-primary" onClick={(event)=> handleSubmit(event)} block>Save</Button> */}
                  </Col>
                </Row>
              </Form.Group>
              

            </Form>
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mr-4">
                  <Container >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th colSpan="2">ARE THE DETAILS BELOW CORRECT?</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Username:</td>
                          <td>{username}</td>
                        </tr>
                        <tr>
                          <td>First Name:</td>
                          <td>{first_name}</td>
                        </tr>
                        
                        <tr>
                          <td>Last Name:</td>
                          <td>{last_name}</td>
                        </tr>
                        
                      </tbody>
                    </Table>
                    <div style={{textAlign: "center"}} >
                      <code >{errMessage}</code>
                      <code >{authorizationErrorMessage}</code>
                      
                    </div>
                  </Container>
                </Modal.Body>
                <Modal.Footer className="justify-content-start mx-2">
                
                  <Button variant="danger" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="success"
                    disabled={isLoading}
                    onClick={!isLoading ? handleClick : null}
                  >
                    {isLoading ? 'Loading…' : 'Update User'}
                  </Button>
                </Modal.Footer>
              </Modal>
              </div>
              <div className="col"></div>
              
            </div>
            <br />
          </div>
      )}
      </AuthContext.Consumer>
  )
}