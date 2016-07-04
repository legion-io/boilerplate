var express = require('express');
var morgan = require('morgan');
var swig = require('swig');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Map = require('./map');
var Bot = require('./bot');



app.set('view cache', false);
// To disable Swig's cache, do the following:
 swig.setDefaults({ cache: false });

app
//.use(morgan('combined'))
.engine('html', swig.renderFile)
.set('view cache', false)
.set('view engine', 'html')
.set('views', __dirname+'/../views/templates')
.get('/', function (req, res) {
    res.render('index.html', {title: 'ok'});
})
.use(express.static(__dirname+'/../views/static'))
.use('/partials', express.static(__dirname+'/../views/partials'));

var port = process.env.PORT || 8080;

server.listen(port, function (req, res) {
    console.log('listening on http://localhost:'+server.address().port);
});

io.on('connection', function (socket) {
    var map = new Map({width: 80, height: 40});
    socket.emit('map', map.serialize());

    socket.on('play', function () {
        socket.emit('map', map.serialize());
        var bot = new Bot({x:5, y:5, next:'map'});

        bot.canMove = function (x,y) {
            var result =  map.contains(x,y);
            return result;
        };

        bot.start();

        socket.emit('bot', bot.serialize());

        bot.on('moved', function () {
            socket.emit('bot-moved', bot.serialize());

            socket.emit('log', 'wall-e: x:'+bot.x+' y:'+bot.y);
            //console.log(bot.serialize());
        });

        bot.on('finished', function () {
            socket.emit('scenario-finished'); 

            socket.emit('log', 'wall-e: has finished');

        });
    });
});


