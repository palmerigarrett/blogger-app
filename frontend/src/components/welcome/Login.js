import React from 'react';
import { AppContext } from "../../App";
// import { useHistory } from "react-router-dom";
import useCookie from '../utils/hooks/useCookie'
import '../../App.css';
import { validEmail, validLength, validString } from '../utils'
import { doFetch } from '../utils'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Modal from 'react-bootstrap/Modal'

const { useContext, useState } = React;

function Login() {
    const [cookieUser, setCookieUser] = useCookie("user", "");
    const { dispatch } = useContext(AppContext);
    
    // const history = useHistory();
    const [userState, setUserState] = useState({
        email: '',
        password: ''
    })
    const [validValue, setValidValue] = useState({
        email: true,
        password: true
    })
    const [error, setError] = useState('')
    const [show, setShow] = useState(false)

    async function fetchLoginToken() {
        const route = 'login'
        const requestBody = {
            ...userState
        }
        const data = await doFetch({ url: route, body: requestBody, type: 'POST' }
        )
        console.log("data:", data)
        if (data.error) {
            setShow(true)
            setError(data.errorMessage)
        } else {
            setCookieUser(data.res.token, 7)
            console.log("Login.js - cookieUser: ", cookieUser)
            console.log("Login.js - data", data)
            dispatch({
                type: "LOGIN",
                payload: data.res.token
            })
        }
    }

    function checkValidity() {
        let allValid = true
        let isValidEmail = true
        let isValidPassword = true

        if (validEmail(userState.email) === false || validString(userState.email) === false || validLength(0, 100, userState.email) === false) {
            isValidEmail = false
            allValid = false
        }
    
        if (validString(userState.password) === false || validLength(0, 100, userState.password) === false) {
            isValidPassword = false
            allValid = false
        }

        setValidValue({
            email: isValidEmail,
            password: isValidPassword,
        })

        console.log('validityCheck called: ', allValid, validValue)
        return allValid
    }
    
    const handleLoginUser = (e) => { e.preventDefault(); if (checkValidity() === true) { return fetchLoginToken() }}
    const handleClose = () => setShow(false)

    const handleInputChange = (e) => {
        e.preventDefault()
        const name = e.target.name
        const value = e.target.value
        setUserState({
            ...userState,
            [name]: value
        })
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                keyboard={false}
                animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Oops!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error}. Try again!
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            <Jumbotron>
                <h2>Login to Blogger!</h2>
                <p>
                Login to start bloggin'!
                </p>
            </Jumbotron>
            <Form onSubmit={handleLoginUser}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="text" onChange={handleInputChange} value={userState.email} />
                    <Form.Text className="warningText" muted>
                            {validValue.email ? '' : '* Please enter a valid email'}
                    </Form.Text>
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" onChange={handleInputChange} value={userState.password} />
                    <Form.Text className="warningText" muted>
                            {validValue.password ? '' : '* Please enter a valid password value'}
                    </Form.Text>
                </Form.Group>
                {/* <Button
                    variant="danger"
                    // onClick={forgotPassword}
                >
                    Forgot Password
                </Button> */}
                <Button
                    variant="success"
                    type="submit"
                >
                    Login
                </Button>
            </Form>
        </>
    );
}

export default Login;