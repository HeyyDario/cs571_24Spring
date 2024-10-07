import { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Animated, Linking, Image, StyleSheet, Pressable } from 'react-native';
import CS571 from '@cs571/mobile-client';

function BadgerNewsArticle(props){
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const opVal = useRef(new Animated.Value(0))

    const { fullArticleId, title, img } = props.route.params;
    
    useEffect(() => {
        fetch(`https://cs571.org/api/s24/hw8/article?id=${fullArticleId}`, {
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            //console.log(data);
            setArticle(data);
            setIsLoading(false);
            Animated.timing(opVal.current, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            }).start();
        })
        .catch(err => console.error('CANNOT fetch article details', err))
    }, [fullArticleId, opVal.current])

    const handleOnPress = () => {
        Linking.openURL(article?.url).catch(err => console.error("Fail to load a specific page", err));
      };

    return (
            <View>
                <ScrollView>
                    <Image style={styles.image} source={{ uri: img }} />
                    <Text style={styles.title}>{title}</Text>
                    {isLoading ? (
                        <Text style={{ marginTop: 20}}>
                            Please wait while your article is loading...
                        </Text>
                        ) : (
                            <Animated.View style={{ opacity: opVal.current }}>
                            <Text style={{padding: 5, fontStyle: 'italic'}}>By {article?.author} on {article?.posted}</Text>
                            <Pressable onPress={handleOnPress}>
                                <Text style={{color: 'blue'}}>Read full article here.</Text>
                            </Pressable>
                            <Text></Text>
                            {article.body.map((paragraph, tag) => (
                                <Text key={tag}>{paragraph}</Text>
                            ))}
                            </Animated.View>)}
                </ScrollView>
            </View>
    ); 
}

const styles = StyleSheet.create({
    image:{
        width: 380,
        height: 244,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
  });

export default BadgerNewsArticle;