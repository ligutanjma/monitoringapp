import React, { useState, useEffect} from 'react'
import { useAuth } from '../components/auth'
import Spinner from 'react-bootstrap/Spinner'
import CustomerDataService from '../services/CustomerDataService'
import { Container, Row, Col, Form, Button, Modal, Table} from 'react-bootstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import { Link, Redirect } from "react-router-dom";

const { SearchBar } = Search;

const columns = [{
    dataField: 'id',
    text: 'ID',
    
  
  }, {
    dataField: 'customer_name',
    text: 'Customer Name',
  },{
    dataField: 'product_name',
    text: 'Product Name',
    searchable: false,

  },
  {
    dataField: 'phone_number',
    text: 'Phone Number',
    searchable: false,

  }, {
      dataField: 'email',
      text: 'Email Address',
    }];
    

export const UpdateCustomer = (props) => {
  console.log(props)
  const [customer_name, setCustomerName] = useState(props.location.state.customer_name)
  const [product_name, setProductName] = useState(props.location.state.product_name)
  const [gender, setGender] = useState(props.location.state.gender)
  const [address, setAddress] = useState(props.location.state.address)
  const [phone_number, setPhoneNumber] = useState(props.location.state.phone_number)
  const [email, setEmail] = useState(props.location.state.email)
  const [errMessage, setErrMessage] = useState("")

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { authTokens } = useAuth()
  useEffect(() => {
    setCustomerName(props.location.state.customer_name)
    setProductName(props.location.state.product_name)
    setGender(props.location.state.gender)
    setAddress(props.location.state.address)
    setPhoneNumber(props.location.state.phone_number)
    setEmail(props.location.state.email)
  }, [props])
  useEffect(() => {
    if (isLoading) {
      update_customer()
    }
  }, [isLoading]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClick = () => setLoading(true);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }else {
      event.preventDefault();
      event.stopPropagation();
      handleShow()
    }
    setValidated(true);
  };
  const update_customer =()=>{
    var data = {
      "customer_name": customer_name,
      "product_name": product_name,
      "phone_number": phone_number,
      "email": email,
      "gender": gender,
      "address": address,
      
    };
    var options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + authTokens
      }
    }
    console.log(data)
    CustomerDataService.patch(props.location.state.id, data, options)
      .then(response => {
        // props.history.push('/sessions/current', response.data)
        setLoading(false)
        props.history.push('/customers')
      })
      .catch(e => {
        console.log(e.response.status)
            if(e.response.status === 400 && e.response.data.customer_name[0] !== undefined){
              console.log(e.response.data.customer_name[0])
              if(e.response.data.customer_name[0] === undefined){
                setErrMessage("Please try again.")
                return
              }
              setErrMessage(e.response.data.customer_name[0])
              
              setLoading(false)
            }else if(e.response.status===500){

              props.history.push('/')
            }
      });

  }
  return (
    <div className="col" style={{ paddingTop: "10px"}}>
              <br />
              <div style={{ width:"20%", margin: "auto"}}>
                <h3 style={{textAlign: "center"}}>Edit client: <i style={{ color:"red", textTransform: "uppercase"}}>{customer_name}</i></h3>
              </div>
              <div className="row">
                <div className="col"></div>
                <div className="col-5" style={{ borderColor: "lightgrey", borderWidth : "1px", borderStyle: "solid", padding : "10px"}}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group  controlId="FormCustomerName" >
                  <Form.Label column="md">
                    Name of Client:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="sm" 
                      value={customer_name} 
                      onChange={e=>setCustomerName(e.target.value)} 
                      type="text" 
                      placeholder="Customer Name"
                      required
                      disabled
                       />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid customer name.
                      </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group  controlId="FormProductName">
                  <Form.Label column="md">
                    Product Name:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={product_name} 
                      onChange={e=>setProductName(e.target.value)} 
                      type="text" 
                      placeholder="Product Name" 
                      required

                      />
                  </Col>
                </Form.Group>
                <fieldset>
                  <Form.Group >
                    <Form.Label as="legend" column="md">
                      Gender:
                    </Form.Label>
                    <Col>
                      <Form.Check
                        defaultChecked
                        value="M"
                        inline
                        type="radio"
                        label="Male"
                        name="GenderRadios"
                        id="GenderRadios1"
                        onChange={(e)=> setGender(e.target.value)}
                      />
                      <Form.Check
                        value="F"
                        inline
                        type="radio"
                        label="Female"
                        name="GenderRadios"
                        id="GenderRadios2"
                        onChange={(ref)=> setGender(ref.target.value)}
                      />
                    </Col>
                  </Form.Group>
                </fieldset>

                <Form.Group  controlId="address">
                  <Form.Label column="md">
                    Address of Client:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={address} 
                      onChange={e=>setAddress(e.target.value)} 
                      type="text" 
                      placeholder="Address" 
                      required

                      />
                  </Col>
                </Form.Group>

                <Form.Group  controlId="phone_number">
                  <Form.Label column="md">
                    Contact Phone #:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={phone_number} 
                      onChange={e=>setPhoneNumber(e.target.value)} 
                      type="number" 
                      placeholder="Phone Number" 
                      required

                      />
                  </Col>
                </Form.Group>

                <Form.Group  controlId="email">
                  <Form.Label column="md">
                    Email:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={email} 
                      onChange={(e)=> setEmail(e.target.value)} 
                      type="email" 
                      placeholder="Email" 
                      required

                      />
                  </Col>
                </Form.Group>
                <Form.Group  controlId="email">
                  <Row className="mx-auto">
                    <Col >
                      <Link to="/customers">
                        <Button  variant="danger">Cancel</Button>
                      </Link>
                      <Button className="px-4 mx-4" variant="outline-success" type="submit">Update</Button>
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
                            <th colSpan="2" style={{textAlign:"center"}}>ARE THE DETAILS BELOW CORRECT?</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Customer Name:</td>
                            <td>{customer_name}</td>
                          </tr>
                          <tr>
                            <td>Product Name:</td>
                            <td>{product_name}</td>
                          </tr>
                          <tr>
                            <td>Gender:</td>
                            <td>{gender}</td>
                          </tr>
                          <tr>
                            <td>Address:</td>
                            <td>{address}</td>
                          </tr>
                          <tr>
                            <td>Contact Number:</td>
                            <td>{phone_number}</td>
                          </tr>
                          <tr>
                            <td>Email:</td>
                            <td>{email}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <code style={{ textAlign: "center"}}>{ errMessage}</code>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer className="justify-content-start mx-2">
                  
                    <Button variant="danger" onClick={handleClose}>
                      Back
                    </Button>
                    <Button
                      variant="success"
                      disabled={isLoading}
                      onClick={!isLoading ? handleClick : null}
                    >
                      {isLoading ? 'Loading…' : 'Update Details'}
                    </Button>
                  </Modal.Footer>
                </Modal>
                </div>
                <div className="col"></div>
                
              </div>
              <br />
            </div>
  )
}

