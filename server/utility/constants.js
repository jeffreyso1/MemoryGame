exports.DIFFICULTY = {
    "EASY": 3, // 6 cards, 3 sets of card
    "MEDIUM": 6, // 12 cards, 6 sets of card
    "HARD": 13 // 26 cards, 13 sets of card
};

exports.CARD_STATE = {
    REVEALED: "REVEALED",
    HIDDEN: "HIDDEN",
    MATCHED: "MATCHED"
};

exports.GAME_STATE = {
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED"
};

exports.CARDFLIP_RESULT = {
    REVEALED_1: "revealed1", // only revealed 1 card
    CORRECT: "correct", // 2 cards matched
    INCORRECT: "incorrect" // 2 cards does not match
};