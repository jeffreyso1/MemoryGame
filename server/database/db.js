// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
const sqlite3 = require('sqlite3').verbose();

// http://www.sqlitetutorial.net/sqlite-nodejs/connect/
// will create the db if it does not exist
const db = new sqlite3.Database('./server/database/database.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the database.');
});

function dbAll(sql, params) {
	return new Promise(function (resolve, reject) {
		db.all(sql, params, function (error, rows) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				resolve(rows);
			}
		});
	});
};

function dbRun(sql, params) {
	return new Promise(function (resolve, reject) {
		db.run(sql, params, function (error) {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				resolve(this);
			}
		});
	});
};

module.exports = {
    all: dbAll,
    run: dbRun
}