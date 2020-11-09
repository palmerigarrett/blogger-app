import React from 'react';
import { AppContext } from "../../App";
import '../../App.css';
import useCookie from '../utils/hooks/useCookie'
import BlogCreate from '../home/BlogCreate'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import pageRefresh from '../utils/reusable/pageRefresh'

const { useContext, useState } = React;

function Header() {
  const { dispatch, state } = useContext(AppContext);
  const [cookieUser, setCookieUser] = useCookie("user", "");
  const { isLoggedIn } = state;
  const [show, setShow] = useState(false)

  const logout = (e) => {
    e.preventDefault()
    console.log("isLoggedIn: ", isLoggedIn)
    setCookieUser('', 0)
    console.log("cookieUser: ", cookieUser)
    dispatch({
        type: "LOGOUT"
    })
    pageRefresh()
  }

  const handleCreate = (e) => {setShow(true)}
  const handleClose = () => {setShow(false)}

  // useEffect(() =>{
  //   console.log("cookie: ", document.cookie)
  // }, [])
  
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <BlogCreate/>
        </Modal.Body>
      </Modal>
      <Navbar
        bg="dark"
        variant="dark"
        id="header"
        >
          <Button
            variant="transparent"
            className="btn bg-transparent"
            id="logo"
            >
              <Navbar.Brand href="/blog">blogMe</Navbar.Brand>
            </Button>
          <Nav className="mr-auto">
          </Nav>
              { isLoggedIn
                ?
                <>
                <Nav className="nav-right">
                  {/* <Button
                      onClick={handleCreate}
                      variant="transparent"
                      className="btn bg-transparent"
                      id="headerButton"
                    >
                      Create
                    </Button> */}
                    <DropdownButton
                      variant="transparent"
                      className="btn bg-transparent"
                      id="headerButton"
                      title="Profile"
                    >
                      <Dropdown.Item href="/profile">Your Posts</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="/account">Account</Dropdown.Item>
                    </DropdownButton>
                  
                  
                  <Button
                    variant="transparent"
                    className="btn bg-transparent"
                    id="headerButton"
                  >
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                  </Button>
                </Nav>
                </>
                :
                <>
                <Nav className="nav-right">
                  <Button
                    variant="transparent"
                    className="btn bg-transparent"
                    id="headerButton"
                  >
                    <Nav.Link href="/register">Register</Nav.Link>
                  </Button>
                  <Nav.Link href="/login">
                  <Button
                    variant="transparent"
                    className="btn bg-transparent"
                    id="headerButton"
                  >
                    Login
                  </Button>
                  </Nav.Link>
                </Nav>
                </>
              }
          
      </Navbar>
    </>
  );
}

export default Header;