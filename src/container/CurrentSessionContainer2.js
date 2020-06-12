import React from "react";
import SessionDataService from "../services/SessionDataService";

import {useAuth} from '../components/auth'
import {useHistory} from 'react-router-dom'

import Chart from '../views/charts'

import { ListGroup, Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FiRefreshCcw } from 'react-icons/fi'
import { AiFillFire,AiOutlinePlus } from 'react-icons/ai'
import { IoIosWater,  } from 'react-icons/io'
import { FaRegStopCircle } from 'react-icons/fa'



const CurrentSessions = (props) => {
    console.log(props)
    var chartRef;
    const [readings, setReadings] = React.useState({
        temperature:[],
        time: []
    })
    const [slicedReadings, setSlicedReadings] = React.useState({
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
    const URL = "ws://127.0.0.1:8000/"
    const { authTokens } = useAuth()
    let history = useHistory()
    

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
        const websocket = new WebSocket(`${URL}ws/clients/`);
        websocket.onopen = () => {
            if(props.location.state.started === true){
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
                var slicedReadingsCopy = Object.assign({}, slicedReadings);
                for(const [key, value] of Object.entries(data.message)){
                    slicedReadingsCopy.time.push(key)
                    slicedReadingsCopy.temperature.push(value)
                }    
                setIsSlicedReadings(true)
                setReadings(slicedReadingsCopy)
                
            }
            else {
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
            
           
            
        };
    }
    
    }, [WSclose])

    React.useEffect(()=>{
        if(ws !== undefined && readings.time[readings.time.length-1] !==undefined){
            if (isSlicedReadings === true){
                
                // var unions_time = [...new Set([...chartRef.chart.config.data.labels, ...readings.time])];
                // var unions_temp = [...new Set([...chartRef.chart.config.data.datasets[0].data, ...readings.temperature])];
                // console.log(unions_time)
                // console.log(unions_temp)
                
                // chartRef.chart.config.data.datasets[0].data = unions_temp
                // chartRef.chart.config.data.labels = unions_time
                
                chartRef.chart.config.data.datasets[0].data = readings.temperature
                chartRef.chart.config.data.labels = readings.time
                for(var i = 0; i < readings.temperature.length; ++i){
                    // chartRef.chart.config.data.datasets[0].data.push(readings.temperature[i])
                    // chartRef.chart.config.data.labels.push(readings.time[i])
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
                for(var x = 0; x < chartRef.chart.config.data.labels.length; ++x){
                    chartRef.chart.config.data.datasets[1].data.push(props.location.state.required_temp)
                }
                chartRef.chart.update()
            }
        }
        else {
            if(readings.time[readings.time.length-1] ===undefined){
                return
            }
            for(var y = 0; y < readings.temperature.length; ++y){
                chartRef.chart.config.data.datasets[0].data.push(readings.temperature[y])
                chartRef.chart.config.data.labels.push(readings.time[y])
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
    }, [readings, slicedReadings])

    const check = () => {
        if (!ws || ws.readyState === WebSocket.CLOSED){
            setWSclose(prevState=> !prevState)
            setReconTime(250)
        }; //check if websocket instance is closed, if so call `connect` function.
    }
    const formatDate=(date, fmt)=> {
        function pad(value) {
            return (value.toString().length < 2) ? '0' + value : value;
        }
        return fmt.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
            switch (fmtCode) {
            case 'Y':
                return date.getFullYear();
            case 'M':
                return pad(date.getMonth() + 1);
            case 'd':
                return pad(date.getDate());
            case 'H':
                return pad(date.getHours());
            case 'm':
                return pad(date.getMinutes());
            case 's':
                return pad(date.getSeconds());
            default:
                throw new Error('Unsupported format code: ' + fmtCode);
            }
        });
    }
    
    const startSession =()=>{
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined){
            return
        }
        
        // var message = {
        //     "type": "session_starts",
        //     "session_id": props.location.state.pk
        // }
        // ws.send(JSON.stringify(message))   
        
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
        var headers = {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'JWT ' + authTokens
                    }
                  }
        
        var to_update = Object.assign({
            "starting_point" : formatDate(new Date(Date.now()), '%Y-%M-%d %H:%m:%s'),
            "started" : true
        })
        SessionDataService.update(props.location.state.pk, to_update, headers).then(response=>{
            history.push({pathname:'/sessions/current',state: response.data})
        })
        .catch((err)=> {
            console.log(err.response)
        })

    }
    const start_water = () => {
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined){
            return
        }
        
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
        
        var headers = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'JWT ' + authTokens
            }
          }

        var to_update = Object.assign({
            "cooling_point" : formatDate(new Date(Date.now()), '%Y-%M-%d %H:%m:%s'),
        })
        // console.log(formatDate(new Date(Date.now()), '%Y-%M-%d %H:%m:%s'))

        SessionDataService.update(props.location.state.pk, to_update, headers).then(response=>{
            history.push({pathname:'/sessions/current',state: response.data})

        })
        .catch((err)=> {
            console.log(err.response)
        })
    }
    const endSession=()=>{
        if(ws === undefined || readings.time[readings.time.length-1]=== undefined){
            return
        }
        var confirm = window.confirm('Are you sure you want end the Session?')
        if (confirm === true){
            var headers = {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'JWT ' + authTokens
                }
              }
    
            var to_update = Object.assign({
                "ending_point" : formatDate(new Date(Date.now()), '%Y-%M-%d %H:%m:%s'),
                "current": false,
                "started": false,
                "ended" : true
            })
            // console.log(formatDate(new Date(Date.now()), '%Y-%M-%d %H:%m:%s'))
    
            SessionDataService.update(props.location.state.pk, to_update, headers).then(response=>{
                history.push({pathname:'/sessions'})
            })
            .catch((err)=> {
                console.log(err.response)
            })
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
    const renderTooltip=(props)=> {
        
        return (
          <Tooltip id="button-tooltip" {...props}>
            Display Missing Data
          </Tooltip>
        );
      }
    return ( 
        <div className="w3-row">
            <div className="w3-container">
                        <div className="w3-container  w3-center w3-hide-medium w3-hide-small" style={{display:"flex",}}>
                            <div className="w3-col w3-margin">
                                <ListGroup horizontal>
                                        <ListGroup.Item> {props.location.state.product_name} </ListGroup.Item>
                                        <ListGroup.Item> {props.location.state.process_name} </ListGroup.Item>
                                        <ListGroup.Item> {props.location.state.session_name} </ListGroup.Item>
                                        <ListGroup.Item> {props.location.state.required_temp}(°C)</ListGroup.Item>
                                        <ListGroup.Item> {props.location.state.holding_time} </ListGroup.Item>
                                        <ListGroup.Item> {props.location.state.operator} </ListGroup.Item>
                                </ListGroup>
                            </div>
                                    <div className="w3-card-2 w3-margin"  style={{display:"flex", alignItems:"flex-end"}}>

                                        <OverlayTrigger
                                            placement="top"
                                            delay={{ show: 250, hide: 300 }}
                                            overlay={renderTooltip}
                                        >
                                            <Button style={{color: "#D4490D"}} variant="light" onClick={()=> window.location.reload(false)}><FiRefreshCcw size="2em"></FiRefreshCcw></Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Add a Label
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={handleShow} ><AiOutlinePlus strokeWidth="20px" size="2em"></AiOutlinePlus></Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Start Recording
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={startSession} ><AiFillFire size="2em"></AiFillFire></Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Start Cooling 
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={start_water} ><IoIosWater size="2em"></IoIosWater></Button>
                                    </OverlayTrigger>
                                    
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Stop
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={endSession}><FaRegStopCircle size="2em"></FaRegStopCircle></Button>
                                    </OverlayTrigger>
                                    
                                    <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Label</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <input className="form-control form-control-sm m-2" type="text" placeholder="Label Name:" name="modalInputTemp" value={modalInputName} onChange={e=>setModalInputName(e.target.value)} />
                                            <input className="form-control form-control-sm m-2" type="text" placeholder="Temperature:" name="modalInputTemp" value={modalInputTemp} onChange={e=>setModalInputTemp(e.target.value)} />
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="outline-danger" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="success" onClick={addMarker}>
                                            Save Changes
                                        </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                        </div>
                        <div className="w3-display-container w3-mobile w3-margin w3-hide-large w3-hide-small">
                                <div className="w3-left w3-margin-right">
                                    <ListGroup horizontal>
                                            <ListGroup.Item> {props.location.state.product_name} </ListGroup.Item>
                                            <ListGroup.Item> {props.location.state.process_name} </ListGroup.Item>
                                            <ListGroup.Item> {props.location.state.session_name} </ListGroup.Item>
                                            <ListGroup.Item> {props.location.state.required_temp}(°C)</ListGroup.Item>
                                            <ListGroup.Item> {props.location.state.holding_time} </ListGroup.Item>
                                            <ListGroup.Item> {props.location.state.operator} </ListGroup.Item>
                                    </ListGroup>
                                </div>
                                <div className="w3-right w3-card-2">
                                
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{ show: 250, hide: 300 }}
                                            overlay={renderTooltip}
                                        >
                                            <Button style={{color: "#D4490D"}} variant="light" onClick={()=> window.location.reload(false)}><FiRefreshCcw size="2em"></FiRefreshCcw></Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Add a Label
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={handleShow} ><AiOutlinePlus strokeWidth="20px" size="2em"></AiOutlinePlus></Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Start Recording
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={startSession} ><AiFillFire size="2em"></AiFillFire></Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Start Cooling 
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={start_water} ><IoIosWater size="2em"></IoIosWater></Button>
                                    </OverlayTrigger>
                                    
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Stop
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={endSession}><FaRegStopCircle size="2em"></FaRegStopCircle></Button>
                                    </OverlayTrigger>
                                    
                                    <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Label</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <input className="form-control form-control-sm m-2" type="text" placeholder="Label Name:" name="modalInputTemp" value={modalInputName} onChange={e=>setModalInputName(e.target.value)} />
                                            <input className="form-control form-control-sm m-2" type="text" placeholder="Temperature:" name="modalInputTemp" value={modalInputTemp} onChange={e=>setModalInputTemp(e.target.value)} />
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="outline-danger" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="success" onClick={addMarker}>
                                            Save Changes
                                        </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                        </div>
                                <div className="w3-center w3-hide-large w3-hide-medium">
                                
                                        <OverlayTrigger
                                            placement="top"
                                            delay={{ show: 250, hide: 300 }}
                                            overlay={renderTooltip}
                                        >
                                            <Button style={{color: "#D4490D"}} variant="light" onClick={()=> window.location.reload(false)}><FiRefreshCcw size="2em"></FiRefreshCcw></Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Add a Label
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={handleShow} ><AiOutlinePlus strokeWidth="20px" size="2em"></AiOutlinePlus></Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Start Recording
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={startSession} ><AiFillFire size="2em"></AiFillFire></Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Start Cooling 
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={start_water} ><IoIosWater size="2em"></IoIosWater></Button>
                                    </OverlayTrigger>
                                    
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 300 }}
                                        overlay={
                                            <Tooltip id="button-tooltip">
                                                Stop
                                            </Tooltip>
                                        }
                                    >
                                        <Button style={{color: "#D4490D"}} variant="light" onClick={endSession}><FaRegStopCircle size="2em"></FaRegStopCircle></Button>
                                    </OverlayTrigger>
                                    
                                    <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Label</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <input className="form-control form-control-sm m-2" type="text" placeholder="Label Name:" name="modalInputTemp" value={modalInputName} onChange={e=>setModalInputName(e.target.value)} />
                                            <input className="form-control form-control-sm m-2" type="text" placeholder="Temperature:" name="modalInputTemp" value={modalInputTemp} onChange={e=>setModalInputTemp(e.target.value)} />
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="outline-danger" onClick={handleClose}>
                                            Close
                                        </Button>
                                        <Button variant="success" onClick={addMarker}>
                                            Save Changes
                                        </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                        <div className="w3-container">
                            <Chart 
                                ref={ref=> chartRef = ref}
                                name={'Required Temperature'} 
                                required_temp={props.location.state.required_temp.toString()}
                                readings={readings}
                                >
                            </Chart>
                        </div>
                        
            </div>
        </div>
     ) ;
}
 

export default CurrentSessions;
