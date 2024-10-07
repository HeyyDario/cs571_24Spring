import React, {useRef, useContext} from 'react';
import {Button, Form} from 'react-bootstrap';
import { useNavigate } from 'react-router';

import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {

    // TODO Create the login component.
    // uncontrolled input components
    const usernameRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const handleLogin = (e) => {
        e?.preventDefault();

        if (!usernameRef.current.value || !passwordRef.current.value){
            alert('You must provide both a username and password!');
            return;
        }

        fetch('https://cs571.org/api/s24/hw6/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json',
                'X-CS571-ID': CS571.getBadgerId(),
            },
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            })
        })
        .then(res => {
            //console.log(res.status);
            if (res.status === 401){
                alert('Incorrect username or password!');
            } else {
                //After successful login/register
                alert('Login was successful!');
                setLoginStatus({ isLoggedIn: true, username: usernameRef.current.value }); // Adjust to *.current.value
                navigate('/'); // Redirect to home page
            }
        })
    } 
    return <>
        <h1>Login</h1>
        <Form onSubmit={handleLogin}>
            <Form.Label htmlFor='usernameInput' >Username</Form.Label>
            <Form.Control id='usernameInput' 
                          ref={usernameRef}
                          placeholder="Enter username here..." 
            />
            <Form.Label htmlFor='passwordInput'>Password</Form.Label>
            <Form.Control id='passwordInput' 
                          ref={passwordRef}
                          type='password'
                          placeholder="Enter password here..." 
            />
            <div>
                <Button type='submit' onClick={handleLogin}>Login</Button>
            </div>
        </Form>
    </>
}
