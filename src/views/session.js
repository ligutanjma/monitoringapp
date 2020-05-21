import React, { Component } from 'react'
import PropTypes from 'prop-types';
import * as ChartJS from 'chart.js';


class CreateSession extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            session_name: '',
            process_name: '',
            product_name: '',
            operator: '',
            required_temp: '',
            holding_time: '',
            showForm: false,
        }
    }
    // componentDidMount(){
    //     this.setState({ state: props.data })
    // }
    createSessionProperties = () => {
          
        
        // axios.post('//127.0.0.1:5000/api/sessions/create/', {
        //         "product_name": this.state.product_name,
        //         "process_name": this.state.process_name,
        //         "session_name": this.state.session_name,
        //         "required_temp": this.state.required_temp,
        //         "holding_time": this.state.holding_time,
        //         "operator": this.state.operator
        // }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        // })
        // .then(response => { 
        //     console.log(response.data)
        //     this.setState({session_details: response.data, showForm: !this.state.showForm })
        // })
        // .catch(error => {
        //     console.log(error.response)

        // });

        console.log('createSessionProperties will be Triggered')
        

    }
    handleInputChange= (event) => {
        this.setState({ [event.target.name] : event.target.value})
    }
    CreateSessionForm = () => {
        return (
            <div>
                <input className="form-control form-control-sm m-2" type="text" placeholder="Session Name:" name="session_name" value={this.state.session_name} onChange={this.handleInputChange} />
                <input className="form-control form-control-sm m-2" type="text" placeholder="Process Type:" name="process_name" value={this.state.rocess_name} onChange={this.handleInputChange} />
                <input className="form-control form-control-sm m-2" type="text" placeholder="Product Name:" name="product_name" value={this.state.product_name} onChange={this.handleInputChange} />
                <input className="form-control form-control-sm m-2" type="number" placeholder="Temperature (°C):" name="required_temp" value={this.state.required_temp} onChange={this.handleInputChange} />
                <input className="form-control form-control-sm m-2" type="number" placeholder="Holding Time:" name="holding_time" value={this.state.holding_time} onChange={this.handleInputChange} />
                <input className="form-control form-control-sm m-2" type="text" placeholder="Operator Name:" name="operator" value={this.state.operator} onChange={this.handleInputChange} onKeyUp={ event => {if(event.key === 'Enter'){this.createSessionProperties()}} }/>
                <button className="btn btn-primary m-2" onClick={this.createSessionProperties } >Submit</button>
            </div>
        )
    }
    showCreateForm =() =>{
        console.log('clicked')
        this.setState({showForm: !this.state.showForm})
    }
    render(){
        return (
            <div>
                <button onClick={this.showCreateForm} type="button" className="btn btn-primary m-2">Create Session</button>
                { this.state.showForm ? this.CreateSessionForm() : null }
            </div>
        
        )
    }
}
export default CreateSession;