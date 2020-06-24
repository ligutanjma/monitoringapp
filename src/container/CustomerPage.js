import React, { useState, useEffect} from 'react'
import { useAuth } from '../components/auth'
import CustomerDataService from '../services/CustomerDataService'
import { Link, useHistory } from "react-router-dom";

import {FaSearch} from 'react-icons/fa'
import {AiOutlinePlus, AiOutlineDelete} from 'react-icons/ai'



import Spinner from 'react-bootstrap/Spinner'
import { Container, Row, Col, Form, Button, Modal, Table, InputGroup, FormControl, OverlayTrigger, Tooltip} from 'react-bootstrap';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { dateFilter,Comparator } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const columns = [{
    dataField:"created",
    text:"Date",
    sort: true,
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
    <div className="w3-container" style={{width:"500px",margin:"auto", paddingTop: "10px"}}>
              <br />
              <div className="w3-row" style={{}}>
                <h3 className="justify-content-center" style={{ textAlign:"center"}}>Edit client: <i style={{ textTransform: "uppercase"}}>{customer_name}</i></h3>
              </div>
              <div className="w3-row">
                <div className="w3-container" style={{padding : "10px",
                  boxShadow:"2px 4px 8px 2px rgb(0,0,0,0.2), 4px 8px 16px 4px rgb(0,0,0,0.1)"}}>

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
    const [job_order, setJobOrderType] = useState("")

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
    
    
    const add_customer =()=>{
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
              });
            
            
          
    
      }
    return (
      <div className="w3-container" style={{width:"500px",margin:"auto", paddingTop: "10px"}}>

        <br />
        <div  className="w3-row">
          <h2 className="w3-text-white" style={{textAlign: "center", margin: "0 0 15px", textShadow:"2px 2px 4px #000000"}}>JOB ORDER FORM</h2>
        </div>
        <div className="w3-row">
          <div className="w3-container" style={{width:"500px",  borderColor: "lightgrey", borderWidth : "1px", borderStyle: "solid", padding : "10px", 
            boxShadow:"2px 4px 8px 2px rgb(0,0,0,0.2), 4px 8px 16px 4px rgb(0,0,0,0.1),"}}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <fieldset>
                    <Form.Group className="w3-large">
                      <Col  style={{padding:"10px 15px", textAlign:"center"}}>

                        <Form.Check
                          
                          value="A"
                          inline
                          type="radio"
                          label="Advisory"
                          name="FormCheckbox"
                          id="FormCheckbox1"
                          onChange={(e)=> setJobOrderType(e.target.value)}
                          required
                        />
                        <Form.Check
                          value="FE"
                          inline
                          type="radio"
                          label="Facility/Equipment"
                          name="FormCheckbox"
                          id="FormCheckbox2"
                          onChange={(e)=> setJobOrderType(e.target.value)}
                          required

                        />
                        <Form.Check
                          value="L"
                          inline
                          type="radio"
                          label="Laboratory"
                          name="FormCheckbox"
                          id="FormCheckbox3"
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
                      <div style={{textAlign: "center"}} >
                        <code >{errMessage}</code>
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
                      {isLoading ? 'Loading…' : 'Add Customer'}
                    </Button>
                  </Modal.Footer>
                </Modal>
                </div>
                
              </div>
              <br />
            </div>
    )
}
const CustomerList = (props) => {
  let history= useHistory()
  const MyVerticallyCenteredModal=(props)=>{

    return (
      <Modal
        {...props}
        size="sm"
        dialogAs="h1"
        dialogClassName="modal-dialog modal-dialog-centered justify-content-center"
      >
          <Spinner size="lg" animation="border" role="status">
            
          </Spinner>

      </Modal>
    );
  }
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total w3-padding">
      Showing { from } to { to } of { size } Results
    </span>
  );
  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange
  }) => (
    <div className="btn-group" role="group">
      {
        options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={ option.text }
              type="button"
              onClick={ () => onSizePerPageChange(option.page) }
              className="btn w3-border"
              style={{backgroundColor: `${isSelect ? '#007bff':'#FFFFFF'}`, color: `${isSelect ? '#FFFFFF':'#007bff'}`}}
            >
              { option.text }
            </button>
          );
        })
      }
    </div>
  );
  const options = {
    sizePerPageRenderer,
    customer: true,
    paginationSize: 4,
    pageStartIndex: 1,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [{
      text: '5', value: 5
    }, {
      text: '10', value: 10
    }, {
      text: 'All', value: props.data.count
    }] // A numeric array is also available. the purpose of above example is custom the text
  };
    return ( 
      <Container>
      <div className="w3-row w3-section" >

            <div className="w3-col w3-container w3-hide-small" style={{}}>
              <ToolkitProvider
                keyField="id"
                data={ props.customers }
                columns={ columns }
                search
              >
                { table_props => (  
                    <div>
                      <MyVerticallyCenteredModal show={props.loading} />
                      
                      {/* <Button style={{color:"#D4490D"}} variant="link"><FaSearch style={{margin :"10px"}} size="2em"></FaSearch></Button>
                      <SearchBar style={{width: "100%"}} { ...table_props.searchProps } />
                       */}
                      <div className="w3-hide-large w3-hide-small" style={{display:"flex", whiteSpace:"nowrap"}}>  
                          <div  style={{ margin:"15px 0 10px"}}>
                              <Link to="/customers/create">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 300 }}
                                  overlay={
                                      <Tooltip id="button-tooltip">
                                          Add Customer
                                      </Tooltip>
                                  }
                                >
                                  <Button className="w3-card w3-margin-right" style={{color:"#D4490D"}} variant="link">
                                      <AiOutlinePlus size="2em"/>
                                  </Button>
                                </OverlayTrigger>
                              </Link>
                              
                          </div>
                            <InputGroup className="mb-3 w3-card-2" style={{ margin:"15px 0 10px",width:"370px",borderRadius:"5px" }}>
                              <InputGroup.Prepend >
                                <Button 
                                  variant="default" 
                                  style={{color:"#FFFFFF",backgroundColor:"#F26122", borderRadius:"5px 0 0 5px"}} 
                                  onClick={()=> document.getElementById("search-control").focus()} >
                                  <FaSearch size="1em"></FaSearch>
                                </Button>
                              </InputGroup.Prepend>
                              <FormControl
                                size="lg"
                                id="search-control"
                                placeholder="Search"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={ref=> table_props.searchProps.onSearch(ref.target.value)}
                                
                              />
                              <InputGroup.Append >
                                <Button 
                                  onClick={()=>table_props.searchProps.onClear(document.getElementById('search-control').value = '')} 
                                  style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default">
                                  <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                                </Button>
                              </InputGroup.Append>
                            </InputGroup>
                      </div>
                      <div className="w3-hide-medium w3-hide-small" style={{display:"flex", whiteSpace:"nowrap"}}>
                        <div className="w3-center w3-section" >
                              <Link to="/customers/create">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 300 }}
                                  overlay={
                                      <Tooltip id="button-tooltip">
                                          Add Customer
                                      </Tooltip>
                                  }
                                >
                                  <Button className="w3-card w3-margin-right" style={{color:"#D4490D"}} variant="link">
                                      <AiOutlinePlus strokeWidth="20px" size="2em"/>
                                  </Button>
                                </OverlayTrigger>
                              </Link>
                        </div>
                        <InputGroup className="mb-3 w3-card-2" style={{ margin:"15px 0 10px",width:"60%",borderRadius:"5px" }}>
                          <InputGroup.Prepend >
                            <Button variant="default" style={{color:"#FFFFFF",backgroundColor:"#F26122", borderRadius:"5px 0 0 5px"}} onClick={()=> document.getElementById("search2-control").focus()} >
                              <FaSearch size="1em"></FaSearch>
                            </Button>
                          </InputGroup.Prepend>
                          <FormControl
                            size="lg"
                            id="search2-control"
                            placeholder="Customer/Product/Phone Number/Email"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={ref=> table_props.searchProps.onSearch(ref.target.value)}
                            
                          />
                          <InputGroup.Append >
                            <Button 
                              onClick={()=>table_props.searchProps.onClear(document.getElementById('search2-control').value = '')} 
                              style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default">
                              <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                            </Button>
                          </InputGroup.Append>
                        </InputGroup>
                      </div>
                      <div className="w3-card-2 w3-padding w3-hide-small">
                        <BootstrapTable
                          striped
                          bootstrap4
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                            history.push({pathname:'/customers/update',state: row})
                            
                          }}}
                          pagination={paginationFactory(options)}
                          filter={filterFactory()}
                          {...table_props.baseProps}>
                        </BootstrapTable> 
                      </div>
                      <div className="w3-card-2 w3-padding w3-hide-large w3-hide-medium" style={{whiteSpace:"nowrap", boxSizing:"border-box"}}>
                        <BootstrapTable
                          
                          striped
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                            history.push({pathname:'/customers/update',state: row})

                            
                          }}}
                          pagination={paginationFactory(options)}
                          filter={filterFactory()}
                          {...table_props.baseProps}>
                        </BootstrapTable> 
                      </div>

                    </div>

              
                  )
                }
              </ToolkitProvider>
            </div>
            <div className="w3-hide-large w3-hide-medium">
              <ToolkitProvider
                keyField="id"
                data={ props.customers }
                columns={ small_screen_columns }
                search
              >
                { table_props => (  
                    <div className="w3-hide-large w3-hide-medium">
                      
                        <BootstrapTable
                          
                          striped
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                            history.push({pathname:'/customers/update',state: row})

                            
                          }}}
                          pagination={paginationFactory(options)}
                          {...table_props.baseProps}>
                        </BootstrapTable> 
                    </div>

              
                  )
                }
              </ToolkitProvider>
            </div>
      </div>
      </Container>
     );
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
  
    return <CustomerList loading={loading} customers= {customers} prop={props} data={data}/>
}
  
