import { Text, View, ScrollView, Switch } from "react-native";
import React, { useEffect, useState, useContext } from 'react';
import CS571 from '@cs571/mobile-client';

import PreferencesContext from "../../contexts/PreferencesContext";


function BadgerPreferencesScreen(props) {

    const [tags, setTags] = useState([]);
    const [prefs, setPrefs] = useContext(PreferencesContext);// {tag1: true, tag2:true, ...}

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw8/articles', {
          headers:{
            'X-CS571-ID': CS571.getBadgerId()
          }
        })
        .then(res => res.json())
        .then(data => {
          //console.log(data);
          //get all tags into an array, but found duplicates!
          const dupTags = data.reduce((arr, article) => {
            arr.push(...article.tags);
            return arr;
          },[])
          //get separate tag
          const sepTags = dupTags.reduce((arr, tag) => {
            if(!arr.includes(tag)){
                arr.push(tag);
            }
            return arr;
          }, []);
          setTags(sepTags);
          const initPrefs = {};
                sepTags.forEach((tag) => {
                    initPrefs[tag] = true;
                });
          setPrefs(initPrefs);
        })
        .catch(err => console.error('Cannot fetch article', err));
      }, []);

      const toggleSwitch = (tag) => {
        setPrefs((prevPref) => ({
            ...prevPref,
            [tag]: !prevPref[tag],
        }));
        //console.log(prefs);
    }
      

    return ( // from https://reactnative.dev/docs/switch
        <ScrollView>
            {tags.map((tag) => (
                <View key={tag}>
                    <Text>Currently {(prefs[tag] !== false) ? '' : 'NOT'} showing {tag} articles.</Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={(prefs[tag] !== false) ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"                        
                        value={prefs[tag] !== false}
                        onValueChange={() => toggleSwitch(tag)}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

export default BadgerPreferencesScreen;