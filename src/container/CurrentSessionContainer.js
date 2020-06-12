import React from "react";
import { Container, Row, Col} from 'react-bootstrap';
import Chart from '../views/charts'
import { ListGroup, Modal, Button } from 'react-bootstrap'
import SessionDataService from "../services/SessionDataService";
import {useAuth} from '../components/auth'


const CurrentSessions = (props) => {
    const chartRef = React.useRef()
    const [loading, setLoading] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState(false)
    const [currentSession, setCurrentSession] = React.useState()
    const [ws, setWS] = React.useState(null)
    const [readings, setReadings] = React.useState({
        reading:[],
        time: []
    })
    const [isSlicedReadings, setIsSlicedReadings] = React.useState(false)
    const [renderedSlicedReadingsToGraph, setRenderedSlicedReadingsToGraph] = React.useState(false)
    const [markerLabel, setMarkerLabel] = React.useState(250)
    const [markerValue, setMarkerValue] = React.useState(250)
    const [show, setShow] = React.useState(false)
    const [reconTime, setReconTime] = React.useState(250)
    const URL = "ws://192.168.1.7:8000/"
    const { authTokens } = useAuth()
   
    // getting Current Session
    React.useEffect(()=>{
        console.log("otokens")
        setLoading(true)
        var headers = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + authTokens
            }
          }
        SessionDataService.getCurrent(headers)
            .then(response=>{
                setLoading(false)
                console.log(chartRef)
                setCurrentSession(response.data.results[0])
                var required_temp_dataset = Object.assign({
                    label: 'Required Temperature',
                    data: [response.data.results[0].required_temp],
                    fill: false,
                    backgroundColor: 'rgba(255, 0, 0, 1)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                })
                chartRef.current.chart.config.data.datasets.push(required_temp_dataset)
                chartRef.current.chart.update()
            })
            .catch(err=>{
                console.log(err)
                setLoading(false)
                try{
                    setErrorMessage(err.response.data.non_field_errors[0]);
                  }catch{
                    setErrorMessage("Network Error. Please check your network connection.")
                  }
            })
    }, [authTokens, chartRef])

    // Chart data initializations

    React.useEffect(()=>{

        const websocket = new WebSocket(`${URL}ws/clients/`);
        websocket.onopen = () => {
            setWS(websocket)

        };
        websocket.onmessage = response => { 
            // add the new message to state
            var readings_data = JSON.parse(response.data)
            var readingsCopy = Object.assign({}, readings);

            if(readings_data.type ==="sensor_readings"){
                readingsCopy.reading.push(readings_data.reading)
                readingsCopy.time.push(readings_data.time)
                setReadings(readingsCopy)
            }else if(readings_data.type === "session_started" && renderedSlicedReadingsToGraph === false){
                // store the incoming list of readings to the Readings variable
                for(const [key, value] of Object.entries(readings_data.message)){
                    readingsCopy.time.push(key)
                    readingsCopy.reading.push(value)
                }
                // setStarted(true)
                setIsSlicedReadings(true)
                setReadings(readingsCopy)
            }else if(readings_data.type === "session_starts"){
                setCurrentSession({...currentSession, started:true})
            }

          };
        // websocket onclose event listener
        websocket.onclose = e => {
            console.log('clossing')
            setTimeout(() => setReconTime((prevState) =>  prevState + prevState), Math.min(10000, reconTime))};

        // websocket onerror event listener
        websocket.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );
            console.log("error")
            
           
            
        };
    }, [reconTime])

    
    React.useEffect(()=>{
        if(currentSession===undefined){
            return
        }else if(readings.reading[readings.reading.length-1] !==undefined){

            console.log(readings)
            chartRef.current.state.data.datasets[0].data.push(readings.reading[readings.reading.length-1])
            chartRef.current.state.data.labels.push(readings.time[readings.time.length-1])
            for(var i = 0; i < chartRef.current.chart.config.data.labels.length; ++i){
                chartRef.current.chart.config.data.datasets[1].data.push(currentSession.required_temp)
            }
            chartRef.current.chart.update()
            console.log(currentSession.started)
            // if(currentSession.started ===true ){
            //     console.log('this session have already started')
            //     var message = {
            //         "type": "started",
            //         "session_id" : currentSession.id
            //     }
            //     console.log('this session have already started')
            //     ws.send(JSON.stringify(message))
            // }
        }
        
        // for(var i = 0; i < chartRef.current.state.data.labels.length; ++i){
        //     chartRef.state.data.datasets[1].data.push(currentSession.required_temp)
        // }
    }, [ws])
    
    const startSession =()=>{
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined || currentSession.started===undefined){
            return
        }
        
        var message = {
            "type": "session_starts",
            "session_id": currentSession.pk
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
            
            chartRef.current.chart.config.options.annotation.annotations.push(object)
            chartRef.current.chart.update()
        }
        
    }
    const start_water = () => {
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined){
            return
        }
        var message = {
            "type": "cool",
            "session_id": currentSession.pk
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
        chartRef.current.state.options.annotation.annotations.push(object)
        chartRef.current.chart.update()
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
                "session_id": currentSession.pk
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
                id: "marker_label_"+markerLabel,
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: markerValue,
                borderColor: "green",
                label: {
                    backgroundColor: 'red',
                    content: markerValue,
                    enabled: true,
                    position: 'center'
                }
            })
            
        }
        chartRef.current.state.options.annotation.annotations.push(object)
        chartRef.current.chart.update()
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
                                    <input className="form-control form-control-sm m-2" type="text" placeholder="Temperature:" name="modalInputTemp" value={markerLabel} onChange={e=>setMarkerLabel(e.target.value)} />
                                    <input className="form-control form-control-sm m-2" type="text" placeholder="Temperature:" name="modalInputTemp" value={markerValue} onChange={e=>setMarkerValue(e.target.value)} />
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
                            {/* <ListGroup horizontal>
                                    <ListGroup.Item> {props.location.state.product_name} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.process_name} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.session_name} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.required_temp} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.holding_time} </ListGroup.Item>
                                    <ListGroup.Item> {props.location.state.operator} </ListGroup.Item>
                            </ListGroup> */}

                        </Row>
                        <br />
                       
                        <Chart 
                            ref={chartRef}
                            // required_temp={currentSession.required_temp.toString()}
                            >
                        </Chart>
                   
                   </Col>
               </Row>
           </Container>
     ) ;
}
 

export default CurrentSessions;
