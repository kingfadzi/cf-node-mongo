var express = require('express'),
    path = require('path'),
    http = require('http'),
    wine = require('./routes/wines');

var app = express();

var bodyParser = require('body-parser');

//app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    //app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(bodyParser.json()); 
    app.use(express.static(path.join(__dirname, 'public')));
//});


app.get('/wines', wine.findAll);
app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);
app.get('/instance', wine.instance);
app.get('/generate', wine.generate);
app.get('/kill', wine.kill);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
