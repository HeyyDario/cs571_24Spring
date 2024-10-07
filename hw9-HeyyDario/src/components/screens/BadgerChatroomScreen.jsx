import { StyleSheet, Text, View, FlatList, Modal, Pressable, TextInput, Alert, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import CS571 from '@cs571/mobile-client'
import BadgerChatMessage from "../helper/BadgerChatMessage";

import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');

    // console.log("checking the props: " + props);
    // console.log("checking the props name: " + props.name);
    // console.log("checking the props username: " + props.username);
    // console.log("checking the props token: " + props.token);

    useEffect(() => {
        refresh();
    }, [])

    function refresh() {
        setIsLoading(true);
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
            method: 'GET',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
        //   console.log(data)
          setMessages(data.messages);
          setIsLoading(false);
          //console.log("data set!")
        })
    }

    // console.log("checking token in BadgerChatroomScreen:" + props)

    const handleCreatePost = () => {
        // console.log("token: " + props.token)
        // console.log("name: " + props.name)
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Authorization": `Bearer ${props.token}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title:postTitle, content: postBody})
        })
        .then(res => {
            //console.log(res.status);
            if(res.status === 200){
                // Upon posting, the user should see an Alert notifying them that their post was successful
                Alert.alert("Successfully posted!", "Your post has been created successfully.");
                // as well as the updated message board, reverting back to the first page.
                refresh();
            } else {
                //console.log(res.status);
                //console.log(props.token);
                Alert.alert("Error existing!", "Failed to create a post.")
            }
            setPostTitle('');
            setPostBody('');
            setModalVisible(false);
        })
    }

    const handleDeletePost = (id) => {
        fetch(`https://cs571.org/api/s24/hw9/messages?id=${id}`, {
            method: 'DELETE',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Authorization": `Bearer ${props.token}`,
            }
        })
        .then(res => {
            //console.log(res.status);
            if(res.status === 200){
                // Upon posting, the user should see an Alert notifying them that their post was successful
                Alert.alert("Successfully deleted!", "Your post has been deleted successfully.");
                // as well as the updated message board, reverting back to the first page.
                refresh();
            } else {
                Alert.alert("Error!", "Failed to delete a post.")
            }
        })
    }

    // console.log(messages)

    // FlatList from https://snack.expo.dev/@ctnelson1997/flatlist
    // modal from https://snack.expo.dev/@ctnelson1997/modal-example
    return <View style={{ flex: 1 }}>
        
        {/* build a flatlist */}
        <FlatList
        data={messages}
        onRefresh={refresh}
        refreshing={isLoading}
        scrollIndicatorInsets={{ right: 1 }}
        renderItem={(renderOjb) => {
            const item = renderOjb.item
            //console.log('reach render');
            //console.log(item);
            return <>
                <BadgerChatMessage {...item}>
                </BadgerChatMessage>
                {(item.poster === props.username && !props.isGuest) && (
                    <Button
                        title="Delete"
                        onPress={() => handleDeletePost(item.id)}
                        color="red"
                    />
                )}
            </>
            }}
        keyExtractor={item => item.id}
      >
      </FlatList>

        {/* build a modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        presentationStyle={"formSheet"}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(false);
        }}>
        <View>
          <View style={styles.modalView}>
            <TextInput 
                placeholder="Title"
                value={postTitle}
                onChangeText={newTitle => setPostTitle(newTitle)}
                style={styles.inputTitle}
            />
            <TextInput 
                placeholder="Body"
                value={postBody}
                onChangeText={newBody => setPostBody(newBody)}
                style={styles.inputBody}
            />
            {/* disabled when the post is lacking either a title or body */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable
                    style={{ flex: 1, marginRight: 5 }}
                    onPress={handleCreatePost}
                    disabled={!postTitle || !postBody}>
                <Text style={{ color: (!postTitle || !postBody) ? 'grey': 'black'}}>Create Post</Text>
                </Pressable>
                <Pressable
                    onPress={() => setModalVisible(o => !o)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    {
      !props.isGuest ? 
      <View style={styles.container}>
        <Pressable
            style={styles.button}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.text}>Add Post</Text>
        </Pressable>
      </View> 
      :
    <></>
    }
    </View>
}

const styles = StyleSheet.create({
    // // Get the full width of the device screen
    // const { width } = Dimensions.get('window');
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        padding: 4,
        margin: 4,
        backgroundColor: 'white',
    },
    modalView: {
        margin: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputTitle: {
        fontSize: 20,
        padding: 20,
        margin: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
        backgroundColor: '#f9f9f9',
    },
    inputBody: {
        height: 200,
        width: 260,
        fontSize: 16,
        padding: 12,
        margin: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
        backgroundColor: '#f9f9f9',
    },
    button: {
        padding: 12,
        backgroundColor: 'red',
        borderRadius: 6,
        width: 400, // Adjust the width as needed
        height: 60,  // Adjust the height as needed
    },
    text: {
        textAlign: 'center', // Center the text inside the Pressable
        fontSize: 16, // Adjust text size
        color: 'white'
    },
});

export default BadgerChatroomScreen;