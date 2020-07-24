DROP TABLE IF EXISTS game_card CASCADE;
DROP TYPE IF EXISTS game_card_state CASCADE;

DROP TABLE IF EXISTS game CASCADE;
DROP TYPE IF EXISTS game_difficulty CASCADE;
DROP TYPE IF EXISTS game_state CASCADE;

-- 6, 10, 26
CREATE TYPE game_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE game_state AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TABLE game (
    id BIGSERIAL PRIMARY KEY,
    difficulty_setting game_difficulty NOT NULL,
    error_score BIGINT NOT NULL DEFAULT 0,
    create_date TIMESTAMP NOT NULL DEFAULT current_timestamp,
    state game_state NOT NULL DEFAULT 'IN_PROGRESS'
);

CREATE TYPE game_card_state AS ENUM ('NOT_CLEARED', 'CLEARED');
CREATE TABLE game_card (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT NOT NULL references game(id),
    content_value BIGINT NOT NULL, -- NUMBER 1-13
    position BIGINT NOT NULL,
    state game_card_state NOT NULL DEFAULT 'NOT_CLEARED'
);