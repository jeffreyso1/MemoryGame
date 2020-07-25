const PromiseRouter = require("express-promise-router");
const router = new PromiseRouter();

const inputValidate = require("../utility/inputValidate");
const responseFormatter = require("../utility/responseFormatter");
const constants = require("../utility/constants");

const gameService = require("../database/gameService");

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

router.post("/create-game", async function(req, res, next) {
    let response = {};
    try {
        let inputJson = req.body;
        let difficultySetting = inputJson["difficulty"];

        if (difficultySetting == null || 
                constants.DIFFICULTY[difficultySetting] == null) {
            res.status(200).send(responseFormatter.errorIncorrectParam(response, 
                "Difficulty setting incorrect"));
            return;
        }

        // "EASY": 3 sets of cards, 6 total
        // "MEDIUM": 5 sets of cards, 10 total
        // "HARD": 13 sets of cards, 26 total
        let numSetsOfCard = constants.DIFFICULTY[difficultySetting];
        let cardsToAdd = [];
        for (let count = 0; count < numSetsOfCard; count++) {
            cardsToAdd.push({ value: count+1 }); // value is the content of each card
            cardsToAdd.push({ value: count+1 });
        }
        shuffle(cardsToAdd);

        let gameId = await gameService.addNewGame(difficultySetting, cardsToAdd);
        if (gameId === null) {
            res.status(200).send(responseFormatter.errorInternalError(response));
            return;
        }

        response["gameId"] = gameId;
        res.status(200).send(responseFormatter.success(response));   
    } catch(error) {
        res.status(200).send(responseFormatter.errorInternalError(response));
    } 
});

router.get('/game/:id', async function(req, res, next) {
    let response = {};
    try {
        let params = req.params;
        let gameId = params["id"];

        if (!inputValidate.isPositiveInteger(gameId)) {
            res.status(200).send(responseFormatter.errorIncorrectParam(response, 
                "gameId has to be a positive integer."));
            return;
        }
        gameId = parseInt(gameId);

        let game = await gameService.getGameById(gameId);
        if (game === null) {
            res.status(200).send(responseFormatter.errorRecordNotFound(response));
            return;
        }
        let gameCards = await gameService.getCardsByGameId(game.id);
        // take out the value of the card before we send
        let gameCardsFiltered = gameCards.map(card => ({ 
            position: card.position,
            value: card.state === constants.CARD_STATE.REVEALED ? card.content_value : null,
            state: card.state
        }));

        response["game"] = game;
        response["cards"] = gameCardsFiltered;

        res.status(200).send(responseFormatter.success(response));
    } catch(error) {
        console.log(error);
        res.status(200).send(responseFormatter.errorInternalError(response));
    } 
});

router.get("/game-scores", async function(req, res, next) {
    let response = {};
    try {
        let gameScores10 = await gameService.getGameScores();
        response["scores"] = gameScores10;
        res.status(200).send(responseFormatter.success(response));
    } catch(error) {
        console.log(error);
        res.status(200).send(responseFormatter.errorInternalError(response));
    } 
});

// returns state of current game
// returns flipped card info
// returns result of the current action (REVEALED1, CORRECT, INCORRECT)
router.get("/flip/card/:position/game/:id", async function(req, res, next) {
    let response = {};
    try {
        // input checking
        let params = req.params;
        let position = params["position"];
        let gameId = params["id"];

        if (!inputValidate.isPositiveInteger(position)) {
            res.status(200).send(responseFormatter.errorIncorrectParam(response, 
                "position has to be a positive integer."));
            return;
        }
        if (!inputValidate.isPositiveInteger(gameId)) {
            res.status(200).send(responseFormatter.errorIncorrectParam(response, 
                "gameId has to be a positive integer."));
            return;
        }
        position = parseInt(position);
        gameId = parseInt(gameId);
        //

        // game should exist and must not be completed
        let game = await gameService.getGameById(gameId);
        if (game === null) {
            res.status(200).send(responseFormatter.errorRecordNotFound(response));
            return;
        }
        if (game.state === constants.GAME_STATE.COMPLETED) {
            res.status(200).send(responseFormatter.errorGameAlreadyCompleted(response));
            return;
        }
        //

        // although unlikely
        // send error if we revealed more than 2 cards
        let revealedCards = await gameService.getCardsByGameIdState(gameId, 
            constants.CARD_STATE.REVEALED);
        if (revealedCards.length >= 2) {
            res.status(200).send(responseFormatter.errorMaxCardsRevealed(response));
            return;
        }

        // card position must exist in this game 
        // and cannot already be matched
        let currentCard = await gameService.getCardsByGameIdPosition(gameId, position);
        if (currentCard === null) {
            res.status(200).send(responseFormatter.errorCardNotFound(response));
            return;
        }    
        if (currentCard.state === constants.CARD_STATE.MATCHED) {
            res.status(200).send(responseFormatter.errorCardAlreadyMatched(response));
            return;
        }

        // if we revealed no card previously
        // send the info of this card and 
        // we are done
        if (revealedCards.length === 0) {
            await gameService.setCardStateById(constants.CARD_STATE.REVEALED, 
                currentCard.id);
            response["result"] = constants.CARDFLIP_RESULT.REVEALED_1;
        }

        // if we revealed 1 card previously
        if (revealedCards.length === 1) {
            // cannot be the same card as before
            let previousCard = revealedCards[0];
            if (previousCard.id === currentCard.id) {
                res.status(200).send(responseFormatter.errorCardAlreadyRevealed(response));
                return;
            }

            // if value matches (and it is not the same card)
            if (previousCard.content_value === currentCard.content_value) {
                // set cards to MATCHED
                await gameService.setCardsStateByIds(constants.CARD_STATE.MATCHED, 
                    previousCard.id, currentCard.id);

                // check if there is no more hidden cards
                // if yes, we won
                let hiddenCards = await gameService.getCardsByGameIdState(gameId,
                    constants.CARD_STATE.HIDDEN);
                if (hiddenCards.length === 0) {
                    await gameService.setGameComplete(gameId);
                }
                response["result"] = constants.CARDFLIP_RESULT.CORRECT;
            } else { // value does not match
                // set cards back to hidden
                await gameService.setCardsStateByIds(constants.CARD_STATE.HIDDEN, 
                    previousCard.id, currentCard.id);
                // increment score by one
                await gameService.setGameIncrementErrorScore(gameId);
                response["result"] = constants.CARDFLIP_RESULT.INCORRECT;
            }
        }

        game = await gameService.getGameById(gameId);
        response["game"] = game;
        response["card"] = {
            value: currentCard.content_value,
            position: currentCard.position
        };

        res.status(200).send(responseFormatter.success(response));
    } catch(error) {
        console.log(error);
        res.status(200).send(responseFormatter.errorInternalError(response));
    } 
});

module.exports = router;
