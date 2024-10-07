import { Alert, Button, StyleSheet, Text, View, TextInput, Card } from "react-native";
//import { TextInput } from "react-native-gesture-handler";
import {useState} from "react";

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return <View style={styles.container}>
        <Text style={{ fontSize: 36, padding: 20 }}>BadgerChat Login</Text>
        <Text style={styles.title}>Username</Text>
        <TextInput
            autoCapitalize="none"
            style={styles.input}
            placeholder="username"
            defaultValue={username}
            onChangeText={newUsername => setUsername(newUsername)} />
        <Text style={styles.title}>Password</Text>
         <TextInput
            autoCapitalize="none"
            style={styles.input}
            placeholder="password"
            defaultValue={password}
            onChangeText={newPassword => setPassword(newPassword)} 
            secureTextEntry={true}/>
        <Button style={styles.button} color="crimson" title="Login" onPress={() => {
            //Alert.alert("Hmmm...", "I should check the user's credentials!");
            props.handleLogin(username, password)
        }} />
        <Text>New here?</Text>
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="CONTINUE AS A GUEST" onPress={() => props.setIsGuest(true)} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        padding: 10,
        fontWeight: 'bold',
        fontSize: 20,
    },
    button: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
        padding: 10
    },
    input: {
        width: '50%',
        height: 33,
        borderColor: 'gray',
        borderWidth: 1.2,
        padding: 5,
        marginBottom: 15,
        fontSize: 12,
        borderRadius: 5
    },
});

export default BadgerLoginScreen;