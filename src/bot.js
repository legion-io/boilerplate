var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var path = require('path');

var bots = {
    random: require('./bots/bot-random'),
    'map-blind': require('./bots/bot-map-blind')
};

function Bot (opts) {

    EventEmitter.call(this);
    var bot = this;

    if (opts == undefined) {
        opts = {};
    }

    this.finished = false;
    this.speed = 200;
    this.name = '';

    // to override
    this.canMoveTo = function (direction) {
        return false;
    };

    // to override
    this.updatePosition = function (direction) {};

    this.moveTo = function (direction, callback) {
        setTimeout(function () {
            bot.updatePosition(direction);
            bot.emit('moved');
            callback && callback();
        }, bot.speed);
    };

    this.finish = function () {
        this.finished = true;
        bot.emit('finished');
    };

    this.next = null;
    if (opts.hasOwnProperty('next')) {
        this.next  = bots[opts.next];
    }

    this.start = function () {
        this.next && this.next(bot);
    };

}

util.inherits(Bot, EventEmitter);

module.exports = Bot;
