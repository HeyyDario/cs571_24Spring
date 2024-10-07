import { useEffect, useState } from 'react';
import {Alert} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    fetch('https://cs571.org/api/s24/hw9/chatrooms', {
      method: 'GET',
      headers: {
        'X-CS571-ID': CS571.getBadgerId(),
      }
    })
    .then(res => res.json())
    .then(data => {
      //console.log(data);
      setChatrooms(data);
      //console.log(chatrooms);
      SecureStore.getItemAsync("jwt").then((jwt) => {
        setToken(jwt)
      })
    })
    //setChatrooms(["Hello", "World"]) // for example purposes only!
  }, [username, token]);

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    fetch('https://cs571.org/api/s24/hw9/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json',
                'X-CS571-ID': CS571.getBadgerId(), //bid_1d063ccf6b89665aacf1c67b3c0e21c34620e5da7b20995dbc0042f3b2c2cecb
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
            //console.log(res.status);
            if (res.status === 401){
              alert('invalid username or password.');
            } else if(res.status === 200){
              //After successful login/register
              alert('Login was successful!');
              setIsLoggedIn(true);
              setUsername(username);
              res.json().then(data => {
                //console.log(data);
                //console.log(data.token);
                if (data && data.token) {
                  SecureStore.setItemAsync("jwt", data.token);
                  //console.log(token);
                  //setToken(SecureStore.getItemAsync('jwt'));
                } else {
                  //console.error('No token received from server.');
                  setToken('');
                }
              })
            } else if(res.status === 400){
              alert('Bad request, please enter your password.');
            }
        })
        .catch(error => {
          console.error('An error occurred:', error);
        });
  }

  // useEffect(() => {
  //   SecureStore.getItemAsync("jwt").then((jwt) => {
  //     setToken(jwt)
  //   })
  // }, [username])



  function handleSignup(username, password) {
    // hmm... maybe this is helpful!
    fetch('https://cs571.org/api/s24/hw9/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json',
                'X-CS571-ID': CS571.getBadgerId(),
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
            //console.log("login result: " + res.status);
            if (res.status === 409){
              alert('Conflict! This account already exists.');
              //console.log(username)
            } else if(res.status === 200){
              //console.log(username)
              //After successful login/register
              alert('Resgitstration was successful!');
              setIsRegistering(false);
              setIsLoggedIn(true);
              res.json().then(data => {
                // console.log(data);
                // console.log(data.token);
                // console.log(data.user.username);
                setUsername(data.user.username);
                if (data && data.token) {
                  SecureStore.setItemAsync("jwt", data.token);
                  // console.log(token);
                  // SecureStore.getItemAsync('jwt'));
                } else {
                  //console.error('No token received from server.');
                  setToken('');
                }
              })
            } else if (res.status === 400){
              alert('Bad Request! Please set a password for your account.');
            } else if (res.status === 413){
              alert('Request Entity is too large! Try a smaller one.');
            }
        })
        .catch(error => {
          console.error('An error occurred:', error);
        })
    //setIsLoggedIn(true); // I should really do a fetch to register first!
  }

  const handleLogout = () => {
    //remove jwt
    //console.log(token);
    SecureStore.deleteItemAsync('jwt')
    //navigate to login page
    setIsLoggedIn(false);
    setIsGuest(false);
    setUsername('');
    Alert.alert("Successful logout", "You have successfully logged out!");
  }

  //console.log("checking token in BadgerChat: " + token)
  //console.log("checking username in BadgerChat: " + username)

  if (isLoggedIn || isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} token={token} username={username} isGuest={isGuest}/>}
              </ChatDrawer.Screen>
            })
          }
          {
            isLoggedIn ? <ChatDrawer.Screen key="Logout" name="Logout"> 
              {(props) => <BadgerLogoutScreen handleLogout={handleLogout}/>}
            </ChatDrawer.Screen> : <></>
          }
          {
            isGuest ? <ChatDrawer.Screen name="Signup">
              {(props) => <BadgerConversionScreen setIsGuest={setIsGuest} setIsRegistering={setIsRegistering}/>}
            </ChatDrawer.Screen> : <></>
          }
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} 
      setIsRegistering={setIsRegistering} 
      setIsLoggedIn={setIsLoggedIn}
      setIsGuest={setIsGuest} />
  }
}