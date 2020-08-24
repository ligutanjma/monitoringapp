import React, { useState, useEffect } from 'react';
import {
    Link,
    NavLink,
    useHistory
  } from "react-router-dom";
import { Container, Row, Col, Form, Modal, Button, Table, OverlayTrigger, Tooltip} from 'react-bootstrap';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import SessionDataService from '../services/SessionDataService'
import {useAuth} from '../components/auth'
import Spinner from 'react-bootstrap/Spinner'

import {FaSearch} from 'react-icons/fa'
import {AiOutlinePlus, AiOutlineDelete} from 'react-icons/ai'
import { InputGroup, FormControl} from 'react-bootstrap';
import TableContainer from '../reusable/TableContainer'
import {FormContainer} from '../reusable/FormContainer'
import {ButtonField} from '../reusable/Button/ButtonField'
import InputField from '../reusable/InputField'

import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { dateFilter,Comparator } from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

const columns = [
  {
    dataField: 'date',
    text:'Date Created',
    sort:true,
    headerStyle: (column, colIndex)=>{
      return {color:"#007bff"}
    },
  },
  {
  dataField: 'pk',
  text: 'Session ID',
  searchable: false,
  hidden:true

}, {
  dataField: 'product_name',
  text: 'Product name',
  sort:true,
  headerStyle: (column, colIndex)=>{
    return {color:"#007bff", }
  }

}, {
  dataField: 'required_temp',
  text: 'Required Temperature',
  searchable: false
}, {
    dataField: 'holding_time',
    text: 'Holding Time',
    searchable: false
  }];


  const small_screen_columns = [{
    dataField: 'pk',
    text: 'Session ID',
    searchable: false,
    sort:true,
    headerStyle: (column, colIndex)=>{
      return {color:"#007bff", textAlign:"center"}
    }
  
  }, {
    dataField: 'product_name',
    text: 'Product name',
    sort:true,
    headerStyle: (column, colIndex)=>{
      return {color:"#007bff", textAlign:"center"}
    }
  }, {
    dataField: 'required_temp',
    text: 'Required Temperature',
    searchable: false
  }, {
      dataField: 'holding_time',
      text: 'Holding Time',
      searchable: false
    }];


