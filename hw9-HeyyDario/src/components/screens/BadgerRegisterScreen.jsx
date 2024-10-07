import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import {useState, useEffect} from 'react';

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [warning, setWarning] = useState('');

    // in real-time warning
    useEffect(() => {
        handleWarningChange();
    }, [password, passwordConfirm])

    const handleWarningChange = () => {
        // console.log("password: " + password);
        // console.log("confirmation: " + passwordConfirm);
        if(!password){
            setWarning("Please enter a password");
        } else if(password !== passwordConfirm){
            setWarning("Passwords do not match");
        } else {
            setWarning("");
        }
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text style={styles.title}>Username</Text>
        <TextInput
            autoCapitalize="none"
            style={styles.input}
            placeholder="username"
            value={username}
            onChangeText={newUsername => setUsername(newUsername)} />
        <Text style={styles.title}>Password</Text>
         <TextInput
            autoCapitalize="none"
            style={styles.input}
            placeholder="password"
            defaultValue={password}
            onChangeText={newPassword => {
                setPassword(newPassword);
                handleWarningChange();
                }}
            secureTextEntry={true} />
        <Text style={styles.title}>Confirm Password</Text>
         <TextInput
            autoCapitalize="none"
            style={styles.input}
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChangeText={confirmation => {
                setPasswordConfirm(confirmation)
                handleWarningChange();
                }} 
            secureTextEntry={true} />
        
        {warning ? (<Text style={styles.warning}>{warning}</Text>) : null}

        <Button color="crimson" title="Signup" onPress={() => props.handleSignup(username, password)} />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    warning: {
        color: 'red',
    },
    input: {
        width: '100%',
        height: 33,
        borderColor: 'gray',
        borderWidth: 1.2,
        padding: 2,
        marginBottom: 15,
        fontSize: 12,
        borderRadius: 5
    },
    title: {
        fontSize: 20,
        padding: 10,
    }
});

export default BadgerRegisterScreen;