export const AddCustomer = (props) => {
    const [customer_name, setCustomerName] = useState("")
    const [product_name, setProductName] = useState("")
    const [gender, setGender] = useState("M")
    const [address, setAddress] = useState("")
    const [phone_number, setPhoneNumber] = useState("")
    const [email, setEmail] = useState("")
    const [errMessage, setErrMessage] = useState("")

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const { authTokens } = useAuth()

    useEffect(() => {
      if (isLoading) {
        add_customer()
      }
    }, [isLoading]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClick = () => setLoading(true);

    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }else {
        event.preventDefault();
        event.stopPropagation();
        setErrMessage("")
        handleShow()
      }
      setValidated(true);
    };
    
    
    const add_customer =()=>{
        var data = {
          "customer_name": customer_name,
          "product_name": product_name,
          "phone_number": phone_number,
          "email": email,
          "gender": gender,
          "address": address,
          
        };
        var options = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'JWT ' + authTokens
          }
        }
        console.log(data)
        CustomerDataService.create(data, options)
          .then(response => {
            // props.history.push('/sessions/current', response.data)
            setLoading(false)
            props.history.push('/customers')
          })
          .catch(e => {
            if(e.response.status === 400 && e.response.data.customer_name[0] !== undefined){
              if(e.response.data.customer_name[0] === undefined){
                setErrMessage("Please try again.")
                return
              }
              setErrMessage(e.response.data.customer_name[0])
              
              setLoading(false)
            }else if(e.response.status===500){

              props.history.push('/')
            }
            });
    
      }
    return (
      <div className="col" style={{ paddingTop: "10px"}}>
              <br />
              <div style={{ width:"20%", margin: "auto"}}>
                <h4 style={{textAlign: "center"}}>CLIENT INFORMATION</h4>
              </div>
              <div className="row">
                <div className="col"></div>
                <div className="col-5" style={{ borderColor: "lightgrey", borderWidth : "1px", borderStyle: "solid", padding : "10px"}}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group  controlId="FormCustomerName" >
                  <Form.Label column="md">
                    Name of Client:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="sm" 
                      value={customer_name} 
                      onChange={e=>setCustomerName(e.target.value)} 
                      type="text" 
                      placeholder="Customer Name"
                      required
                       />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid customer name.
                      </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group  controlId="FormProductName">
                  <Form.Label column="md">
                    Product Name:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={product_name} 
                      onChange={e=>setProductName(e.target.value)} 
                      type="text" 
                      placeholder="Product Name" 
                      required

                      />
                  </Col>
                </Form.Group>
                <fieldset>
                  <Form.Group >
                    <Form.Label as="legend" column="md">
                      Gender:
                    </Form.Label>
                    <Col>
                      <Form.Check
                        defaultChecked
                        value="M"
                        inline
                        type="radio"
                        label="Male"
                        name="GenderRadios"
                        id="GenderRadios1"
                        onChange={(e)=> setGender(e.target.value)}
                      />
                      <Form.Check
                        value="F"
                        inline
                        type="radio"
                        label="Female"
                        name="GenderRadios"
                        id="GenderRadios2"
                        onChange={(ref)=> setGender(ref.target.value)}
                      />
                    </Col>
                  </Form.Group>
                </fieldset>

                <Form.Group  controlId="address">
                  <Form.Label column="md">
                    Address of Client:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={address} 
                      onChange={e=>setAddress(e.target.value)} 
                      type="text" 
                      placeholder="Address" 
                      required

                      />
                  </Col>
                </Form.Group>

                <Form.Group  controlId="phone_number">
                  <Form.Label column="md">
                    Contact Phone #:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={phone_number} 
                      onChange={e=>setPhoneNumber(e.target.value)} 
                      type="number" 
                      placeholder="Phone Number" 
                      required

                      />
                  </Col>
                </Form.Group>

                <Form.Group  controlId="email">
                  <Form.Label column="md">
                    Email:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={email} 
                      onChange={(e)=> setEmail(e.target.value)} 
                      type="email" 
                      placeholder="Email" 
                      required

                      />
                  </Col>
                </Form.Group>
                <Form.Group  controlId="email">
                  <Row className="mx-auto">
                    <Col >
                      <Link to="/customers">
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
                            <th colSpan="2" style={{textAlign:"center"}}>ARE THE DETAILS BELOW CORRECT?</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Customer Name:</td>
                            <td>{customer_name}</td>
                          </tr>
                          <tr>
                            <td>Product Name:</td>
                            <td>{product_name}</td>
                          </tr>
                          <tr>
                            <td>Gender:</td>
                            <td>{gender}</td>
                          </tr>
                          <tr>
                            <td>Address:</td>
                            <td>{address}</td>
                          </tr>
                          <tr>
                            <td>Contact Number:</td>
                            <td>{phone_number}</td>
                          </tr>
                          <tr>
                            <td>Email:</td>
                            <td>{email}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <code style={{ textAlign: "center"}}>{ errMessage}</code>
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
                      {isLoading ? 'Loading…' : 'Add Customer'}
                    </Button>
                  </Modal.Footer>
                </Modal>
                </div>
                <div className="col"></div>
                
              </div>
              <br />
            </div>
            // <div className="col" style={{ paddingTop: "10px"}}>
            //   <h3 style={{ textAlign: "center"}}> Client Details</h3>
            //   <hr />
            //   <div className="row">
            //     <div className="col"></div>
            //     <div className="col-6" style={{ borderColor: "gray", borderWidth : "1px", borderStyle: "solid", padding : "10px"}}>
            //     <Form noValidate validated={validated} onSubmit={handleSubmit}>
            //     <Form.Group as={Row} controlId="FormCustomerName" >
            //       <Form.Label column="sm">
            //         Name of Client:
            //       </Form.Label>
            //       <Col sm={8}>
            //         <Form.Control 
            //           size="sm" 
            //           value={customer_name} 
            //           onChange={e=>setCustomerName(e.target.value)} 
            //           type="text" 
            //           placeholder="Customer Name"
            //           required
            //            />
            //           <Form.Control.Feedback type="invalid">
            //             This field is required.
            //           </Form.Control.Feedback>
            //       </Col>
            //     </Form.Group>

            //     <Form.Group as={Row} controlId="FormProductName">
            //       <Form.Label column="sm">
            //         Product Name:
            //       </Form.Label>
            //       <Col sm={8}>
            //         <Form.Control 
            //           size="sm" 
            //           value={product_name} 
            //           onChange={e=>setProductName(e.target.value)} 
            //           type="text" 
            //           placeholder="Product Name" 
            //           required
            //           />
            //           <Form.Control.Feedback type="invalid">
            //             This field is required.
            //           </Form.Control.Feedback>
            //       </Col>
            //     </Form.Group>
            //     <fieldset>
            //       <Form.Group as={Row}>
            //         <Form.Label as="legend" column="sm">
            //           Gender:
            //         </Form.Label>
            //         <Col sm={8}>
            //           <Form.Check
            //             required
            //             value="M"
            //             inline
            //             type="radio"
            //             label="Male"
            //             name="GenderRadios"
            //             id="GenderRadios1"
            //             onChange={(e)=> setGender(e.target.value)}
            //           />
            //           <Form.Check
            //             required
            //             value="F"
            //             inline
            //             type="radio"
            //             label="Female"
            //             name="GenderRadios"
            //             id="GenderRadios2"
            //             onChange={(ref)=> setGender(ref.target.value)}
            //           />
            //         </Col>
            //       </Form.Group>
            //     </fieldset>

            //     <Form.Group as={Row} controlId="address">
            //       <Form.Label column="sm">
            //         Address of Client:
            //       </Form.Label>
            //       <Col sm={8}>
            //         <Form.Control 
            //           size="sm" 
            //           value={address} 
            //           onChange={e=>setAddress(e.target.value)} 
            //           type="text" 
            //           placeholder="Address" 
            //           required
            //           />
            //           <Form.Control.Feedback type="invalid">
            //             This field is required.
            //           </Form.Control.Feedback>
            //       </Col>
            //     </Form.Group>

            //     <Form.Group as={Row} controlId="phone_number">
            //       <Form.Label column="sm">
            //         Contact Phone #:
            //       </Form.Label>
            //       <Col sm={8}>
            //         <Form.Control 
            //           size="sm" 
            //           value={phone_number} 
            //           onChange={e=>setPhoneNumber(e.target.value)} 
            //           type="number" 
            //           placeholder="Phone Number" 
            //           required
            //           />
            //           <Form.Control.Feedback type="invalid">
            //             This field is required.
            //           </Form.Control.Feedback>
            //       </Col>
            //     </Form.Group>

            //     <Form.Group as={Row} controlId="email">
            //       <Form.Label column="sm">
            //         Email:
            //       </Form.Label>
            //       <Col sm={8}>
            //         <Form.Control 
            //           size="sm" 
            //           value={email} 
            //           onChange={(e)=> setEmail(e.target.value)} 
            //           type="email" 
            //           placeholder="Email" 
            //           required
                      
            //           />
            //           <Form.Control.Feedback type="invalid">
            //             This field requires a valid email address. 
            //             "example@gmail.com"
            //           </Form.Control.Feedback>
            //       </Col>
            //     </Form.Group>
            //     <Form.Group as={Row} controlId="email">
            //       <Form.Label column sm={2}>
            //       </Form.Label>
            //       <Col sm={8}>
            //         <Button variant="outline-primary" type="submit" block>Save</Button>
            //         {/* <Button variant="outline-primary" onClick={(event)=> handleSubmit(event)} block>Save</Button> */}
            //       </Col>
            //     </Form.Group>
            //   </Form>
            //   <Modal show={show} onHide={handleClose}>
            //       <Modal.Header closeButton>
            //         <Modal.Title>Confirmation</Modal.Title>
            //       </Modal.Header>
            //       <Modal.Body>
            //         <Container>
            //           <Table striped bordered hover>
            //             <thead>
            //               <tr>
            //                 <th colSpan="2" style={{textAlign:"center"}}>ARE THE VALUES BELOW CORRECT?</th>
            //               </tr>
            //             </thead>
            //             <tbody>
            //               <tr>
            //                 <td>Customer Name:</td>
            //                 <td>{customer_name}</td>
            //               </tr>
            //               <tr>
            //                 <td>Product Name:</td>
            //                 <td>{product_name}</td>
            //               </tr>
            //               <tr>
            //                 <td>Gender:</td>
            //                 <td>{gender}</td>
            //               </tr>
            //               <tr>
            //                 <td>Address:</td>
            //                 <td>{address}</td>
            //               </tr>
            //               <tr>
            //                 <td>Contact Number:</td>
            //                 <td>{phone_number}</td>
            //               </tr>
            //               <tr>
            //                 <td>Email:</td>
            //                 <td>{email}</td>
            //               </tr>
            //             </tbody>
            //           </Table>
            //           <code style={{ color: "red", marginLeft: "10px" }}>{ errMessage}</code>
            //         </Container>
            //       </Modal.Body>
            //       <Modal.Footer>
            //         <Button variant="secondary" onClick={handleClose}>
            //           Close
            //         </Button>
            //         <Button
            //           variant="primary"
            //           disabled={isLoading}
            //           onClick={!isLoading ? handleClick : null}
            //         >
            //           {isLoading ? 'Loading…' : 'Add Customer'}
            //         </Button>
            //       </Modal.Footer>
            //     </Modal>
            //     </div>
            //     <div className="col"></div>
                
            //   </div>
            //   <br />
            // </div>
    )
}
const CustomerList = (props) => {
    return ( 
      <Container>
        <br />
        <ToolkitProvider
          keyField="id"
          data={ props.customers }
          columns={ columns }
          search
        >
          { table_props => (  
            <Row>
              <Col sm="2">
                <Link to="/customers/create">
                  <Button variant="outline-dark" >
                      Add Customer
                  </Button>
                </Link>
              </Col>
              <Col sm="10">
                  <Row>
                    <Col>
                      <SearchBar { ...table_props.searchProps } />
                    </Col>
                    <Col>
                      
                    </Col>
                  </Row>
                  <BootstrapTable
                  rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                      console.log(row)
                      props.prop.history.push('/customers/update', row)
                      
                    }}}
                    {...table_props.baseProps}>
                  </BootstrapTable>
              </Col>
            </Row>
            )
          }
        </ToolkitProvider>
      </Container>
     );
}
export const CustomerPage = (props)=>{
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([])
    const { authTokens } = useAuth()
    var options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + authTokens
      }
    }
    useEffect(()=> {
      setLoading(true)
      CustomerDataService.getAll(options)
        .then(response => {
            setCustomers(response.data.results)
          setLoading(false)
          console.log(response);
        })
        .catch(e => {
          setLoading(false)
          console.log(e);
        });
        return ()=> CustomerDataService.cancelToken()
    },[])
  
    
  
  
    return loading ? 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> : 
        <CustomerList customers= {customers} prop={props}/>
      
    
  }
