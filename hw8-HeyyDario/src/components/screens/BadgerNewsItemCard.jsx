import {useState, useEffect, useCallback} from 'react';
import { Pressable, StyleSheet, View, Image, ScrollView, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";

function BadgerNewsItemCard({article}){

    //console.log(article);
    const navigation = useNavigation();
    //console.log(props.img);
    
    return (
        <Pressable style={styles.card}
            onPress={() => navigation.navigate("BadgerNewsArticle", {
                fullArticleId: article.fullArticleId,
                title: article.title,
                img: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${article.img}`
            })}>
            
            <Image source={{uri: "https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/" + article.img}} style={styles.image}/>
            <Text style={styles.title}>{article.title}</Text>
            {/* {console.log("hi")} */}
            
        </Pressable>
    );
}

const styles = StyleSheet.create({ // from https://snack.expo.dev/@ctnelson1997/badgercard
    card: {
        padding: 16,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 8,
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    image:{
        width: 380,
        height: 244,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    }
})

export default BadgerNewsItemCard;