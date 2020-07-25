const express = require('express');
const path = require('path');

const responseFormatter = require('./server/utility/responseFormatter');
const gameRouter = require('./server/routes/game');

const app = express();
// app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', gameRouter);

// app.get('*', (req, res) =>{
// 	res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });
app.use('*', function(req, res, next){
    response = {};
    res.status(404).send(responseFormatter.errorRouteNotFound(response));
});

app.listen(process.env.PORT || 5000, () => console.log(`Listening on port ${process.env.PORT || 5000}!`));
