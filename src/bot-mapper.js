var EventEmitter = require('events').EventEmitter;
var util = require('util');
function BotMapper (map) {

    EventEmitter.call(this);
    var botMapper = this;

    this.map = map;
    this.bots = {};

    this.availableNames = [
        'R2-D2',
        'Wall-E',
        'C-3PO',
        'Daneel Olivaw',
        'Nao',
        'Bumblebee',
        'Astro Boy',
        'Ash'
    ];

    this.addBot = function (bot, x, y) {

        if (!map.contains(x,y)) {
            throw 'bot not in the map';
        }

        if (this.availableNames.length > 0) {
            bot.name = this.availableNames[0];
            this.availableNames.splice(0, 1);
        } else {
            bot.name = 'unknown';
        }

        botMapper.bots[bot.name] = {x:x, y:y};
        //console.log(bot.name+':'+JSON.stringify(this.bots[bot]));
        
        bot.canMoveTo = function (direction) {
            //return true;

            var position = botMapper.bots[bot.name];
            var newPosition = botMapper.to(direction)({x:position.x,y:position.y});
            var result =  map.contains(newPosition.x,newPosition.y);
            return result;
        };

        bot.updatePosition = function (direction) {
            //console.log(bot.name+' update:'+JSON.stringify(botMapper.bots[bot.name]));
            botMapper.botMovedTo(bot, direction);
        };

        //console.log(JSON.stringify(botMapper.bots));
    };


    this.botPositions = function () {
        for(var key in this.bots) {
            return this.bots[key];
        }
    };

    this.position = function (bot) {
        return this.bots[bot.name];
    };

    this.toWest = function (position) {
        return {x:position.x-1, y:position.y};
    };
    this.toEast = function (position) {
        return {x:position.x+1, y:position.y};
    };
    this.toNorth = function (position) {
        return {x:position.x, y:position.y-1};
    };
    this.toSouth = function (position) {
        return {x:position.x, y:position.y+1};
    };

    this.to = function (direction) {
        if (direction == 'south') {
            return this.toSouth;
        } else if (direction == 'north') {
            return this.toNorth;
        } else if (direction == 'east') {
            return this.toEast;
        } else if (direction == 'west') {
            return this.toWest;
        }
    };

    this.botMovedTo = function (bot, direction, callback) {
        this.bots[bot.name] = this.to(direction)(this.bots[bot.name]);
        //this.emit('bot-moved', bot);
    };


}
util.inherits(BotMapper, EventEmitter);

module.exports = BotMapper;
