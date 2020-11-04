import React from 'react';
import { AppContext } from "../../App";
// import { useHistory } from "react-router-dom";
import { doFetch, doAuthFetch } from '../utils'
import useCookie from '../utils/hooks/useCookie'
import '../../App.css';
import Button from 'react-bootstrap/Button'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Form from 'react-bootstrap/Form'
import validEmail from '../utils/validators/validEmail'
import validLength from '../utils/validators/validLength'
import validPassword from '../utils/validators/validPassword'
import validString from '../utils/validators/validString'
import fetchLoginToken from './Login'


const { useContext, useEffect, useState } = React;

const Register = () => {
    const [cookieUser, setCookieUser] = useCookie("user", "");
    const { dispatch, state } = useContext(AppContext);
    const [tokenValidated, setTokenValidated] = useState(false)
    const [registerState, setRegisterState] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    })
    const [validRegisterState, setValidRegisterState] = useState({
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        confirm_password: true
    });
    const [errorState, setErrorState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        credentials: ''
    });
    const [error, setError] = useState('')
    useEffect(() => {
        console.log('reg state: ', registerState)
    }, [registerState])

    async function createUser() {
        const route = '/register'
        const requestBody = {
            ...registerState
        }
        console.log("userData: ", requestBody)

        const data = await doFetch({ url: route, body: requestBody, type: 'POST' })

        console.log('create user data res: ', data)

        if (data.error) {
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
    
    async function handleCreateUser(e) {
        e.preventDefault();
        if (checkUserValidity() === true) {
            const submitted = await createUser(registerState)

            if (submitted === false) {
                setErrorState({
                    ...errorState,
                    credentials: 'Sorry, looks like we are having some trouble with our server. Check in with your PIN member!'
                })
            } else {
                setErrorState({
                    ...errorState,
                    credentials: ''
                })
            }
        }

    }

    function checkPasswordValidity() {
        let allValid = true
        let isValidPassword = false
        let isValidConfirmPassword = false

        if (validPassword(registerState.password) === false || validString(registerState.password) === false || validLength(8, 50, registerState.password) === false) {
            isValidPassword = false
            allValid = false
        }

        if (registerState.password !== registerState.confirm_password) {
            isValidConfirmPassword = false
            allValid = false
        }

        setValidRegisterState({
            ...validRegisterState,
            password: isValidPassword ? '' : '* Please enter a valid password',
            confirm_password: isValidConfirmPassword ? '' : '* Please enter matching passwords',
        })

        setErrorState({
            ...errorState,
            password: isValidPassword,
            confirm_password: isValidConfirmPassword,
        })
    };

    function checkUserValidity() {
        let allValid = true
        let isValidFirstName = true
        let isValidLastName = true
        let isValidEmail = true

        if (validString(registerState.first_name) === false || validLength(0, 100, registerState.first_name) === false) {
            isValidFirstName = false
            allValid = false
        }

        if (validString(registerState.last_name) === false || validLength(0, 100, registerState.last_name) === false) {
            isValidLastName = false
            allValid = false
        }

        if (validEmail(registerState.email) === false || validString(registerState.email) === false || validLength(0, 100, registerState.email) === false) {
            isValidEmail = false
            allValid = false
        }

        setValidRegisterState({
            ...validRegisterState,
            first_name: isValidFirstName,
            last_name: isValidLastName,
            email: isValidEmail,
        })

        setErrorState({
            ...errorState,
            first_name: isValidFirstName ? '' : '* Please enter a valid name',
            last_name: isValidLastName ? '' : '* Please enter a valid name',
            email: isValidEmail ? '' : '* Please enter a valid email',
        })

        console.log('validityCheck called: ', allValid, validRegisterState)
        return allValid
    };

    const handleUserInputChange = (e) => {
        e.preventDefault()
        const name = e.target.name
        const value = e.target.value

        if (name.indexOf('password') !== -1) {
            checkPasswordValidity()
        }
        setRegisterState({
            ...registerState,
            [name]: value
        })
    }
    return (
        <Form onSubmit={handleCreateUser}>
            <Form.Group>
                <Jumbotron>
                    <h2>Don't have an account? Register</h2>
                    <p>
                        Register so other readers can read what you have to say!
                    </p>
                </Jumbotron>
                <br/>
                <Form.Label>First Name</Form.Label>
                <Form.Control name="first_name" type="text" onChange={handleUserInputChange} value={registerState.first_name} />
                <Form.Text className="warningText" muted>
                        {validRegisterState.first_name ? '' : '* Please enter a valid pin email'}
                </Form.Text>
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="last_name" type="text" onChange={handleUserInputChange} value={registerState.last_name} />
                <Form.Text className="warningText" muted>
                        {validRegisterState.last_name ? '' : '* Please enter a valid pin email'}
                </Form.Text>
                <Form.Label>Personal Email</Form.Label>
                <Form.Control name="email" type="text" onChange={handleUserInputChange} value={registerState.email} />
                <Form.Text className="warningText" muted>
                        {validRegisterState.email ? '' : '* Please enter a valid pin email'}
                </Form.Text>
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" onChange={handleUserInputChange} value={registerState.password} />
                <Form.Text muted>
                        Your password should be between 8-50 characters and include at least one number and symbol
                </Form.Text>
                <Form.Text className="warningText" muted>
                        {validRegisterState.password ? '' : '* Please enter a valid password'}
                </Form.Text>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control name="confirm_password" type="password" onChange={handleUserInputChange} value={registerState.confirm_password} />
                <Form.Text className="warningText" muted>
                        {validRegisterState.confirm_password ? '' : '* Please enter matching password values'}
                </Form.Text>
            </Form.Group>
            <Button
                variant="success"
                type="submit"
            >
                Register
            </Button>
        </Form>
    );
}

export default Register