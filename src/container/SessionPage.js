import React, { Component, useState, useEffect } from 'react';
import {
    Link,
    Redirect
  } from "react-router-dom";
import { Container, Row, Col} from 'react-bootstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import SessionDataService from '../services/SessionDataService'
import {useAuth} from '../components/auth'
import Spinner from 'react-bootstrap/Spinner'

const { SearchBar } = Search;

const rowEvents = {
  onDoubleClick: (e, row, rowIndex) => {
    return <Redirect to="/sessions/current" />
  }
};

const columns = [{
  dataField: 'pk',
  text: 'Session ID',
  searchable: false

}, {
  dataField: 'product_name',
  text: 'Product name',
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
    console.log(props)
    return ( 
      <Container>
        <ToolkitProvider
          keyField="pk"
          data={ props.sessions }
          columns={ columns }
          search
        >
          { table_props => (
            
              <Col>
                  <Row>
                      <Col>
                        <SearchBar { ...table_props.searchProps } />
                        
                      </Col>
                      <Col>
                      <Link to="/sessions/create">
                            <button type="button">
                                Click Click Click
                            </button>
                        </Link>
                      </Col>
                  </Row>
                  <BootstrapTable 
                    rowEvents= {{onDoubleClick: (e, row, rowIndex) => {
                      console.log(row)
                      props.prop.history.push('/sessions/current', row)
                      
                    }}}
                    {...table_props.baseProps}>

                  </BootstrapTable>
              </Col>
            )
          }
        </ToolkitProvider>
      </Container>
     );
}
export const AddSessions = (props) => {
  const [product_name, setProduct_name] = useState("")
  const [process_name, setProcess_name] = useState("")
  const [session_name, setSession_name] = useState("")
  const [required_temp, setRequired_temp] = useState("")
  const [holding_time, setHolding_time] = useState("")
  const [operator, setOperator] = useState("")
  const { authTokens } = useAuth()


  
  const saveSession =()=>{
    var data = {
      "product_name": product_name,
      "process_name": process_name,
      "session_name": session_name,
      "operator": operator,
      "required_temp": required_temp,
      "holding_time": holding_time,
      // "current": true,
      // "started":false,
      // "ended": false
      
    };
    console.log(authTokens)
    var options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + authTokens
      }
    }
    SessionDataService.create(JSON.stringify(data), options)
      .then(response => {
        console.log(response);
        // props.history.push('/sessions/current', response.data)
        console.log("pushed")
        props.history.push('/')
      })

      .catch(e => {
        console.log(e);
      });

  }
  return (
    <div>
        <input className="form-control form-control-sm m-2" type="text" placeholder="Product Name:" name="product_name" value={product_name} onChange={e=>setProduct_name(e.target.value)} />
        <input className="form-control form-control-sm m-2" type="text" placeholder="Process Type:" name="process_name" value={process_name} onChange={e=>setProcess_name(e.target.value)} />
        <input className="form-control form-control-sm m-2" type="text" placeholder="Session Name:" name="session_name" value={session_name} onChange={e=>setSession_name(e.target.value)} />
        <input className="form-control form-control-sm m-2" type="number" placeholder="Temperature (°C):" name="required_temp" value={required_temp} onChange={e=>setRequired_temp(e.target.value)} />
        <input className="form-control form-control-sm m-2" type="number" placeholder="Holding Time:" name="holding_time" value={holding_time} onChange={e=>setHolding_time(e.target.value)} />
        <input className="form-control form-control-sm m-2" type="text" placeholder="Operator Name:" name="operator" value={operator} onChange={e=>setOperator(e.target.value)} onKeyUp={ event => {if(event.key === 'Enter'){saveSession()}} }/>
        <button className="btn btn-primary m-2" onClick={saveSession} >Submit</button>
    </div>
  )
}
export const SessionPage = (props)=>{
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([])
  const { authTokens } = useAuth()
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
        setSessions(response.data.results)
        setLoading(false)
        console.log(response);
      })
      .catch(e => {
        setLoading(false)
        console.log(e);
      });
      return ()=> SessionDataService.cancelToken()
  },[])

  


  return loading ? 
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> : 
      <SessionList sessions= {sessions} prop={props}/>
    
  
}
export class SessionPages extends Component {
        
    constructor(props) {
        super(props);
        this.state = { 
            sessions: [],
            currentSession: null,
            currentIndex: -1,
        }
    }
    componentDidMount() {
        this.retrieveSessions()
    }
    retrieveSessions =()=> {
        SessionDataService.getAll()
          .then(response => {
            this.setState({
                sessions: response.data.results
            });
            console.log(response);
          })
          .catch(e => {
            console.log(e);
          });
      }
    render() { 
        return ( 
            <div>
                

                <SessionList 
                    render= {() => 
                        <Link to="/sessions/create">
                            <button type="button">
                                Click Click Click
                            </button>
                        </Link>} 
                    sessions= {this.state.sessions} />
            </div>
         );
    }
}
export class CreateSessionPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
        
        }
    }
    
    
    render() { 
        return ( 
            <div>
                

                Hello World
            </div>
         );
    }
}
