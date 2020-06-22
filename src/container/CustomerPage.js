import React, { Component, useState, useEffect} from 'react'
import { useAuth } from '../components/auth'
import CustomerDataService from '../services/CustomerDataService'
import { Link, useHistory } from "react-router-dom";


import { Container, Row, Col, Form, Button, Modal, Table} from 'react-bootstrap';
import { dateFilter,Comparator,customFilter,FILTER_TYPES, CustomFilterProps, Type } from 'react-bootstrap-table2-filter';
import InputField from '../reusable/InputField'
import {ButtonField} from '../reusable/Button/ButtonField'
import {FormContainer} from '../reusable/FormContainer'
import TableContainer from '../reusable/TableContainer'
import {DateRangeFilter} from '../reusable/DateRangeFilter'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
function getCustomFilter(filterHandler, customFilterParameters) {
  return (
    <DateRangeFilter filterHandler={filterHandler} />
  );
}

const columns = [{
    dataField:"date",
    text:"Date",
    sort: true,
    headerStyle: (column, colIndex)=>{
      return {color:"#007bff", textAlign:"center"}
    },
    },{
    dataField: 'id',
    text: 'ID',
    hidden: true
    }, {
      dataField: 'customer_name',
      text: 'Customer Name',
      sort: true,
      headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
      }
    },{
      dataField: 'product_name',
      text: 'Product Name',
      sort: true,
      headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
      }

    },
    {
      dataField: 'phone_number',
      text: 'Phone Number',
      searchable: false,

    }, {
        dataField: 'email',
        text: 'Email Address',
        sort: true,
        headerStyle: (column, colIndex)=>{
          return {color:"#007bff", textAlign:"center"}
        }

      }];
const small_screen_columns = [{
        dataField: 'id',
        text: 'ID',
        hidden: true
        }, {
          dataField: 'customer_name',
          text: 'Customer Name',
          sort: true,
          headerStyle: (column, colIndex)=>{
            return {color:"#007bff", textAlign:"center"}
          }
        },{
          dataField: 'product_name',
          text: 'Product Name',
          sort: true,
          headerStyle: (column, colIndex)=>{
            return {color:"#007bff", textAlign:"center"}
          }
    
        },
        {
          dataField: 'phone_number',
          text: 'Phone Number',
          searchable: false,
    
        }];
        

