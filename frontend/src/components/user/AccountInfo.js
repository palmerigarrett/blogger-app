import React from 'react';
import { useHistory } from "react-router-dom";
import '../../App.css';
import { AppContext } from "../../App";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Modal from 'react-bootstrap/Modal';
import {
    doFetch,
    doAuthFetch,
    validString,
    validLength,
    validEmail
} from '../utils'
const { useContext, useState, useEffect } = React;

function AccountInfo() {
    const { state } = useContext(AppContext)
    const { token } = state
    let history = useHistory()
    // fixme: set an initial state to avoid all of this nonsense
    const [profileState, setProfileState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })
    const [currentProfileState, setCurrentProfileState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })
    const [passwordState, setPasswordState] = useState({
        password: '',
        confirm_password: '',
      })
      const [editPasswordState, setEditPasswordState] = useState({
        password: '',
        confirm_password: '',
        new_password: '',
      })
      const [validProfileState, setValidProfileState] = useState({
        first_name: false,
        last_name: false,
        email: false,
        password: false,
        new_password: false,
      })
      const [errorState, setErrorState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        new_password: ''
      })
      const [show, setShow] = useState(false)
      const [error, setError] = useState(false)
      const [errorMessage, setErrorMessage] = useState('')
      const [isEditingUser, setIsEditingUser] = useState(false)
      const [isEditingPassword, setIsEditingPassword] = useState(false)
      const [isValidatingUser, setIsValidatingUser] = useState(false)

    async function fetchAccountInfo() {
        const route = '/account'
        console.log(token)
        const data = await doAuthFetch({ url: route, token: token, type: 'GET' })
        console.log("data", data)
        if (data.error) {
            setError(true)
            setShow(true)
        } else {
            setCurrentProfileState({
                first_name: data.res.user.first_name,
                last_name: data.res.user.last_name,
                email: data.res.user.email,
                password: data.res.user.password
            })
            setProfileState({
                first_name: data.res.user.first_name,
                last_name: data.res.user.last_name,
                email: data.res.user.email,
                password: data.res.user.password
            })
        }
    }
    
    useEffect(() => {
        fetchAccountInfo()
        console.log("currentProfileState:", currentProfileState)
    },[])

    function checkUserValidateValidity() {
        let isValidPassword = true;
    
        if (validString(passwordState.password) === false || validLength(8, 100, passwordState.password) === false || passwordState.password !== passwordState.confirm_password) {
          isValidPassword = false
        }
    
        setValidProfileState({
          password: isValidPassword,
        })
    
        setErrorState({
          password: isValidPassword ? '' : '* Please enter matching passwords between 8 and 100 characters',
        })
    
        console.log('validityCheck called: ', isValidPassword, passwordState)
        return isValidPassword
    }
    
    function checkEditPasswordValidity() {
        let isValidPassword = true;
        let isValidNewPassword = true;

        if (validString(editPasswordState.password) === false || validLength(8, 100, editPasswordState.password) === false || editPasswordState.password !== editPasswordState.confirm_password) {
            isValidPassword = false
        }

        if (validString(editPasswordState.new_password) === false || validLength(8, 100, editPasswordState.new_password) === false) {
            isValidPassword = false
        }

        setValidProfileState({
            password: isValidPassword,
            new_password: isValidNewPassword,
        })

        setErrorState({
            password: isValidPassword ? '' : '* Please enter matching passwords between 8 and 100 characters',
            new_password: isValidNewPassword ? '' : '* Please enter a valid password between 8 and 100 characters',
        })

        console.log('validityCheck called: ', isValidPassword, passwordState)
        return isValidPassword
    }

    function checkUserEditValidity() {
        let isValidFirstName = true;
        let isValidLastName = true;
        let isValidEmail = true;
        

        let allValid = true;

        if (validString(profileState.first_name) === false || validLength(0, 50, profileState.first_name) === false) {
        isValidFirstName = false
        allValid = false
        }

        if (validString(profileState.last_name) === false || validLength(0, 50, profileState.last_name) === false) {
        isValidLastName = false
        allValid = false
        }

        if (validEmail(profileState.email) === false || validString(profileState.email) === false || validLength(0, 100, profileState.email) === false) {
        isValidEmail = false
        allValid = false
        }
        
        setValidProfileState({
        first_name: isValidFirstName,
        last_name: isValidLastName,
        email: isValidEmail,
        })

        setErrorState({
        first_name: isValidFirstName ? '' : '* Please enter a valid name under fifty characters long',
        last_name: isValidLastName ? '' : '* Please enter a valid name under fifty characters long',
        email: isValidEmail ? '' : '* Please enter a valid email'
        })

        console.log('validityCheck called: ', allValid, validProfileState)
        return allValid
    }

    const handlePasswordInputChange = (e) => {
        e.preventDefault()

        const name = e.target.name
        const value = e.target.value
        setPasswordState({
            ...passwordState,
            [name]: value
        })
    }
    
    const handleEditPasswordInputChange = (e) => {
        e.preventDefault()

        const name = e.target.name
        const value = e.target.value
        setEditPasswordState({
            ...editPasswordState,
            [name]: value
        })
    }
    
    const handleInputChange = (e) => {
        e.preventDefault()
        const name = e.target.name
        const value = e.target.value
        setProfileState({
            ...profileState,
            [name]: value
        })
    }

    const handleUserRedirect = () => {
        setShow(false)
        history.push("/account");
        history.go(0)
    }

    // useEffect(() => {
    //     console.log("isValidating", isValidating)
    //     console.log("isEditing", isEditing)
    // }, [])

    const handleClose = () => {setShow(false); setIsEditingUser(false)}
    const handleToggleEditUser = () => {const isEditing = isEditingUser ? false : true; setIsEditingUser(isEditing); setShow(isEditing); }
    const handleToggleEditPassword = () => {const isEditingPass = isEditingPassword ? false : true; setIsEditingPassword(isEditingPass); setShow(isEditingPass); }
    const handleToggleValidateUser = () => {const isValidating = isValidatingUser ? false : true; setIsValidatingUser(isValidating); setShow(isValidating); }

    async function verifyUser() {
        const route = '/verify'
        const requestBody = {
          password: passwordState.password,
          email: currentProfileState.email,
        }
    
        console.log('verify edit- requestBody', requestBody)
       
        const data = await doAuthFetch({ url: route, token: token, body: requestBody, type: 'POST' })
    
        console.log('verify access key- data ', data)
        console.log("currentProfileState", currentProfileState, "profileState", profileState, "passwordState", passwordState, "validProfileState", validProfileState, "errorState", errorState, show)
        if (data.error) {
          setShow(true)
          setError(true)
          setIsValidatingUser(false)
          setErrorMessage(data.errorMessage)
          setPasswordState({
            password: '',
            confirm_password: '',
          })
        } else {
          setIsEditingUser(true)
          setIsValidatingUser(false)
        }
      }
    
      async function editUser() {
        const route = '/edit'
        const requestBody = profileState
        console.log('user edit- requestBody', requestBody)
       
        const data = await doAuthFetch({ url: route, token: token, body: requestBody, type: 'PUT' })
    
        console.log('Edit access key- data ', data)
        if (data.error) {
          setShow(true)
          setError(true)
          setIsEditingUser(false)
          setErrorMessage(data.errorMessage)
        } else {
          handleUserRedirect()
        }
      }
    
      async function editUserPassword() {
        const route = '/reset'
        const requestBody = {
          ...editPasswordState,
          email: currentProfileState.email
        }
        console.log('user edit- requestBody', requestBody)
       
        const data = await doAuthFetch({ url: route, token: token, body: requestBody, type: 'PUT' })
    
        console.log('Edit access key- data ', data)
        if (data.error) {
          setShow(true)
          setError(true)
          setIsEditingPassword(false)
          setErrorMessage(data.errorMessage)
          setEditPasswordState({
            password: '',
            confirm_password: '',
            new_password: '',
          })
        } else {
          handleUserRedirect()
        }
      }
    
      const handleUserVerify = (e) => {
        e.preventDefault();
    
        if (checkUserValidateValidity()) {
          verifyUser()
        }
      }
    
      const handleEditPassword = (e) => {
        e.preventDefault();
    
        if (checkEditPasswordValidity()) {
          editUserPassword()
        }
      }
    
      const handleUserEdit = (e) => {
        e.preventDefault();
    
        if (checkUserEditValidity()) {
          editUser()
        }
      }
    
      const err = error && show ? true : false;
      const editing = isEditingUser && show ? true : false;
      const validating = isValidatingUser && show ? true : false;
      const editing_password = isEditingPassword && show ? true : false;

    return (
        <>
        <Modal
        show={err}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Error Editing Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttStyle" variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={editing}
        onHide={handleToggleEditUser}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleUserEdit}>
          <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control name="first_name" onChange={handleInputChange} value={profileState.first_name} />
              <Form.Text className="warningText" muted>
                {validProfileState.first_name ? '' : errorState.first_name}
              </Form.Text>
              <Form.Label>Last Name</Form.Label>
              <Form.Control name="last_name" onChange={handleInputChange} value={profileState.last_name} />
              <Form.Text className="warningText" muted>
                {validProfileState.last_name ? '' : errorState.last_name}
              </Form.Text>
              <Form.Label>Personal Email</Form.Label>
              <Form.Control name="email" onChange={handleInputChange} value={profileState.email} />
              <Form.Text className="warningText" muted>
                {validProfileState.email ? '' : errorState.email}
              </Form.Text>
          </Form.Group>
          <Button className="buttStyle" variant="secondary" onClick={handleToggleEditUser}>
            Cancel
          </Button>
          <Button className="buttStyle" type="submit" variant="primary">
            Submit
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={validating}
        onHide={handleToggleValidateUser}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Password to Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleUserVerify}>
          <Form.Group>
              <Form.Label>Enter Password</Form.Label>
              <Form.Control name="password" onChange={handlePasswordInputChange} value={passwordState.password} />
              <Form.Label>Re-enter Password</Form.Label>
              <Form.Control name="confirm_password" onChange={handlePasswordInputChange} value={passwordState.confirm_password} />
              <Form.Text className="warningText" muted>
                {validProfileState.password ? '' : errorState.password}
              </Form.Text>
          </Form.Group>
          <Button className="buttStyle" variant="secondary" onClick={handleToggleValidateUser}>
            Cancel
          </Button>
          <Button className="buttStyle" type="submit" variant="primary">
            Submit
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={editing_password}
        onHide={handleToggleEditPassword}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleEditPassword}>
          <Form.Group>
              <Form.Label>Enter Password</Form.Label>
              <Form.Control name="password" onChange={handleEditPasswordInputChange} value={editPasswordState.password} />
              <Form.Label>Re-enter Password</Form.Label>
              <Form.Control name="confirm_password" onChange={handleEditPasswordInputChange} value={editPasswordState.confirm_password} />
              <Form.Text className="warningText" muted>
                {validProfileState.password ? '' : errorState.password}
              </Form.Text>
              <Form.Label>New Password</Form.Label>
              <Form.Control name="new_password" onChange={handleEditPasswordInputChange} value={editPasswordState.new_password} />
              <Form.Text className="warningText" muted>
                {validProfileState.new_password ? '' : errorState.new_password}
              </Form.Text>
          </Form.Group>
          <Button className="buttStyle" variant="secondary" onClick={handleToggleEditPassword}>
            Cancel
          </Button>
          <Button className="buttStyle" type="submit" variant="primary">
            Submit
          </Button>
        </Form>
        </Modal.Body>
      </Modal>
      <Jumbotron>
        <h2>Welcome to your profile, {currentProfileState.first_name}</h2>
      </Jumbotron>
      <Container fluid>
        <Form>
            <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" defaultValue={currentProfileState.first_name} placeholder={currentProfileState.first_name} readOnly/>
            </Form.Group>

            <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" defaultValue={currentProfileState.last_name} placeholder={currentProfileState.last_name} readOnly/>
            </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" defaultValue={currentProfileState.email} placeholder={currentProfileState.email} readOnly/>
            </Form.Group>
            </Form.Row>

            <Button
className="buttStyle"                 variant="primary"
                type="button"
                onClick={handleToggleValidateUser}
                >
            Edit Profile
            </Button>
            <Button className="buttStyle" variant="secondary" type="button" onClick={handleToggleEditPassword}>
            Edit Password
            </Button>
        </Form>
      </Container>
        </>
    )
}

export default AccountInfo