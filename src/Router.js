import React, {Component} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home'
import TeamsCreate from './CreateTeams'
import ScoreBoard from './ScoreBoard'
import SubmitScore from './AddMatchScore'

const Stack = createStackNavigator();

const config = {
   screens: {
      Home: 'home',
      CreateTeam: 'teams',
      SubmitScore: 'add-score',
      ViewScore: 'score-board/:id'
   },
 };
 
 const linking = {
   prefixes: ['http://mychat.com', 'mychat://'],
   config,
 };

export default class Router extends Component{
   render() {
      return (
         <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
            <Stack.Navigator>
            <Stack.Screen
               name="Home"
               component={Home}
               options={{ title: 'Welcome' }}
            />
            <Stack.Screen name="CreateTeam" options={{ title: 'Create Team' }} component={TeamsCreate} />
            <Stack.Screen name="SubmitScore" options={{ title: 'Add Score' }} component={SubmitScore} />
            <Stack.Screen name="ViewScore" options={{ title: 'Score Board' }} component={ScoreBoard} />
            </Stack.Navigator>
         </NavigationContainer>
      );
   }
}
