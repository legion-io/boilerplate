var EventEmitter = require('events').EventEmitter;
var util = require('util');
var fs = require('fs');
var path = require('path');

var bots = {
    random: require('./bots/bot-random'),
    map: require('./bots/bot-map')
};

function Bot (opts) {

    EventEmitter.call(this);
    var bot = this;

    if (opts == undefined) {
        opts = {};
    }

    this.x = 0;
    this.y = 0;
    this.finished = false;
    this.count = 0;

    // to override
    this.canMove = function (x,y) {
        return false;
    };

    this.move = function (x,y, callback) {
        setTimeout(function () {
            bot.x = x;
            bot.y = y;
            bot.emit('moved');
            callback && callback();
        }, 500);
    };

    this.finish = function () {
        this.finished = true;
        bot.emit('finished');
    };

    if (opts.hasOwnProperty('x')) {
        this.x = opts.x;
    }

    if (opts.hasOwnProperty('y')) {
        this.y = opts.y;
    }

    this.next = null;
    if (opts.hasOwnProperty('next')) {
        this.next  = bots[opts.next];
    }

    this.start = function () {
        if (this.next != null && this.next != undefined) {
            this.next(bot);
        }
    };

    this.serialize = function () {
        return {x:bot.x, y:bot.y};
    }

}

util.inherits(Bot, EventEmitter);

module.exports = Bot;
