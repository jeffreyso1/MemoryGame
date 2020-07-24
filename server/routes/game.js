const PromiseRouter = require("express-promise-router");
const router = new PromiseRouter();
const cors = require('cors');

const gameService = require("../model/database").gameService;
const inputValidate = require("../utility/inputValidate");
const responseFormatter = require("../utility/responseFormatter");
const constants = require("../utility/constants");

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
    let inputJson = req.body;
    let difficultySetting = inputJson["difficulty"];

    let response = {};
    if (difficultySetting == null || 
            constants.diffcultySetting[difficultySetting] == null) {
        res.status(200).send(responseFormatter.errorIncorrectParam(response, 
            "Difficulty setting incorrect"));
        return;
    }

    // "EASY": 3 sets of cards, 6 total
    // "MEDIUM": 5 sets of cards, 10 total
    // "HARD": 13 sets of cards, 26 total
    let numSetsOfCard = constants.diffcultySetting[difficultySetting];
    let cardsToAdd = [];
    for (let count = 0; count < numSetsOfCard; count++) {
        cardsToAdd.push({ value: count+1 }); // value is the content of each card
        cardsToAdd.push({ value: count+1 });
    }
    shuffle(cardsToAdd);

    let gameId = await gameService.addNewGame(difficultySetting, cardsToAdd);
    console.log("a"+gameId);
    if (!gameId) {
        res.status(200).send(responseFormatter.errorInternalError(response));
        return;
    }

    let gameCards = await gameService.getCardsByGameId(gameId);
    // take out the value of the card before we send
    let gameCardsFiltered = gameCards.map(card => ({ 
        position: card.position,
        state: card.state
    }));

    response["gameId"] = gameId;
    response["cards"] = gameCardsFiltered;
    res.status(200).send(responseFormatter.success(response));    
});

router.get("/search", cors(), async function(req, res, next) {
    let response = {};

    if (inputValidate.isWhitespaceOrNull(req.query["startWith"])) {
        res.status(200).send(responseFormatter.errorIncorrectParam(response, 
            "startWith is invalid"));
        return;
    }

    let stocks = await stockService.searchStock(req.query["startWith"]);
    response["stocks"] = stocks;
    res.status(200).send(responseFormatter.success(response));
});

router.get("/last-update-date", cors(), async function(req, res, next) {
    let response = {};

    let lastUpdateDate = await stockService.getLastUpdateDate();
    response["lastUpdateDate"] = lastUpdateDate;
    res.status(200).send(responseFormatter.success(response));
});

module.exports = router;
