import React, { Component } from 'react'
import { TextInput, Button, Text } from 'react-native';
import { Container, Row, Col, Form, ListGroup } from 'react-bootstrap';
import APIKit from './shared/APIKit';

export default class SubmitScore extends Component{
    state = {
        name: '',
        teams: [],
        teamOnePlayerArr: [],
        teamTwoPlayerArr: [],
        matchId:null,
        teamOneScores: [],
        teamTwoScores: [],
        teamOneWickets: 0,
        teamTwoWickets: 0
    }
    componentDidMount(){
        this.getAllTeams();
    }
    getAllTeams(){
        APIKit.get("teams").then((response)=>{
            // this.state.names = response.data;
            this.setState({teams: response.data.data,isLoading: false})
            
        }).catch((error)=>{
            console.log(error);
            this.setState({isLoading: false})
        })
    }
    getTeamPlayerList(event, type){
        APIKit.get("team/"+event.target.value).then((response)=>{
            // this.state.names = response.data;
            if(type == 1){
                this.setState({teamOnePlayerArr: response.data.data})
            } else {
                this.setState({teamTwoPlayerArr: response.data.data})
            }
        }).catch((error)=>{
            console.log(error);
            this.setState({isLoading: false})
        })
    }
    addScoresToPlayers(){
        var team1SelectID = this.state.teamOnePlayerArr.length && this.state.teamOnePlayerArr[0].teamId;
        var team2SelectID = this.state.teamTwoPlayerArr.length && this.state.teamTwoPlayerArr[0].teamId;
        var team1Det = this.state.teams.filter(function(val){
            return val._id == team1SelectID;
        });
        var team2Det = this.state.teams.filter(function(val){
            return val._id == team2SelectID;
        });
        var team1Scores = this.state.teamOneScores.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        var team2Scores = this.state.teamTwoScores.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        var data = {match_name:this.state.name,team_1:[{name: team1Det[0].name, totalScores: team1Scores,totalWickets: this.state.teamOneWickets}], team_2:[{name: team2Det[0].name, totalScores: team2Scores, totalWickets: this.state.teamTwoWickets}]}    

        APIKit.post("submit-scores",data).then((response)=>{
            var id = response.data.id;
            this.setState({matchId: id})
        }).catch((error)=>{
            console.log(error)
        });
      }
    render() {
        return (
            <Container fluid style={{padding: 10}}>
                {this.state.matchId &&
                    <Row>
                        <Col>
                        <Text style={{color: 'blue'}}
                            onPress={() => this.props.navigation.navigate('ViewScore',{ id: this.state.matchId })}>
                            View Score board
                        </Text>
                        </Col>
                    </Row>
                }
                <Form>
                    <Row>
                        <Col>
                            <Form.Control placeholder="Match name" value={this.state.name} onChange={(event)=>this.setState({name:event.target.value})}/>
                        </Col>
                        <Col>
                        
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Team 1</Form.Label>
                                <Form.Control as="select" onChange={(val)=> this.getTeamPlayerList(val, 1)}>
                                    {
                                        this.state.teams.map((item, index) => (
                                            <option key={item._id} name={item._id} value={item._id}>{item.name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <Form.Label>Team 2</Form.Label>
                                <Form.Control as="select" onChange={(val)=> this.getTeamPlayerList(val, 2)}>
                                    {
                                        this.state.teams.map((item, index) => (
                                            <option key={item._id} name={item._id} value={item._id}>{item.name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        {
                            this.state.teamOnePlayerArr.length && 
                            <ListGroup>
                                {this.state.teamOnePlayerArr.map((item, index) => (
                                        <ListGroup.Item>
                                            {item.playerName} 
                                            <TextInput key={index} placeholder="Enter Score" keyboardType="numeric" style={{float: 'right'}} onChangeText={(val)=> this.state.teamOneScores.push(val)}/>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        } 
                        </Col>
                        <Col>
                            {
                                this.state.teamTwoPlayerArr.length && 
                                <ListGroup>
                                    {this.state.teamTwoPlayerArr.map((item, index) => (
                                            <ListGroup.Item>
                                            {item.playerName} 
                                            <TextInput key={index} placeholder="Enter Score" keyboardType="numeric" style={{float: 'right'}} onChangeText={(val)=> this.state.teamTwoScores.push(val)}/>
                                            </ListGroup.Item>
                                        ))
                                    }
                                </ListGroup>
                            }       
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TextInput placeholder="Enter wickets" value={this.state.teamOneWickets} onChangeText={(val)=> this.setState({teamOneWickets: val})}/>
                        </Col>
                        <Col>
                            <TextInput placeholder="Enter wickets" value={this.state.teamTwoWickets} onChangeText={(val)=> this.setState({teamTwoWickets: val})}/>
                        </Col>
                    </Row>
                    <Row>
                            <Button title="Submit Score" onPress={()=>this.addScoresToPlayers()}/>
                    </Row>
                </Form>
            </Container>
        )
    }
}
