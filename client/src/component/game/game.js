import React from "react";

import "./game.css";

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [
                // { position: 0, value: 1, status: "NOT_CLEARED"},
                { position: 0, status: "NOT_CLEARED"},
                { position: 1, status: "NOT_CLEARED"},
                { position: 2, status: "NOT_CLEARED"},
                { position: 3, status: "NOT_CLEARED"},
                { position: 4, status: "NOT_CLEARED"},
                { position: 5, status: "NOT_CLEARED"},
                { position: 6, status: "NOT_CLEARED"},
                { position: 7, status: "NOT_CLEARED"},
                { position: 8, status: "NOT_CLEARED"},
                { position: 9, status: "CLEARED"},
                { position: 10, status: "NOT_CLEARED"},
                { position: 11, status: "NOT_CLEARED"},
                { position: 12, status: "NOT_CLEARED"},
                { position: 13, status: "NOT_CLEARED"},
                { position: 14, status: "NOT_CLEARED"},
                { position: 15, status: "NOT_CLEARED"}
            ]
            
        }; 
        this.clickedCard = this.clickedCard.bind(this);       
    }

    clickedCard(card, i) {
        if (card.status === "CLEARED") {
            return;
        }
        console.log(i);
        console.log(card);
        // make request
        let value = 2;
        this.setState(({cards}) => ({
            cards: [
                ...cards.slice(0,i),
                {
                    ...cards[i],
                    value: value,
                },
                ...cards.slice(i+1)
            ]
        }));
    }

    render() {
        return (
            <div className="main-content row">
                <div className="card col-md-8">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 ta-center">
                                Elapsed Time: 12h 22m 33s
                            </div>
                            <div className="col-md-4 ta-center">
                                Game ID: 12
                            </div>
                            <div className="col-md-4 ta-center">
                                Error Score: 10
                            </div>
                        </div>
                        <div className="highlight-line"></div>
                        <div className="row">
                            {
                                this.state.cards.map((card, i) => (
                                    <div className={"game-card " + (card.status === "CLEARED" ? "cleared":"")} 
                                            onClick={() => this.clickedCard(card, i)} key={i}>
                                        {/* 1 */}
                                        { card.value }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;