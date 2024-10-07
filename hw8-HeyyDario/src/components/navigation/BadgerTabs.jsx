import { useMemo } from 'react';
import { Text } from "react-native";

import NewsScreen from '../screens/BadgerNewsScreen';
import PreferencesScreen from '../screens/BadgerPreferencesScreen';
import BadgerNewsStack from './BadgerNewsStack'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


function BadgerTabs() {
    // const BadgerTabs = createBottomTabNavigator();
    // recommend using a BottomTabNavigator
    const bottomTab = createBottomTabNavigator();

    return (
        <bottomTab.Navigator>
            <bottomTab.Screen name="News" component={BadgerNewsStack} options={{headerShown: false}}/>
            <bottomTab.Screen name="Preferences" component={PreferencesScreen}/>
        </bottomTab.Navigator>
    );
}

export default BadgerTabs;