export const UpdateCustomer = (props) => {
  let history = useHistory()
  const [customer_name, setCustomerName] = useState(props.location.state.customer_name)
  const [product_name, setProductName] = useState(props.location.state.product_name)
  const [gender, setGender] = useState(props.location.state.gender)
  const [address, setAddress] = useState(props.location.state.address)
  const [phone_number, setPhoneNumber] = useState(props.location.state.phone_number)
  const [email, setEmail] = useState(props.location.state.email)
  const [errMessage, setErrMessage] = useState("")
  const [job_order, setJobOrderType] = useState(props.location.state.job_order)

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
    setJobOrderType(props.location.state.job_order)
    try{

      document.getElementById(props.location.state.gender).click()
      document.getElementById(props.location.state.job_order).click()
    }catch{
      return
    }


    
  }, [props])


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClick = () => {
    setLoading(true)
    update_customer()
  };

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
      "job_order" : job_order,
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
    CustomerDataService.patch(props.location.state.id, data, options)
      .then(response => {
        // props.history.push('/sessions/current', response.data)
        setLoading(false)
        history.push({pathname:'/customers'})
      })
      .catch(e => {
        try{
          setErrMessage(e.response.data.customer_name[0])
        }catch{
          setErrMessage("Please try again.")
        }
            
      });

  }
  return (
    <FormContainer formType="EDIT CLIENT" formTitle={customer_name}>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <fieldset>
                    <Form.Group className="w3-large">
                      <Col  style={{padding:"10px 15px", textAlign:"center"}}>

                        <Form.Check
                          
                          value="A"
                          inline
                          type="radio"
                          label="Advisory"
                          name="JobType"
                          id="A"
                          onChange={(e)=> setJobOrderType(e.target.value)}
                          required
                        />
                        <Form.Check
                          value="FE"
                          inline
                          type="radio"
                          label="Facility/Equipment"
                          name="JobType"
                          id="FE"
                          onChange={(e)=> setJobOrderType(e.target.value)}
                          required

                        />
                        <Form.Check
                          value="L"
                          inline
                          type="radio"
                          label="Laboratory"
                          name="JobType"
                          id="L"
                          onChange={(e)=> setJobOrderType(e.target.value)}
                          required
                        />
                        
                      </Col>
                    </Form.Group>
                  </fieldset>
                <Form.Group  controlId="FormCustomerName" >
                  <Form.Label column="md">
                    Name of Client:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
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

                <Form.Group controlId="FormProductName">
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
                    <Col className="w3-large">
                      <Form.Check
                        value="M"
                        inline
                        type="radio"
                        label="Male"
                        name="GenderRadios"
                        id="M"
                        onChange={(e)=> setGender(e.target.value)}
                      />
                      <Form.Check
                        value="F"
                        inline
                        type="radio"
                        label="Female"
                        name="GenderRadios"
                        id="F"
                        onChange={(e)=> setGender(e.target.value)}
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
                        <ButtonField buttonStyle="btns-cancel">Cancel</ButtonField>
                      </Link>
                      <ButtonField buttonStyle="btns-primary" type="submit">Update</ButtonField>
                      {/* <Button variant="outline-primary" onClick={(event)=> handleSubmit(event)} block>Save</Button> */}
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
              
              <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmations</Modal.Title>
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
                            <td>Job Order Type:</td>
                            <td>{job_order}</td>
                          </tr>
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
                  
                    <ButtonField buttonStyle="btns-cancel" onClick={handleClose}>
                      Back
                    </ButtonField>
                    <ButtonField
                      buttonStyle="btns-primary"
                      etc={{ disabled: isLoading}}
                      onClick={!isLoading ? handleClick : null}
                    >
                      {isLoading ? 'Loading…' : 'Update Details'}
                    </ButtonField>
                  </Modal.Footer>
                </Modal>
                
            </FormContainer>
  )
}

