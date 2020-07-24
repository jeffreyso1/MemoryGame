const { Pool } = require('pg');
const pool = new Pool({
    user: 'memory_game_admin',
    host: 'localhost',
    database: 'memory_game_db',
    password: 'qwert123',
    port: 5432
});
// const pool = new Pool({
//     user: process.env.RDS_USERNAME,
//     host: process.env.RDS_HOSTNAME,
//     database: 'ebdb',
//     password: process.env.RDS_PASSWORD,
//     port: process.env.RDS_PORT
// });

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect()
}