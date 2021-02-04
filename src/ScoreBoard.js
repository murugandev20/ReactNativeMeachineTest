import React, { Component } from 'react'
import { Button } from 'react-native';
import { Container, Card } from 'react-bootstrap';
import APIKit from './shared/APIKit';

export default class ScoreBoard extends Component{
        state = {
            matchData: []
        }
        componentDidMount(){
            this.getMatchData();
        }
        getMatchData(){
            var id = this.props.route.params?.id;
            APIKit.get("match-scores/"+id).then((response)=>{
                // this.state.names = response.data;
                console.log(response.data.data);
                this.setState({matchData: response.data.data,isLoading: false})
                
            }).catch((error)=>{
                console.log(error);
                this.setState({isLoading: false})
            })
        }
        render() {
            return (
            <Container fluid>
                { this.state.matchData.length &&  
                    <Card className="text-center">
                    <Card.Header>{this.state.matchData[0].match_name}</Card.Header>
                    <Card.Body>
                        <Card.Title>{this.state.matchData[0].team_1[0].name}</Card.Title>
                        <Card.Text>
                        {this.state.matchData[0].team_1[0].totalScores+'/'+this.state.matchData[0].team_1[0].totalWickets}
                        </Card.Text>
                        <Card.Title>{this.state.matchData[0].team_2[0].name}</Card.Title>
                        <Card.Text>
                        {this.state.matchData[0].team_2[0].totalScores+'/'+this.state.matchData[0].team_2[0].totalWickets}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">2 days ago</Card.Footer>
                    </Card>                
                }
            </Container>
        )
    }
}
