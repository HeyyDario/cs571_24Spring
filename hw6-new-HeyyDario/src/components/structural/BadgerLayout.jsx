import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from '../../assets/uw-crest.svg'
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {

    // TODO @ Step 6:
    // You'll probably want to see if there is an existing
    // user in sessionStorage first. If so, that should
    // be your initial loginStatus state.
    //const [loginStatus, setLoginStatus] = useState(undefined)
    const [loginStatus, setLoginStatus] = useState(() => {
        const savedLoginStatus = sessionStorage.getItem('loginStatus');
        return savedLoginStatus ? JSON.parse(savedLoginStatus) : { isLoggedIn: false };
    });
    const [chatrooms, setChatrooms] = useState([]);

    // Persist login status changes to sessionStorage
    useEffect(() => {
        sessionStorage.setItem('loginStatus', JSON.stringify(loginStatus));
    }, [loginStatus]);

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw6/chatrooms', {
        headers: {
            "X-CS571-ID": CS571.getBadgerId(),
        },
        method: "GET",
        credentials: "include",
    }).then(res => res.json())
    .then(json => {
      setChatrooms(json)
    })
    }, []);

    //console.log(chatrooms);

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {loginStatus.isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="logout">Logout</Nav.Link>
                            </>
                        ) : ( 
                            <>
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                                <Nav.Link as={Link} to="register">Register</Nav.Link>
                            </>
                        )}
                        {/* <Nav.Link as={Link} to="login">Login</Nav.Link>
                        <Nav.Link as={Link} to="register">Register</Nav.Link> */}
                        <NavDropdown title="Chatrooms" id="chatroomNavDropdown">
                            
                            {/* TODO Display a NavDropdown.Item for each chatroom that sends the user to that chatroom! */
                            chatrooms.map((chatroom) => (
                                <NavDropdown.Item as={Link} key={chatroom} to={`chatrooms/${chatroom}`}>{chatroom}</NavDropdown.Item>
                            ))
                            }
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}

export default BadgerLayout;