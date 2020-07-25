---- load with 
--- sqlite3 database.db < schema.sql

DROP TABLE IF EXISTS game_card;
DROP TABLE IF EXISTS game;

-- 6, 10, 26
CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    difficulty_setting TEXT NOT NULL, -- 'EASY', 'MEDIUM', 'HARD'
    error_score BIGINT NOT NULL DEFAULT 0,
    create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    state TEXT NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'COMPLETED'
    complete_date TIMESTAMP NULL
);

CREATE TABLE game_card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id BIGINT NOT NULL references game(id),
    content_value BIGINT NOT NULL, -- NUMBER 1-13
    position BIGINT NOT NULL,
    state TEXT NOT NULL DEFAULT 'HIDDEN' -- 'HIDDEN', 'REVEALED', 'MATCHED'
);

