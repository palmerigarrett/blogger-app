import React from 'react';
import '../../App.css';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'

function Footer() {

  return (
    <div className="footer-text">
      <Navbar
        bg="dark"
        variant="dark"
        // fixed="bottom"
        style={{
          // height: "4%",
          // marginTop: "1%",
          opacity: "90%",
          padding: "0px 0px",
          bottom: "0",
          left: "0",
          right: "0",
          width: "100%",
          position: "static"
        }}
        >
          <Nav className="mr-auto">
            <Container fluid>
              
                  <Nav.Link>Owned by Newark's Students</Nav.Link>
              
                  <Nav.Link>Made in 2021</Nav.Link>
              
                  <Nav.Link >@CityOfNewark</Nav.Link>
              
            </Container>
          </Nav>
      </Navbar>
    </div>
  );
}

export default Footer;