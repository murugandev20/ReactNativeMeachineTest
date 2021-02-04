import React, {Component} from 'react'
import { Button, View, StyleSheet } from 'react-native';

export default class Home extends Component{
   render() {
      return (
         <View style={styles.container}>
            <View style={styles.buttonContainer}>
               <Button title="Create Teams" onPress={() => this.props.navigation.navigate('CreateTeam')}/>
            </View>
            <View style={styles.buttonContainer}>
               <Button title="Add match scores" onPress={() => this.props.navigation.navigate('SubmitScore')}/>
            </View>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
   },
   buttonContainer: {
     flex: 1,
     padding: 10
   }
 });