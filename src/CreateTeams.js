import React, {Component} from 'react'
import { TouchableOpacity, View, StyleSheet, TextInput, Text, Button } from 'react-native';
import APIKit from './shared/APIKit';
import { Form } from 'react-bootstrap';

export default class TeamsCreate extends Component{
    state = {
        teamOneName: '',
        teamTwoName: '',
        names:[],
        teamOneId: null,
        teamTwoId: null,
        teamOnePlayerArr: [],
        teamTwoPlayerArr: [],
        isLoading: false,
        count: 0,
        teamOneAddCompleted: false,
        teamTwoAddCompleted: false
    }
    componentDidMount(){
        this.getAllPlayers();
    }
    getAllPlayers(){
        this.setState({isLoading: true})
        APIKit.get("players").then((response)=>{
            // this.state.names = response.data;
            this.setState({names: response.data.data,isLoading: false})
            console.log(this.state.names);
            
        }).catch((error)=>{
            console.log(error);
            this.setState({isLoading: false})
        })
    }
    addPlayerToList(tType,player){
        console.log(player,this.state.teamOnePlayerArr);
        if( tType == 1 ){
            var existTeam2 = this.state.teamTwoPlayerArr.filter(function(val){
              return player._id == val._id;
            })
            if( existTeam2.length > 0 ){
              alert("This player already selected team 2");
              return;
            }
            var existTeam = this.state.teamOnePlayerArr.filter(function(val){
              return player._id == val._id;
            })
            if( existTeam.length > 0 ){
              this.findAndRemoveSelectionInArray(this.state.teamOnePlayerArr,player._id);
              return;
            }
            if( this.state.teamOnePlayerArr.length+1 > 11){
              alert("You have select only 11 players at the team")
            } else {
              this.state.teamOnePlayerArr.push(player);
              this.setState({count:this.state.count++});
            }
          } else {
            var existTeam1 = this.state.teamOnePlayerArr.filter(function(val){
              return player._id == val._id;
            })
            if( existTeam1.length > 0 ){
              alert("This player already selected team 1");
              return;
            }
            var existTeam = this.state.teamTwoPlayerArr.filter(function(val){
              return player._id == val._id;
            })
            if( existTeam.length > 0 ){
              this.findAndRemoveSelectionInArray(this.state.teamTwoPlayerArr,player._id);
              return;
            }
            if( this.state.teamTwoPlayerArr.length+1 > 11){
              alert("You have select only 11 players at the team")
            } else {
              this.state.teamTwoPlayerArr.push(player);
              this.setState({count:this.state.count++});
            }
            
          }
    }
    findAndRemoveSelectionInArray(list, id){
        for (var i = list.length - 1; i >= 0; --i) {
            if (list[i]._id == id) {
                list.splice(i, 1);
            }
        }
    }
    createTeam(name,type){
        var data = {
            name: name
        }
        this.setState({isLoading: true})
        APIKit.post("create-team",data).then((response)=>{
            var id = response.data.id;
            if( type == 1){
                this.setState({teamOneId: id, isLoading: false});
            } else {
                this.setState({teamTwoId: id, isLoading: false});
            }

            this.getAllPlayers()
        }).catch((error)=>{
            console.log(error)
            this.setState({isLoading: false})
        });
    }
    isSelectedPlayer(id, type){
        if(type == 1){
          var existPlayer = this.state.teamOnePlayerArr.filter(function(val){
            return val._id == id;
          });
          return existPlayer.length > 0 ? {
            padding: 10,
            marginTop: 3,
            backgroundColor: '#000',
            color: '#fff',
            alignItems: 'center',
         } : {
            padding: 10,
            marginTop: 3,
            backgroundColor: '#d9f9b1',
            alignItems: 'center',
         };
        } else {
          var existPlayer = this.state.teamTwoPlayerArr.filter(function(val){
            return val._id == id;
          });
          return existPlayer.length > 0 ? {
            padding: 10,
            marginTop: 3,
            backgroundColor: '#000',
            color: '#fff',
            alignItems: 'center',
         } : {
            padding: 10,
            marginTop: 3,
            backgroundColor: '#d9f9b1',
            alignItems: 'center',
         };
        }
      }
      addPlayers2Team(id, playerList, type){
        var data = [];
        playerList.map(function(val){
          data.push({
            teamId: id,
            playerId: val._id,
            playerName: val.name
          });
        });
        APIKit.post("add-players",data).then((response)=>{
            if( type == 1){
                this.setState({teamOneAddCompleted: true});
            } else {
                this.setState({teamTwoAddCompleted: true});
            }
            if( this.state.teamOneAddCompleted && this.state.teamTwoAddCompleted ){
                this.props.navigation.navigate('Home');
            }
        }).catch((error)=>{
            console.log(error);
        });
      }
    render() {
        const {isLoading} = this.state;
        return (
        <View style={styles.container}>
            {isLoading && <Text>Loading...</Text>}
            <View style={styles.buttonContainer}>
                <View>
                    <Form.Control placeholder="Team name" value={this.state.teamOneName} onChange={(event)=>this.setState({teamOneName:event.target.value})}/>
                    <Button title="Create Team" onPress={() => this.createTeam(this.state.teamOneName,1)}/>
                </View>
                <View>
                    { this.state.teamOneId &&
                        this.state.names.map((item, index) => (
                            <TouchableOpacity
                                key = {item._id}
                                style={this.isSelectedPlayer(item._id,1)}
                                onPress = {() => this.addPlayerToList(1,item)}>
                                <Text style = {styles.text}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                    { this.state.teamOneId && <Button title="Add Players" onPress={() => this.addPlayers2Team(this.state.teamOneId,this.state.teamOnePlayerArr,1)}/>}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <View>
                    <Form.Control placeholder="Team name" value={this.state.teamTwoName} onChange={(event)=>this.setState({teamTwoName:event.target.value})}/>
                    <Button title="Create Team" onPress={() => this.createTeam(this.state.teamTwoName,2)}/>
                </View>
                <View>
                    { this.state.teamTwoId &&
                        this.state.names.map((item, index) => (
                            <TouchableOpacity
                                key = {item.id}
                                style = {this.isSelectedPlayer(item._id,2)}
                                onPress = {() => this.addPlayerToList(2,item)}>
                                <Text style = {styles.text}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                    { this.state.teamTwoId && <Button title="Add Players" onPress={() => this.addPlayers2Team(this.state.teamTwoId,this.state.teamTwoPlayerArr,2)}/>}
                </View>
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
    },
    listContainer: {
        padding: 10,
        marginTop: 3,
        backgroundColor: '#d9f9b1',
        alignItems: 'center',
     },
     selectListContainer: {
        padding: 10,
        marginTop: 3,
        backgroundColor: '#000',
        color: '#fff',
        alignItems: 'center',
     },
     text: {
        color: '#4f603c'
     }
  });