export const AddCustomer = (props) => {
  const [values, setValues] = useState({
    date: "",
    customer_name:"",
    product_name:"",
    gender:"",
    address:"",
    phone_number:"",
    email:"",
    job_order:"",

  })
  
  const [errMessage, setErrMessage] = useState("")

  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { authTokens } = useAuth()
  let history = useHistory()
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
  const handleChange = (event)=>{
    setValues({
        ...values,
        [event.target.name]: event.target.value
    })
  }
    
  const add_customer =()=>{
    var data = {
      "date": values.date,
      "job_order" : values.job_order,
      "customer_name": values.customer_name,
      "product_name": values.product_name,
      "phone_number": values.phone_number,
      "email": values.email,
      "gender": values.gender,
      "address": values.address,
      
    };
    var options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + authTokens
      }
    }
    CustomerDataService.create(data, options)
      .then(response => {
        // props.history.push('/sessions/current', response.data)
        setLoading(false)
        history.push({pathname:'/customers'})

      })
      .catch(e => {
        console.log(e)
        try{
          setErrMessage(e.response.data.customer_name[0])
        }catch{
          setErrMessage("Please try again.")
        } 
        setLoading(false)

      });
          
          
        
  
    }
    return (
      <FormContainer formType="JOB ORDER FORM">

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <fieldset>
                    <Form.Group className="w3-large">
                      <Col  style={{padding:"10px 15px", textAlign:"center"}}>
                        <Form.Check
                          
                          value="A"
                          inline
                          type="radio"
                          label="Advisory"
                          name="job_order"
                          onChange={handleChange}
                          required
                        />
                        <Form.Check
                          value="FE"
                          inline
                          type="radio"
                          label="Facility/Equipment"
                          name="job_order"
                          onChange={handleChange}
                          required

                        />
                        <Form.Check
                          value="L"
                          inline
                          type="radio"
                          label="Laboratory"
                          name="job_order"
                          onChange={handleChange}
                          required
                        />
                      </Col>
                    </Form.Group>
                  </fieldset>

                <InputField 
                  name="date" 
                  label="Date:"
                  value={values.date}
                  type="date"
                  onChange={handleChange}
                  etc={{disabled:false, required: true}}
                />
                <InputField 
                  name="customer_name" 
                  label="Full Name:"
                  value={values.customer_name}
                  type="text"
                  placeholder="Name of Client"
                  onChange={handleChange}
                  etc={{disabled:false, required: true}}
                />
                <InputField 
                  name="product_name" 
                  label="Product's Name:"
                  value={values.product_name}
                  type="text"
                  placeholder="Name of Product"
                  onChange={handleChange}
                  etc={{disabled:false, required: true}}
                />

                
                <fieldset>
                  <Form.Group >
                    <Form.Label as="legend" column="md">
                      Gender:
                    </Form.Label>
                    <Col>
                      <Form.Check
                        value="M"
                        inline
                        type="radio"
                        label="Male"
                        name="gender"
                        onChange={handleChange}
                      />
                      <Form.Check
                        value="F"
                        inline
                        type="radio"
                        label="Female"
                        name="gender"
                        onChange={handleChange}
                      />
                    </Col>
                  </Form.Group>
                </fieldset>

                <InputField 
                  name="address" 
                  label="Address of Client:"
                  value={values.address}
                  type="text"
                  placeholder="Address"
                  onChange={handleChange}
                  etc={{disabled:false, required: false}}
                />
              
                <InputField 
                  name="phone_number" 
                  label="Contact Phone #:"
                  value={values.phone_number}
                  type="number"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  etc={{disabled:false, required: true}}
                />
                <InputField   
                  name="email" 
                  label="Email:"
                  value={values.email}
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  etc={{disabled:false, required: false}}
                />
                
                <Form.Group>
                  <Row className="mx-auto">
                    <Col >
                      <Link to="/customers">
                        <ButtonField buttonStyle="btns-cancel" buttonSize="btns-medium">Cancel</ButtonField>
                      </Link>
                      <ButtonField buttonStyle="btns-primary" buttonSize="btns-medium" type="submit">Save</ButtonField>
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
                            <td>Date:</td>
                            <td>{values.date}</td>
                          </tr>
                          <tr>
                            <td>Job Order Type:</td>
                            <td>{values.job_order}</td>
                          </tr>
                          <tr>
                            <td>Customer Name:</td>
                            <td>{values.customer_name}</td>
                          </tr>
                          <tr>
                            <td>Product Name:</td>
                            <td>{values.product_name}</td>
                          </tr>
                          <tr>
                            <td>Gender:</td>
                            <td>{values.gender}</td>
                          </tr>
                          <tr>
                            <td>Address:</td>
                            <td>{values.address}</td>
                          </tr>
                          <tr>
                            <td>Contact Number:</td>
                            <td>{values.phone_number}</td>
                          </tr>
                          <tr>
                            <td>Email:</td>
                            <td>{values.email}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <div style={{textAlign: "center"}} >
                        <code >{errMessage}</code>
                      </div>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer className="justify-content-start mx-2">
                  
                    <ButtonField buttonStyle="btns-cancel" onClick={handleClose}>
                      Close
                    </ButtonField>
                    <ButtonField
                      buttonStyle="btns-primary"
                      etc={{ disabled: isLoading}}
                      onClick={!isLoading ? handleClick : null}
                    >
                      {isLoading ? 'Loading…' : 'Add Customer'}
                    </ButtonField>
                  </Modal.Footer>
                </Modal>
      </FormContainer>
      
    )
}


export const CustomerPage = (props)=>{
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([])
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
      CustomerDataService.getAll(options)
        .then(response => {
          setData(response.data)
          setCustomers(response.data.results)
          setLoading(false)
        })
        .catch(e => {
          setLoading(false)
          console.log(e);
        });
        return ()=> CustomerDataService.cancelToken()
    },[])
    const handleFilter = (start, end)=> {
      setLoading(true)
      CustomerDataService.filter(start, end, options)
      .then(response=> {
        console.log(response.data)
        setData(response.data)
        setCustomers(response.data.results)
        setLoading(false)

      })
      .catch(err=> {
        setLoading(false)
        console.log(err);
      })
    }
    return (
        <TableContainer tips="Add Customer" data={customers} count={data.count} columns={columns} filterByDate={handleFilter}/>
    )
}
  
