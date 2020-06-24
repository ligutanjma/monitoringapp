import React from 'react';
import {Form, Col} from 'react-bootstrap'
import PropTypes from 'prop-types'

const InputField = ({name, label, value, type, placeholder, errorMessage, onChange, etc}) => {
    const handleChange = event=>{
        onChange(event)
    }
    return ( 
        <Form.Group>
            <Form.Label column="md">
                {label}
            </Form.Label>
            <Col>
                <Form.Control 
                size="md" 
                {...etc}
                name={name}
                type={type}
                value={value} 
                placeholder={placeholder}
                onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid" >
                    <span style={{ fontSize: "14px",fontFamily:"courier", fontStretch:"ultra-expanded"}}>{errorMessage || 'This field cannot be empty.'}</span>
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
     );
}
InputField.propTypes= {
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    placholder: PropTypes.string,
    errorMessage: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    etc: PropTypes.object
}
InputField.defaultProps= {
    name:'',
    label: '',
    value:'',
    type:'text',
    placeholder:'',
    errorMessage:'',
    etc:{}
}
export default InputField;