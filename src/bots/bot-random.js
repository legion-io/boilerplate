function next (bot) {
    if (bot.finished) {
        return;
    }

    if (bot.count == undefined) {
        bot.count = 0;
    }

    if (bot.count > 50) {
        bot.finish();
        return;
    }

    var horizontalMovement = ( Math.random() < 0.5 );
    var northOrWest = ( Math.random() < 0.5 );


    var direction = '';
    if (horizontalMovement) {
        if (northOrWest) {
            direction = 'west';
        } else {
            direction = 'east';
        }
    } else {
        if (northOrWest) {
            direction = 'north';
        } else {
            direction = 'south';
        }
    }

    if (bot.canMoveTo(direction)) {
        bot.count++;
        bot.moveTo(direction, function(){
            bot.next(bot);
        });
    } else {
        bot.count++;
        bot.next(bot);
    }

};

module.exports = next;
