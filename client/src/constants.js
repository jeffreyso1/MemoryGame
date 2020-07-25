export const DIFFICULTY = {
    EASY: "EASY", // 6 cards, 3 sets of card
    MEDIUM: "MEDIUM", // 10 cards, 5 sets of card
    HARD: "HARD" // 26 cards, 13 sets of card
};

export const CARD_STATE = {
    REVEALED: "REVEALED",
    HIDDEN: "HIDDEN",
    MATCHED: "MATCHED",
    INCORRECT: "INCORRECT"
};

export const GAME_STATE = {
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    NOT_FOUND: "NOT_FOUND"
};

export const CARDFLIP_RESULT = {
    REVEALED_1: "revealed1", // only revealed 1 card
    CORRECT: "correct", // 2 cards matched
    INCORRECT: "incorrect" // 2 cards does not match
}