const SessionList = (props) => {
  let history = useHistory()
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
          {/* Hide at medium to small screens */}
            
          {/* Hide at large screens */}
            


            <div className="w3-col w3-container w3-hide-small" style={{}}>
              <ToolkitProvider
                keyField="id"
                data={ props.sessions }
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
                          <Link to="/sessions/create">
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 300 }}
                                overlay={
                                    <Tooltip id="button-tooltip">
                                        Add Session
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
                                <Button variant="default" style={{color:"#FFFFFF",backgroundColor:"#F26122", borderRadius:"5px 0 0 5px"}} onClick={()=> document.getElementById("searchSession-control").focus()} >
                                  <FaSearch size="1em"></FaSearch>
                                </Button>
                              </InputGroup.Prepend>
                              <FormControl
                                size="lg"
                                id="searchSession-control"
                                placeholder="Date / Product Name"
                                aria-label="Search"
                                aria-describedby="Search-addon1"
                                onChange={ref=> table_props.searchProps.onSearch(ref.target.value)}
                                
                              />
                              <InputGroup.Append >
                                <Button 
                                  onClick={()=>table_props.searchProps.onClear(document.getElementById('searchSession-control').value = '')} 
                                  style={{color:"#FFFFFF", backgroundColor:"#F26122", borderRadius:"0 5px 5px 0"}} variant="default">
                                  <AiOutlineDelete size="1.5em"></AiOutlineDelete>
                                </Button>
                              </InputGroup.Append>
                            </InputGroup>
                      </div>
                      <div className="w3-hide-medium w3-hide-small" style={{display:"flex", whiteSpace:"nowrap"}}>
                        <div className="w3-center w3-section" >
                          <Link to="/sessions/create">
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 300 }}
                                overlay={
                                    <Tooltip id="button-tooltip">
                                        Add Session
                                    </Tooltip>
                                }
                            >
                              <Button className="w3-card w3-margin-right" style={{color:"#D4490D"}} variant="link">
                                  <AiOutlinePlus size="2em"/>
                              </Button>
                            </OverlayTrigger>
                          </Link>
                        </div>
                        <InputGroup className="mb-3 w3-card-2" style={{ margin:"15px 0 10px",width:"60%",borderRadius:"5px" }}>
                          <InputGroup.Prepend >
                            <Button 
                              variant="default" 
                              style={{color:"#FFFFFF",backgroundColor:"#F26122", borderRadius:"5px 0 0 5px"}} 
                              onClick={()=> document.getElementById("searchSession2-control").focus()}>
                              <FaSearch size="1em"></FaSearch>
                            </Button>
                          </InputGroup.Prepend>
                          <FormControl
                            size="lg"
                            id="searchSession2-control"
                            placeholder="Date / Product Name"
                            aria-label="Search"
                            aria-describedby="Search-addon1"
                            onChange={ref=> table_props.searchProps.onSearch(ref.target.value)}
                            
                          />
                          <InputGroup.Append >
                            <Button 
                              onClick={()=>table_props.searchProps.onClear(document.getElementById('searchSession2-control').value = '')} 
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
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => history.push({pathname:"/sessions/current", state:row}) }}
                          pagination={paginationFactory(options)}
                          filter={filterFactory()}
                          {...table_props.baseProps}>
                        </BootstrapTable> 
                      </div>
                      <div className="w3-card-2 w3-padding w3-hide-large w3-hide-medium" style={{whiteSpace:"nowrap", boxSizing:"border-box"}}>
                        <BootstrapTable
                          striped
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => history.push({pathname:"/sessions/current", state:row}) }}

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
                data={ props.sessions }
                columns={ small_screen_columns }
                search
              >
                { table_props => (  
                    <div className="w3-hide-large w3-hide-medium">
                      
                        <BootstrapTable
                          striped
                          rowEvents= {{onDoubleClick: (e, row, rowIndex) => history.push({pathname:"/sessions/current", state:row}) }}
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
export const AddSessions = (props) => {
  const aRef = React.useRef()
  const [date, setDate] = useState("")
  const [product_name, setProduct_name] = useState("")
  const [process_name, setProcess_name] = useState("")
  const [session_name, setSession_name] = useState("")
  const [required_temp, setRequired_temp] = useState("")
  const [holding_time, setHolding_time] = useState("")
  const [operator, setOperator] = useState("")
  const [modalShow, setModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirmClose = () => setModalShow(false);
  const handleConfirmShow = () => setModalShow(true);
  const handleClick = () => {
    setLoading(true)
    saveSession()
  };
  const { authTokens } = useAuth()

  const ModalConfirmatation=()=>{

    return (
      <Modal
        show={modalShow} 
        onHide={handleConfirmClose}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Are you sure you want to cancel?</h4>
          <code>Values in the field might not be saved.</code>       
        </Modal.Body>
        <Modal.Footer>
          <ButtonField buttonStyle="btns-cancel" onClick={handleConfirmClose}>Close</ButtonField>
          <ButtonField buttonStyle="btns-primary" onClick={confirmCancel}>Confirm Cancel</ButtonField>
        </Modal.Footer>
      </Modal>
    );
  }
  const confirmCancel = ()=> {
    props.history.push('/sessions')
  }
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
  
  const saveSession =()=>{
    var data = {
      "date" : date,
      "product_name": product_name,
      "process_name": process_name,
      "session_name": session_name,
      "operator": operator,
      "required_temp": required_temp,
      "holding_time": holding_time,
      
    };
    var options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + authTokens
      }
    }
    SessionDataService.create(JSON.stringify(data), options)
      .then(response => {
        props.history.push('/sessions/current', response.data)
        // props.history.push('/')
      })
      .catch(err => {
        setLoading(false)
        try{
          setErrorMessage(err.response.data.non_field_errors[0]);
          aRef.current.style.display = "inline"
        }catch{
          setErrorMessage("Network Error. Please check your network connection.")
          aRef.current.style.display = "inline"
        }
      });

  }

  return (
    <FormContainer formType="SESSION DETAILS">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  
                <InputField 
                  name="date" 
                  label="Date:"
                  value={date}
                  type="date"
                  onChange={e=> setDate(e.target.value)}
                  etc={{disabled:false, required: true}}
                />
                  <Form.Group  controlId="FormProductName" >
                    <Form.Label column="md">
                      Product Name:
                    </Form.Label>
                    <Col>
                      <Form.Control 
                        size="sm" 
                        value={product_name} 
                        onChange={e=>setProduct_name(e.target.value)} 
                        type="text" 
                        placeholder="Product Name"
                        required
                        />
                        <Form.Control.Feedback type="invalid">
                          This field cannot be empty.
                        </Form.Control.Feedback>
                    </Col>
                  </Form.Group>

                  <Form.Group  controlId="FormProductName" >
                  <Form.Label column="md">
                    Process Name:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="sm" 
                      value={process_name} 
                      onChange={e=>setProcess_name(e.target.value)} 
                      type="text" 
                      placeholder="Type of Process"
                      required
                       />
                      <Form.Control.Feedback type="invalid">
                        This Field cannot be empty.
                      </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group  controlId="FormSessionName">
                  <Form.Label column="md">
                    Session Name:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={session_name} 
                      onChange={e=>setSession_name(e.target.value)} 
                      type="text" 
                      placeholder="Name of Session" 
                      required
                      />
                      <Form.Control.Feedback type="invalid">
                        This field cannot be empty.
                      </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                

                <Form.Group  controlId="FormReqTemp">
                  <Form.Label column="md">
                    Temperature (°C)::
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={required_temp} 
                      onChange={e=>setRequired_temp(e.target.value)} 
                      type="number" 
                      placeholder="Required Temperature" 
                      required
                      />
                      <Form.Control.Feedback type="invalid">
                        This field cannot be empty.
                      </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group  controlId="FormHoldTime">
                  <Form.Label column="md">
                    Holding Time:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={holding_time} 
                      onChange={e=>setHolding_time(e.target.value)} 
                      type="number" 
                      placeholder="Holding Time" 
                      required

                      />
                      <Form.Control.Feedback type="invalid">
                        This field cannot be empty.
                      </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group  controlId="FormOperatorName">
                  <Form.Label column="md">
                    Operator Name:
                  </Form.Label>
                  <Col>
                    <Form.Control 
                      size="md" 
                      value={operator} 
                      onChange={(e)=> setOperator(e.target.value)} 
                      type="text" 
                      placeholder="Name of the Operator" 
                      required

                    />
                    <Form.Control.Feedback type="invalid">
                        This field cannot be empty.
                      </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group>

                  <Row className="mx-auto">
                    <Col >
                      <ButtonField buttonStyle="btns-cancel" buttonSize="btns-medium" onClick={handleConfirmShow}>Cancel</ButtonField>

                      <ButtonField buttonStyle="btns-primary" buttonSize="btns-medium"type="submit">Save</ButtonField>

                      {/* <Button variant="outline-primary" onClick={(event)=> handleSubmit(event)} block>Save</Button> */}
                    </Col>
                  </Row>
                </Form.Group>
                <ModalConfirmatation />
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
                            <td>Product Name:</td>
                            <td>{product_name}</td>
                          </tr>
                          <tr>
                            <td>Process Type:</td>
                            <td>{process_name}</td>
                          </tr>
                          <tr>
                            <td>Session Name:</td>
                            <td>{session_name}</td>
                          </tr>
                          <tr>
                            <td>Temperature (°C):</td>
                            <td>{required_temp}</td>
                          </tr>
                          <tr>
                            <td>Holding Time:</td>
                            <td>{holding_time}</td>
                          </tr>
                          <tr>
                            <td>Operator Name:</td>
                            <td>{operator}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <div style={{fontWeight:"bold",textAlign: "center"}} >
                          <code style={{ color:"red",margin:"0 0 0 0"}}>{errorMessage}<NavLink ref={aRef} to="/sessions" style={{fontSize:"inherit", display:"none"}}> View it here.</NavLink></code>
                          
                      </div>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer className="justify-content-start mx-2">
                  
                    
                    
                    {isLoading ? <Spinner style={{ marginLeft :"20px"}} animation="grow" variant="warning" /> : (
                      <>
                      <ButtonField buttonStyle="btns-cancel" onClick={handleClose}>Close</ButtonField>

                    <ButtonField
                      buttonStyle="btns-primary"
                      etc={{ disabled: isLoading}}
                      onClick={!isLoading ? handleClick : null}
                    >
                      Save Session
                    </ButtonField>
                    </>
                    )
                    }

                  </Modal.Footer>
                </Modal>
    </FormContainer>
    
  )
}
export const SessionPage = (props)=>{
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [data, setData] = useState({})
  const [sessions, setSessions] = useState([])
  const { authTokens } = useAuth()
  let history = useHistory()
  var options = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + authTokens
    }
  }
  useEffect(()=> {
    setLoading(true)
    SessionDataService.getAll(options)
      .then(response => {
        setData(response.data)
        setSessions(response.data.results)
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        try{
          setErrorMessage(err.response.data.non_field_errors[0]);
        }catch{
          setErrorMessage("Network Error. Please check your network connection.")
        }
      });
      SessionDataService.getCurrent(options)
      .then(response => {
        console.log(response.data)
        if(response.data.count === 0){
          console.log(response.status)
          setLoading(false)
          return
        }
        setLoading(false)
        history.push({pathname: '/sessions/current'})
      })
      .catch(err=>{
          console.log("oops")
          setLoading(false)
          
      })
      return ()=> SessionDataService.cancelToken()
  },[authTokens])

  const handleFilter = (start, end)=> {
    setLoading(true)
    SessionDataService.filter(start, end, options)
    .then(response=> {
      console.log(response.data)
      setData(response.data)
      setSessions(response.data.results)
      setLoading(false)

    })
    .catch(err=> {
      setLoading(false)
      console.log(err);
    })
  }


  return <TableContainer tips="Add Session" data= {sessions} count={data.count} columns={columns} filterByDate={handleFilter}/>
    
  
}
