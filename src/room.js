var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Map = require('./map');
var Bot = require('./bot');

var botNames = require('./bot-names');
var move = require('./move');


function Room () {

    EventEmitter.call(this);
    var room = this;
    this.map = null;
    this.bots = [];
    this.positions = [];
    this.finished = false;


    this.start = function () {
        console.log('start');
        this.finished = false;
        this.bots = [];
        this.positions = [];
        this.map = new Map({width: 20, height: 20});
        room.emit('map-created', room.map.serialize());
    };

    this.serializeBot = function (bot) {
        return {name:bot.name, position:room.positions[bot.name]};
    };

    this.addBot = function (type, x, y) {

        if (room.map == null) {
            throw 'map not defined';
        }
        
        if (!room.map.contains(x,y)) {
            throw 'bot not in the map';
        }

        console.log('addBot ' +type+' '+x+' '+y);

        var bot = new Bot({next: type});
        bot.name = botNames.findName();
        room.bots.push(bot);
        room.positions[bot.name] = {x:x, y:y};

        bot.canMoveTo = function (direction) {
            //console.log('canMoveTo');
            var position = room.positions[bot.name];
            //console.log(position);
            var newPosition = move.from(position).to(direction); 
            //var newPosition = move.to(direction)(position); 
            //console.log(newPosition);
            var canMove =  room.map.contains(newPosition.x,newPosition.y);
            //console.log(canMove);
            return canMove;
        };

        bot.updatePosition = function (direction) {
            d
            //var newPosition = move.to(direction)(position); 
            var newPosition = move.from(position).to(direction); 
            room.positions[bot.name] = newPosition;
        };
        
        bot.start();

        bot.on('speak', function (message) {
            room.emit('log', bot.name+': '+message);
        });

        bot.on('moved', function () {
            room.emit('bot-moved', room.serializeBot(bot));
        });

        bot.on('finished', function () {
            room.emit('log', bot.name+': has finished');
    
            var finished = true;
            for (var i = 0 ; i < room.bots.length ; i++) {
                finished = finished && room.bots[i].finished;
            }

            room.finished = finished;

            if (finished) {
                room.emit('scenario-finished');
            }
        });

        room.emit('bot-added', room.serializeBot(bot));
    };

    this.clear = function () {
        for (var i = 0 ; i < room.bots.length ; i++) {
            room.bots[i].finish();
        }

        delete room.bots;
        delete room.map;
        delete room.positions;
        room.bots = [];
        room.map = [];
        room.positions = [];
    };
}

util.inherits(Room, EventEmitter);

module.exports = Room;
