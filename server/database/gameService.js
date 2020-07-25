const db = require("./db");

exports.addNewGame = async function(difficultySetting, cards) {
    let gameId = null;
    try {
        await db.run("BEGIN", []);
        let res = await db.run("INSERT INTO game(difficulty_setting) " + 
            "VALUES (?)", [difficultySetting]);
        gameId = res.lastID;

        let count = 0;
        for (const card of cards) {
            await db.run("INSERT INTO game_card(game_id, content_value, " + 
                "position) VALUES (?, ?, ?)", [gameId, card.value, count]);
            count += 1;
        }

        await db.run("COMMIT", []);
    } catch (e) {
        console.log(e);
        await db.run('ROLLBACK', []);
        gameId = null;
    } finally {
        return gameId;
    }
}

exports.getGameById = async function(gameId) {
    try {
        const res = await db.all("SELECT * FROM game WHERE " + 
            "id = ?", [gameId]);
        if (res.length !== 1) {
            return null;
        }
        return res[0];
    } catch (error) {
        return null;
    }
}

exports.getGameScores = async function() {
    try {
        const res = await db.all("SELECT * FROM game WHERE " + 
            "state = 'COMPLETED' ORDER BY complete_date DESC " + 
            "LIMIT 10", []);

        return res;
    } catch (error) {
        return null;
    }
}

exports.setGameComplete = async function(gameId) {
    try {
        const res = await db.run("UPDATE game SET state = 'COMPLETED', " + 
            "complete_date = current_timestamp WHERE id = ?", [gameId]);
        return true;
    } catch (error) {
        return false;
    }
}

exports.setGameIncrementErrorScore = async function(gameId) {
    try {
        const res = await db.run("UPDATE game SET error_score = " + 
            "error_score + 1 WHERE id = ?", [gameId]);
        return true;
    } catch (error) {
        return false;
    }
}

exports.getCardsByGameId = async function(gameId) {
    try {
        const res = await db.all("SELECT * FROM game_card WHERE " + 
            "game_id = ? ORDER BY position ASC", [gameId]);
        return res;
    } catch (error) {
        return null;
    }
}

exports.getCardsByGameIdState = async function(gameId, state) {
    try {
        const res = await db.all("SELECT * FROM game_card WHERE " + 
            "game_id = ? AND state = ? ORDER BY position ASC", 
            [gameId, state]);
        return res;
    } catch (error) {
        return null;
    }
}

exports.getCardsByGameIdPosition = async function(gameId, position) {
    try {
        const res = await db.all("SELECT * FROM game_card WHERE " + 
            "game_id = ? AND position = ? ORDER BY position ASC", 
            [gameId, position]);
        if (res.length !== 1) {
            return null;
        }
        return res[0];
    } catch (error) {
        return null;
    }
}

exports.setCardStateById = async function(newState, cardId) {
    try {
        const res = await db.run("UPDATE game_card SET state = ? " + 
            "WHERE id = ?", [newState, cardId]);
        return true;
    } catch (error) {
        return false;
    }
}

exports.setCardsStateByIds = async function(newState, cardId1, cardId2) {
    try {
        const res = await db.run("UPDATE game_card SET state = ? " + 
            "WHERE id = ? OR id = ?", [newState, cardId1, cardId2]);
        return true;
    } catch (error) {
        return false;
    }
}