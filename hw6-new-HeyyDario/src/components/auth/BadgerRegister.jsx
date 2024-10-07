import React, {useState, useContext} from 'react';
import {Button, Form} from 'react-bootstrap';
import { useNavigate } from 'react-router';

import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerRegister() {

    // TODO Create the register component.
    // in a controlled way!!!
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const handleRegister = (e) => {
        e?.preventDefault();

        if (!username || !password){ // user does not enter a username or password
            alert('You must provide both a username and a password!');
            return;
        }

        if(password !== confirmPassword){ // user enters a password and password confirmation that do not match
            alert('Your passwords do not match!');
            return;
        }

        //if ()
        fetch("https://cs571.org/api/s24/hw6/register" , {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
            console.log(res.status)
            if(res.ok){
                alert('Registration was successful!');
                // After successful login/register
                setLoginStatus({ isLoggedIn: true, username: username }); // for ctrl, username
                navigate('/'); // Redirect to home page
            } else if (res.status === 409){
                alert('That username has already been taken!');
            }

        }) 
    }

    return <>
        <h1>Register</h1>
        <Form onSubmit={handleRegister}>
            <Form.Label htmlFor='usernameInput' >Username</Form.Label>
            <Form.Control id='usernameInput' 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username here..."
            />
            <Form.Label htmlFor='passwordInput'>Password</Form.Label>
            <Form.Control id='passwordInput' 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)}
                          type='password' 
                          placeholder="Enter password here..."
            />
            <Form.Label htmlFor='confirmPassword'>Confirm password</Form.Label>
            <Form.Control id='confirmPassword' 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          type='password'
                          placeholder="Confirm your password..."
            />
            <div>
                <Button type='Register' onClick={handleRegister}>Register</Button>
            </div>
        </Form>
    </>
}
