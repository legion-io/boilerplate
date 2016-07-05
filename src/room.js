var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Map = require('./map');
var Bot = require('./bot');
var BotMapper = require('./bot-mapper');

function Room () {

    EventEmitter.call(this);
    var room = this;
    this.map = null;
    this.bots = [];
    this.botMapper = null;
    this.finished = false;


    this.start = function () {
        console.log('start');
        this.finished = false;
        this.bots = [];
        this.map = new Map({width: 20, height: 20});
        this.botMapper = new BotMapper(room.map);
        room.emit('map-created', room.map.serialize());
    };

    this.serializeBot = function (bot) {
        return {name:bot.name, position:room.botMapper.position(bot)};
    };

    this.addBot = function (type, x, y) {
        console.log('addBot ' +type+' '+x+' '+y);
        var bot = new Bot({next: type});
        this.botMapper.addBot(bot, x, y);
        this.bots.push(bot);
        bot.start();

        bot.on('moved', function () {
            room.emit('bot-moved', room.serializeBot(bot));
        });

        bot.on('speak', function (message) {
            room.emit('log', bot.name+': '+message);
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

        room.bots = [];
        room.map = [];
        room.botMapper = null;
    };
}

util.inherits(Room, EventEmitter);

module.exports = Room;
