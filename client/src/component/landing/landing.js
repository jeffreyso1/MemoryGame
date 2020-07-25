import React from "react";

import { DIFFICULTY } from "../../constants";
import "./landing.css";

class Landing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameId: "",
            gamescores: []
        };   
        this.clickedGameDifficulty = this.clickedGameDifficulty.bind(this);
        this.handleChange = this.handleChange.bind(this);   
        this.clickedRestore = this.clickedRestore.bind(this);  
    }

    async componentDidMount() {
        // fetch last 10 scores
        let response = await fetch("/api/game-scores");
        let responseJson = await response.json();
        if (responseJson["status"] == null || responseJson["status"] !== "success") {
            return;
        }
        this.setState({
            gamescores: responseJson["scores"]
        });
    }

    async clickedGameDifficulty(difficulty) {
        let response = await fetch("/api/create-game", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "difficulty": difficulty })
        });
        let responseJson = await response.json();
        console.log(responseJson);
        if (responseJson["status"] == null || responseJson["status"] !== "success") {
            return;
        }

        let gameId = responseJson["gameId"];
        this.props.history.push("/game/" + gameId);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    clickedRestore() {
        if (this.state.gameId.length === 0) {
            return;
        } 
        this.props.history.push("/game/" + this.state.gameId);
    }

    render() {
        return (
            <div className="main-content row">
                <div className="card col-md-6">
                    <div className="card-body">
                        
                        <h5 className="card-title">Memory Game</h5>
                        <p className="card-text">Please select game difficulty:</p>
                        <div className="select-difficulty">
                            <button type="button" className="btn btn-primary" 
                                onClick={() => this.clickedGameDifficulty(DIFFICULTY.EASY)}>Easy</button>
                            <button type="button" className="btn btn-primary"
                                onClick={() => this.clickedGameDifficulty(DIFFICULTY.MEDIUM)}>Medium</button>
                            <button type="button" className="btn btn-primary"
                                onClick={() => this.clickedGameDifficulty(DIFFICULTY.HARD)}>Hard</button>
                        </div>
                        <div className="highlight-line"></div>
                        <div className="form-group">
                            <label htmlFor="gameId">Restore Game:</label>
                            <input type="text" className="form-control mb-2" name="gameId"
                                onChange={this.handleChange} />
                            <button type="button" className="btn btn-primary"
                                onClick={this.clickedRestore}>Restore</button>                                
                        </div>
                        {/* <div className="highlight-line"></div> */}
                        <h5 className="card-title">Last 10 Scores:</h5>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Errors</th>
                                        <th>Difficulty</th>                                            
                                        <th>Complete Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.gamescores.map((score, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{ score["error_score"] }</td>
                                                    <td>{ score["difficulty_setting"] }</td>
                                                    <td>{ new Date(score["complete_date"]+"Z").toLocaleString() }</td>
                                                </tr>
                                            );
                                        })
                                    }                                    
                                </tbody>
                            </table>
                        </div>
                        
                    </div>    
                </div>
            </div>
        );
    }
}

export default Landing;