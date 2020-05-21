import React from 'react'
import { ListGroup } from 'react-bootstrap'

const Header = props => {
    const { details } = props
        return(
            <ListGroup horizontal>
                <ListGroup.Item> {details.product_name} </ListGroup.Item>
                <ListGroup.Item> {details.process_name} </ListGroup.Item>
                <ListGroup.Item> {details.session_name} </ListGroup.Item>
                <ListGroup.Item> {details.required_temp} </ListGroup.Item>
                <ListGroup.Item> {details.holding_time} </ListGroup.Item>
                <ListGroup.Item> {details.operator} </ListGroup.Item>
            </ListGroup>
        )
    }

    export default Header;
