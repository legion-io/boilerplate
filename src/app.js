var express = require('express');
var morgan = require('morgan');
var swig = require('swig');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Room = require('./room');

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

    var room = new Room();
    
    room.on('map-created', function (map) {
        socket.emit('map', map);
    });

    room.on('bot-added', function (bot) {
        socket.emit('bot-added', bot);
    });

    room.on('bot-moved', function (bot) {
        socket.emit('bot-moved', bot);
    });

    room.on('scenario-finished', function () {
        socket.emit('scenario-finished');
    });

    room.on('log', function (message) {
        socket.emit('log', message);
    });
    
    room.start();

    socket.on('play', function () {

        room.clear(); 
        room.start();

        room.addBot('random', 5, 5);
    });

    /*socket.on('error', function (err) {
        console.log(err);
    });*/
});
