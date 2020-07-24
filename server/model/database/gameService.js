const db = require("./db");

exports.addNewGame = async function(difficultySetting, cards) {
    const client = await db.connect();
    if (client == null) {
        return false;
    }

    let gameId = false;
    try {
        await client.query("BEGIN");
        const res = await client.query("INSERT INTO game(difficulty_setting) " + 
            "VALUES ($1) RETURNING id", [difficultySetting])
        gameId = res.rows[0].id;
        console.log(gameId);
        console.log(cards);
        let count = 0;
        for (const card of cards) {
            await client.query("INSERT INTO game_card(game_id, content_value, " + 
                "position) VALUES ($1, $2, $3)", [gameId, card.value, count]);
            count += 1;
        }
        console.log(cards);
        await client.query("COMMIT");
    } catch (e) {
        console.log(e);
        await client.query('ROLLBACK');
        gameId = false;
    } finally {
        client.release();
        return gameId;
    }
}

exports.getGameById = async function(gameId) {
    try {
        const res = await db.query("SELECT * FROM game WHERE " + 
            "id = $1", [gameId]);
        return res.rows[0];
    } catch (err) {
        console.log(err.stack);
        return false;
    }
}

exports.getCardsByGameId = async function(gameId) {
    try {
        const res = await db.query("SELECT * FROM game_card WHERE " + 
            "game_id = $1", [gameId]);
        return res.rows;
    } catch (err) {
        console.log(err.stack);
        return false;
    }
}

exports.getCardByPosition = async function(position, gameId) {
    try {
        const res = await db.query("SELECT * FROM game_card WHERE " + 
            "position = $1 and game_id = $2", 
            [position, gameId]);
        return res.rows[0];
    } catch (err) {
        console.log(err.stack);
        return false;
    }
}