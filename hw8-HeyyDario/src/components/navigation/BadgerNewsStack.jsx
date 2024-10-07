import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BadgerNewsScreen from '../screens/BadgerNewsScreen';
import BadgerNewsArticle from '../screens/BadgerNewsArticle.jsx';

const NewsStack = createNativeStackNavigator();

function BadgerNewsStack() {
  return (
      <NewsStack.Navigator>
        <NewsStack.Screen 
          name="BadgerNewsScreen" 
          component={BadgerNewsScreen} 
          options={{
            headerTitle: "Articles",
            }}/>
        <NewsStack.Screen 
          name="BadgerNewsArticle" 
          component={BadgerNewsArticle} 
          options={{
            headerTitle: "Article", 
            headerBackTitle: "", 
                }}/>
      </NewsStack.Navigator>
  );
}

export default BadgerNewsStack;