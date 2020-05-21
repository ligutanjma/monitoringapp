import React from "react";
import { Container, Row, Col} from 'react-bootstrap';
import Chart from '../views/charts'
import { ListGroup, Modal, Button } from 'react-bootstrap'
import SessionDataService from "../services/SessionDataService";
import {useAuth} from '../components/auth'


const CurrentSessions = (props) => {
    var chartRef;
    const [readings, setReadings] = React.useState({
        temperature:[],
        time: []
    })
    const [WSclose, setWSclose] = React.useState(false)
    const [ws, setWS] = React.useState()
    const [reconTime, setReconTime] = React.useState(250)
    const [show, setShow] = React.useState(false);
    const [modalInputTemp, setModalInputTemp] = React.useState('')
    const [modalInputName, setModalInputName] = React.useState('')
    const [isSlicedReadings, setIsSlicedReadings] = React.useState(false)
    const [renderedSlicedReadingsToGraph, setRenderedSlicedReadingsToGraph] = React.useState(false)
    const URL = "ws://192.168.1.9:8000/"
    const { authTokens } = useAuth()
   
    
    React.useEffect(()=>{
        if(props.location.state.ended === true){
            const websocket = new WebSocket(`${URL}ws/equipments/water_retort/A0temp/`)
            websocket.onopen = () => {
                console.log('websocket opened')
                var message = {
                    "type": "slice",
                    "session_id": props.location.state.pk 
                }
                websocket.send(JSON.stringify(message))
            }
            websocket.onmessage = (response) => {
                var data = JSON.parse(response.data)
                var readingsCopy = Object.assign({}, readings);
                for(const [key, value] of Object.entries(data)){
                    console.log(key,value)
                    readingsCopy.time.push(key)
                    readingsCopy.temperature.push(value)
                }
                setReadings(readingsCopy)
            }
            websocket.onclose = e => {
                console.log('clossing')
                setReconTime((prevState) =>  prevState + prevState)
                setTimeout(() => check(), Math.min(10000, reconTime))};
        
            // websocket onerror event listener
            websocket.onerror = err => {
                console.error(
                    "Socket encountered error: ",
                    err.message,
                    "Closing socket"
                );
                console.log("error")
                
               
                
            };
        }
        else {
        const websocket = new WebSocket("ws://192.168.1.9:8000/ws/clients/");
        websocket.onopen = () => {
            if(props.location.state.started === true && renderedSlicedReadingsToGraph === false){
                var message = {
                    "type": 'started',
                    "session_id" : props.location.state.pk
                }
                console.log('this session have already started')
                websocket.send(JSON.stringify(message))
            }
            setWS(websocket)
        };
        websocket.onmessage = response => { 
            // add the new message to state
            var data = JSON.parse(response.data)
            var readingsCopy = Object.assign({}, readings);

            // check if the session has already started and if the starting_point to 
            // ending_point readings is already rendered to the graph 
            // If session is started and not yet rendered to the chart, DO THE FOLLOWING:
            if(data.type === "session_started" && renderedSlicedReadingsToGraph === false){
                // store the incoming list of readings to the Readings variable
                for(const [key, value] of Object.entries(data.message)){
                    readingsCopy.time.push(key)
                    readingsCopy.temperature.push(value)
                }
                // setStarted(true)
                setIsSlicedReadings(true)
                setReadings(readingsCopy)
                
            }else if(data.type === "session_starts"){
                var headers = {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'JWT ' + authTokens
                    }
                  }
                SessionDataService.getCurrent(headers).then(response=>{
                    
                    props.history.push('/sessions/current', response.data.results[0])
                })
            }
            else if(data.type === "ended"){
                websocket.close()
                props.history.push('/sessions')

            }else{
                readingsCopy.temperature.push(data.reading)
                readingsCopy.time.push(data.time)
                setIsSlicedReadings(false)
                setReadings(readingsCopy)

            }
            
            
          };
        
        
    
        // websocket onclose event listener
        websocket.onclose = e => {
            console.log('clossing')
            setReconTime((prevState) =>  prevState + prevState)
            setTimeout(() => check(), Math.min(10000, reconTime))};
    
        // websocket onerror event listener
        websocket.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );
            console.log("error")
            
           
            
        };
    }
    
    }, [WSclose])
    React.useEffect(()=>{
        if(ws !== undefined){
            if (isSlicedReadings === true){
                for(var i = 0; i < readings.temperature.length; ++i){
                    chartRef.chart.config.data.datasets[0].data.push(readings.temperature[i])
                    chartRef.chart.config.data.labels.push(readings.time[i])
                    chartRef.chart.config.data.datasets[1].data.push(props.location.state.required_temp)
                }
                setRenderedSlicedReadingsToGraph(true)
                chartRef.chart.update()

            }else{
                // from sensor to chart. Live graphing
                if(readings.time[readings.time.length-1] ===undefined){
                    return
                }
                chartRef.chart.config.data.datasets[0].data.push(readings.temperature[readings.temperature.length-1])
                chartRef.chart.config.data.labels.push(readings.time[readings.time.length-1])
                for(var i = 0; i < chartRef.chart.config.data.labels.length; ++i){
                    chartRef.chart.config.data.datasets[1].data.push(props.location.state.required_temp)
                }
                chartRef.chart.update()
            }
        }
        else {
            for(var i = 0; i < readings.temperature.length; ++i){
                chartRef.chart.config.data.datasets[0].data.push(readings.temperature[i])
                chartRef.chart.config.data.labels.push(readings.time[i])
                chartRef.chart.config.data.datasets[1].data.push(props.location.state.required_temp)
            }
            chartRef.chart.update()
        }
        // this.canvas.chart.config.data.labels.push(this.state.readings.time[this.state.readings.time.length-1])
        //         this.canvas.chart.config.data.datasets[0].data.push(this.state.readings.temp[this.state.readings.temp.length-1])
        //         for (var index = 0; index < this.canvas.chart.config.data.labels.length; ++index) {
        //             this.canvas.chart.config.data.datasets[1].data.push(this.props.location.state.required_temp)
        //         }
        //         this.canvas.chart.update()
    }, [readings])

    const check = () => {
        if (!ws || ws.readyState === WebSocket.CLOSED){
            setWSclose(prevState=> !prevState)
        }; //check if websocket instance is closed, if so call `connect` function.
    }

    
    const startSession =()=>{
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined){
            return
        }
        
        var message = {
            "type": "session_starts",
            "session_id": props.location.state.pk
        }
        ws.send(JSON.stringify(message))   
        
        if(readings.time[readings.time.length-1] !== undefined){
            var object = Object.assign({
                id: 'v-burner-start',
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: readings.time[readings.time.length-1],
                borderColor: "red",
                label: {
                    backgroundColor: 'red',
                    content: 'Burner Started',
                    enabled: true,
                    position: 'top'
                }
            })
            
            chartRef.chart.config.options.annotation.annotations.push(object)
            chartRef.chart.update()
        }
        
    }
    const start_water = () => {
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined){
            return
        }
        var message = {
            "type": "cool",
            "session_id": props.location.state.pk
        }
        // setStartedAlready(true)
        ws.send(JSON.stringify(message))
        if(readings.time[readings.time.length-1] !== undefined){
            var object = Object.assign({
                id: 'v-water-start',
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: readings.time[readings.time.length-1],
                borderColor: "red",
                label: {
                    backgroundColor: 'red',
                    content: 'Water Started',
                    enabled: true,
                    position: 'top'
                }
            })
        chartRef.chart.config.options.annotation.annotations.push(object)
        chartRef.chart.update()
        }
        
    }
    const endSession=()=>{
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined){
            return
        }
        var confirm = window.confirm('Are you sure you want end the Session?')
        if (confirm === true){
            var message = {
                "type": "end",
                "session_id": props.location.state.pk
            }
    
            
            ws.send(JSON.stringify(message))
        }else {
            return false
        }

        // let data = Object.assign({},props.location.state)
        // data.current= false
        // data.started=false
        // data.ended=true
        // var headers = {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': 'JWT ' + authTokens
        //     }
        //   }

        // SessionDataService.update(props.location.state.pk, data, headers)
        // .then(response=>{
        //     console.log(response.status)
        //     if(response.status=== 200){
        //         return <Redirect to='/' />
        //     }
        // })
    }
    const addMarker = () => {
        
        if(readings.time[readings.time.length-1] !== undefined){
            var object = Object.assign({
                id: "marker_label_"+modalInputTemp,
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: modalInputTemp,
                borderColor: "green",
                label: {
                    backgroundColor: 'red',
                    content: modalInputName,
                    enabled: true,
                    position: 'center'
                }
            })
            
        }
        chartRef.chart.config.options.annotation.annotations.push(object)
        chartRef.chart.update()
        handleClose()
    }
    // if(props.location.state === undefined){ 
    //     return <Redirect to="/sessions" />
    // }
    const handleClose = () => setShow(false);
    const handleShow = () => {
        if(readings.time.length === 0){
            return false
        }setShow(true)
    };
    return ( 
        <Container fluid >
               
               <Row>
                   <br />
                   
                   <Col>
                   <br />
                       <Row className="m-2">
                            
                       </Row>
                       <br />
                       <Row>
                            <button className="btn btn-primary m-2" onClick={handleShow} > Add Marker </button>
                            <button className="btn btn-primary m-2" onClick={startSession} > Start Burner </button>
                            <button className="btn btn-primary m-2" onClick={start_water} > Start Water </button>
                            <button className="btn btn-primary m-2" onClick={endSession}> Done </button>
                            
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Modal heading</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <input className="form-control form-control-sm m-2" type="text" placeholder="Temperature:" name="modalInputTemp" value={modalInputName} onChange={e=>setModalInputName(e.target.value)} />
                                    <input className="form-control form-control-sm m-2" type="text" placeholder="Temperature:" name="modalInputTemp" value={modalInputTemp} onChange={e=>setModalInputTemp(e.target.value)} />
                                </Modal.Body>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={addMarker}>
                                    Save Changes
                                </Button>
                                </Modal.Footer>
                            </Modal>
                       </Row>

                   </Col>
                   <br />

                   <Col sm={10}>
                   <br />

                        <Row>
                            <ListGroup horizontal>
                                    <ListGroup.Item> {props.location.state.product_name} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.process_name} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.session_name} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.required_temp} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.holding_time} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.operator} </ListGroup.Item>
                            </ListGroup>

                        </Row>
                        <br />
                       
                        <Chart 
                            ref={ref=> chartRef = ref}
                            name={'Required Temperature'} 
                            required_temp={props.location.state.required_temp.toString()}
                            readings={readings}>
                        </Chart>
                   
                   </Col>
               </Row>
           </Container>
     ) ;
}
 

export default CurrentSessions;
