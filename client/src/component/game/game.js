import React from "react";

import { GAME_STATE, CARD_STATE, CARDFLIP_RESULT } from '../../constants';
import "./game.css";


class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [],
            game: {
                id: "",
                errorScore: "",
                createDate: null,
                state: null,
                completeDate: null
            },
            elapsedTime: "",
            isDisableInput: false
        }; 
        this.clickedCard = this.clickedCard.bind(this);   
        this.getElapsedTime = this.getElapsedTime.bind(this); 
        this.setCardsState = this.setCardsState.bind(this); 
        this.clickedBack = this.clickedBack.bind(this);
    }

    async componentDidMount() {
        // load data from param
        const { match: { params } } = this.props;
        let response = await fetch("/api/game/" + params["id"]);
        let responseJson = await response.json();
        if (responseJson["status"] == null || responseJson["status"] !== "success") {
            console.log("Game with id not found");
            this.setState({
                game: { ...this.state.game, state: GAME_STATE.NOT_FOUND}
            });
            return;
        }
        console.log(responseJson);

        let game = responseJson["game"];
        let cards = responseJson["cards"];
        
        this.setState({
            cards: cards,
            game: {
                id: game["id"],
                errorScore: game["error_score"],
                createDate: game["create_date"],
                state: game["state"],
                completeDate: game["complete_date"] // might be null
            }
        });
        // this update elapsed continuisly
        this.intervalId = setInterval(this.getElapsedTime, 1000);
    }
    
    componentWillUnmount() {
        clearInterval(this.intervalId);
        clearInterval(this.timeoutId);
    }

    // server time is utc
    // set elapsed time as string
    // to either current-createDate or completeDate-createDate
    getElapsedTime() {
        if (this.state.game.createDate == null) {
            return;
        }
        
        let startTime = new Date(this.state.game.createDate+"Z");
        let endTime = new Date();
        if (this.state.game.completeDate != null) {
            endTime = new Date(this.state.game.completeDate+"Z");
            clearInterval(this.intervalId);
        }

        let millisecDiff = endTime.getTime() - startTime.getTime();

        this.setState({
            elapsedTime: this.millisecToHHMMSS(millisecDiff)
        });
    }

    millisecToHHMMSS(millisec) {
        let result = Math.floor(millisec/(1000*60*60)) + "h:" + 
            Math.floor(millisec/(1000*60))%60 + "m:" + 
            Math.floor(millisec/1000)%60 + "s";

        return result;
    }

    async clickedCard(selectedCard, i) {
        if (selectedCard.state !== CARD_STATE.HIDDEN || this.state.isDisableInput) {
            return;
        }

        let response = await fetch("/api/flip/card/" + selectedCard.position + 
            "/game/" + this.state.game.id);
        let responseJson = await response.json();
        if (responseJson["status"] == null || responseJson["status"] !== "success") {
            return;
        }
        console.log(responseJson);

        // card - current card flipped
        // game - game info
        // result - result of the current cardflip action
        let card = responseJson["card"];
        let game = responseJson["game"];
        let cardPosition = parseInt(card["position"]);        
        let actionResult = responseJson["result"];

        let shouldDisableInput = false;
        let cards = JSON.parse(JSON.stringify(this.state.cards));
        cards[cardPosition] = {
            ...cards[cardPosition],
            value: card.value,
            state: CARD_STATE.REVEALED
        };
        // current card flip leads to a mismatch
        if (actionResult === CARDFLIP_RESULT.INCORRECT) {
            shouldDisableInput = true;
            // flip cards with REVEALED state into a temporary INCORRECT state            
            let revealedCardsPosition = [];
            let count = 0;
            for (const i of cards) {
                if (i.state === CARD_STATE.REVEALED) {
                    i.state = CARD_STATE.INCORRECT;
                    revealedCardsPosition.push(count);
                }
                count += 1;
            }
            // they will be reverted to hidden in 5 seconds
            this.timeoutId = setTimeout(()=>this.setCardsState(revealedCardsPosition, CARD_STATE.HIDDEN), 5000);            
        }
        // current card flip leads to a match
        if (actionResult === CARDFLIP_RESULT.CORRECT) {
            shouldDisableInput = true;
            // flip cards with REVEALED state into a temporary CORRECT state            
            let revealedCardsPosition = [];
            let count = 0;
            for (const i of cards) {
                if (i.state === CARD_STATE.REVEALED) {
                    i.state = CARD_STATE.CORRECT;
                    revealedCardsPosition.push(count);
                }
                count += 1;
            }
            // they will be turned to MATCHED in 1 seconds
            this.timeoutId = setTimeout(()=>this.setCardsState(revealedCardsPosition, CARD_STATE.MATCHED), 1000);            
        }

        this.setState({
            cards: cards,
            game: {
                id: game["id"],
                errorScore: game["error_score"],
                createDate: game["create_date"],
                state: game["state"],
                completeDate: game["complete_date"] // might be null
            },
            isDisableInput: shouldDisableInput
        });
    }

    setCardsState(positions, state) {
        let cards = JSON.parse(JSON.stringify(this.state.cards));
        for (const position of positions) {
            cards[position] = {
                ...cards[position],
                value: null,
                state: state
            };
        }
        this.setState({
            cards: cards,
            isDisableInput: false
        });
    }

    clickedBack() {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="main-content row">
                <div className="card col-md-8">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 ta-center">
                                Elapsed Time: { this.state.elapsedTime }
                            </div>
                            <div className="col-md-4 ta-center">
                                Game ID: { this.state.game.id }
                            </div>
                            <div className="col-md-4 ta-center">
                                Error Score: { this.state.game.errorScore }
                            </div>
                        </div>
                        <div className="highlight-line"></div>
                        {this.state.game.state === GAME_STATE.NOT_FOUND &&
                            <p className="game-not-found">
                                GAME NOT FOUND
                            </p>
                        }
                        {this.state.game.state === GAME_STATE.COMPLETED &&
                            <div>
                                <p className="game-completed">
                                    GAME COMPLETED
                                </p>
                                <div className="row">
                                    <button type="button" className="btn btn-primary back-button"
                                        onClick={this.clickedBack}>
                                            Back
                                    </button>  
                                </div>
                            </div>
                        }
                        {this.state.game.state === GAME_STATE.IN_PROGRESS &&
                            <div className="row">
                                {
                                    this.state.cards.map((card, i) => (
                                        <div className={"game-card " + 
                                                (card.state === CARD_STATE.MATCHED ? "matched":"") + 
                                                (card.state === CARD_STATE.CORRECT ? "correct":"") +
                                                (card.state === CARD_STATE.INCORRECT ? "incorrect":"")} 
                                                onClick={() => this.clickedCard(card, i)} key={i}>
                                            { card.value }
                                        </div>
                                    ))
                                }
                            </div>
                        }                        
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;