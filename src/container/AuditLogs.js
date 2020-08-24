import React, { useEffect, useState } from 'react';
import {Container, Table} from 'react-bootstrap'
import axios from 'axios';
import { useAuth } from '../components/auth'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import TableContainer from '../reusable/TableContainer';
import {HOST_URL} from '../reusable/constants'


// const HOST_URL = 'http://127.0.0.1:8000/' // API server domain
const customer_column = [{
    dataField: 'id',
    text: 'Id',
    hidden: true
  },{
    dataField: 'customer_name',
    text: 'Customer Name',
    headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
      }
  }, {
    dataField: 'history_date',
    text: 'Date/Time',
    sort: true,
    headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
      }
  }, {
    dataField: 'get_history_type_display',
    text: 'Action'
  }, {
    dataField: 'history_user',
    text: 'Changed/Created By',
    headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
      }
  }];

const session_column = [{
dataField: 'pk',
text: 'Id',
hidden: true
},{
dataField: 'product_name',
text: 'Product Name',
sort:true,
headerStyle: (column, colIndex)=>{
    return {color:"#007bff", textAlign:"center"}
    }
}, {
dataField: 'history_date',
text: 'Date/Time',
sort:true,
headerStyle: (column, colIndex)=>{
    return {color:"#007bff", textAlign:"center"}
    }
}, {
dataField: 'get_history_type_display',
text: 'Action'
}, {
dataField: 'history_user',
text: 'Changed/Created By',
sort:true,
headerStyle: (column, colIndex)=>{
    return {color:"#007bff", textAlign:"center"}
    }
}];
const user_column = [{
    dataField: 'pk',
    text: 'Id',
    searchable: false,
    headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
        }
    },{
    dataField: 'name',
    text: 'Username',
    sort: true,
    headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
        }
    }, {
    dataField: 'date_log',
    text: 'Date/Time Last Logged In',
    sort: true,
    searchable: false,
    headerStyle: (column, colIndex)=>{
        return {color:"#007bff", textAlign:"center"}
        }
    }];

export const AuditCustomer = (props) => {
    const [values, setValues] = useState({
        count: '',
        customers: [],
    })
    const [errorMessage, setErrorMessage] = useState('')
    const { authTokens } = useAuth()

    

    useEffect(()=>{
        var option = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + authTokens
            }
        }
        axios.get(`${HOST_URL}/api/customers/audit/`, option)
        .then(res=> {
            console.log(res.data)
            var customers = res.data.results
            var rows = []
            var id = 0
            customers.forEach((data)=>{
                data.history.forEach(datum=>{
                    var historyObj= {
                        "id" : id+= 1,
                        "customer_name" : data.customer_name,
                        "get_history_type_display" : datum.get_history_type_display,
                        "history_date" : datum.history_date,
                        "history_user" : datum.history_user,
                        
                    }
                    rows.push(historyObj)
                    
                    
                })
            })
            console.log(id)
            setValues({
                ...values,
                count : id,
                customers: rows
            })
        })
        .catch(err=>{
            console.log(err.response)
            setErrorMessage(err.response.statusText)
        })
    },[])
    console.log(values)

    
    return ( 
            <TableContainer type="audit" title="CUSTOMERS" data={values.customers.reverse()} columns={customer_column} count={values.count} />
    );
}
export const AuditSession = (props) => {
    const [values, setValues] = useState({
        count: '',
        sessions: [],
    })
    const [errorMessage, setErrorMessage] = useState('')
    const { authTokens } = useAuth()

    

    useEffect(()=>{
        var option = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + authTokens
            }
        }
        axios.get(`${HOST_URL}/api/sessions/audit/`, option)
        .then(res=> {
            var sessions = res.data.results
            var rows = []
            var id = 0
            sessions.forEach((data)=>{
                data.history.forEach(datum=>{
                    var historyObj= {
                        "pk" : id+= 1,
                        "product_name" : data.product_name,
                        "get_history_type_display" : datum.get_history_type_display,
                        "history_date" : datum.history_date,
                        "history_user" : datum.history_user,
                        
                    }
                    rows.push(historyObj)
                    
                    
                })
            })
            setValues({
                ...values,
                count : id,
                sessions: rows
            })
        })
        .catch(err=>{
            console.log(err.response)
            setErrorMessage(err.response.statusText)
        })
    },[])

    return ( 
            <TableContainer id="pk" type="audit" title="SESSIONS" data={values.sessions.reverse()} columns={session_column} count={values.count} />
    );
}
export const AuditUser = (props) => {
    const [values, setValues] = useState({
        count: '',
        users: []
    })
    const [errorMessage, setErrorMessage] = useState('')
    const { authTokens } = useAuth()

    

    useEffect(()=>{
        var option = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + authTokens
            }
        }
        axios.get(`${HOST_URL}/api/users/audit/`, option)
        .then(res=> {
            console.log(res)
            
            setValues({
                ...values,
                count : res.data.count,
                users: res.data.results
            })
        })
        .catch(err=>{
            console.log(err.response)
            setErrorMessage(err.response.statusText)
        })
    },[])

    console.log(values)
    return ( 
            <TableContainer type="audit" id="pk" title="Login History" data={values.users} columns={user_column} count={values.count} />
    );
}