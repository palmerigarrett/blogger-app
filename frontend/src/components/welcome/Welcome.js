import React from 'react';
import '../../App.css';
import Register from '../welcome/Register'
import Login from '../welcome/Login'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Row from 'react-bootstrap/Row'
import Modal from 'react-bootstrap/esm/Modal';

const { useState, useEffect } = React;


function Welcome() {

  const [showReg, setShowReg] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const handleRegClick = (e) => {setShowReg(true)}
  const handleLoginClick = (e) => {setShowLogin(true)}
  const handleClose = () => {setShowReg(false); setShowLogin(false)}

  useEffect(() => {
    
  })

  return (
    <>
      <Modal
       show={showReg || showLogin ? true : false}
       onHide={handleClose}
       keyboard={false}
       animation={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {showReg ? <Register/> : <Login/>}
        </Modal.Body>
      </Modal>
      <Jumbotron style={{ marginBottom: "0" }}>
        <h1>Welcome to blogMe!</h1>
        <p>
          Login or click below to start reading. Enjoy!
        </p>
      </Jumbotron>
      <Container style={{ marginBottom: "2%", marginTop: "2%", width: "90%" }}>
        <Row>
            <Button variant="info" to="/blog" size="lg" block>
              Click here to continue as a guest
            </Button>
        </Row>
      </Container>
      <Container style={{ marginBottom: "2%", marginTop: "2%", width: "90%" }}>
        <Row>
          
          <Col>
            <Button variant="info" onClick={handleRegClick} size="lg" block>
              Register
            </Button>
          </Col>
          <Col>
            <Button variant="info" onClick={handleLoginClick} size="lg" block>
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Welcome;