import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth'
import SessionDataService from '../services/SessionDataService'
import axios from 'axios';
import AuthService from '../services/AuthService'
import { Link, useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'

const HomePage = (props) => {
    const { authTokens, setAuthTokens } = useAuth()
    const [ loading, setLoading ] = useState(false)
    const [ noCurrentSession, setNoCurrentSession ] = useState(true)
    const [ errMsg, setErrMsg ] = useState("")
    let history = useHistory()
    var options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + authTokens
      }
    }
    useEffect(()=>{
      
      setLoading(true)
      SessionDataService.getCurrent(options)
      .then(response => {
        console.log(response.data)
        if(response.data.count === 0){
          console.log(response.status)
          setLoading(false)
          setNoCurrentSession(false)
          return
        }
        setLoading(false)
        props.history.push('/sessions/current', response.data.results[0])
      })
      .catch(err=>{
        setLoading(false)
        setErrMsg(err.message)

      })
        
    }, [])
  

    

    // if (currentIsTrue){
    //   console.log(currentSession)
    //   props.history.push('/sessions/current', currentSession)
    // }
    
    return loading ? 
      (<Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>) : 
      <div>
        <hr />
          <h3 style={{textAlign: "center"}}>Home Less</h3>
        <hr />
      </div>
    
}
 
export default HomePage;