import React, {useState} from 'react';
import InputField from './InputField'
import {ButtonField} from './Button/ButtonField'
import { Form, Modal } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
export const FormContainer = ({formTitle, children, formType,buttonType, onSave}) => {
    const [modalShow, setModalShow] = useState(false);
    let history = useHistory()

    const handleConfirmClose = () => setModalShow(false);
    const handleConfirmShow = () => setModalShow(true);
    const confirmCancel= ()=> {
        history.goBack()
    }
    const handleSubmit=props=>{
        const form = props.currentTarget
        form.preventDefault()
    }
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
    return ( 
        <div className="w3-container" style={{paddingTop: "10px"}}>
            <div style={{color:"white"}}>
                <h3 style={{textAlign: "center", margin: "0 0 15px", color:"#808080"}}>{formType}<i>{formTitle? ` : ${formTitle}` : ''}</i></h3>
            </div> 
            <div>
              <div className="w3-container w3-card" style={{width:"500px",margin:"auto",  borderColor: "lightgrey", borderWidth : "1px", borderStyle: "solid", padding : "10px", 
              }}>
                {children}
                
                </div>
            </div>

        </div> 
     );
}
 
