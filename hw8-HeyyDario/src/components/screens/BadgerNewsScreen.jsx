import React, { useEffect, useState, useContext } from 'react';
import { Text, View, ScrollView, Alert } from 'react-native';
import BadgerNewsItemCard from './BadgerNewsItemCard';
import CS571 from '@cs571/mobile-client';

import PreferencesContext from "../../contexts/PreferencesContext";

function BadgerNewsScreen(props) {
    const [articles, setArticles] = useState([]);
    const [prefs, setPrefs] = useContext(PreferencesContext);

    useEffect(() => {
      fetch('https://cs571.org/api/s24/hw8/articles', {
        headers:{
          'X-CS571-ID': CS571.getBadgerId()
        }
      })
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        setArticles(data);
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
        //init pref because we need prefs so that filtered articles would display
        const initPrefs = {};
              sepTags.forEach((tag) => {
                  initPrefs[tag] = true;
              });
        setPrefs(initPrefs);
      })
      .catch(err => console.error('Cannot fetch articles', err));
    }, []);

    // Filter articles based on preferences
    const filteredArticles = articles.filter(article =>
        article.tags.every(tag => prefs[tag] === true)
    );
    //console.log(prefs);

    return <ScrollView>
        {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
                <BadgerNewsItemCard 
                    key={article.id} 
                    article={article}>
                </BadgerNewsItemCard>
            ))
        ) : (
            <Text>There is no such article that satisfy all your preferences.</Text>
        )}
    </ScrollView>
}

export default BadgerNewsScreen;