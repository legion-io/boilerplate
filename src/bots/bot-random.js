function next (bot) {

    if (bot.count == undefined) {
        bot.count = 0;
    }

    if (bot.count > 50) {
        bot.finish();
        return;
    }

    var horizontalMovement = ( Math.random() < 0.5 );
    var add = ( Math.random() < 0.5 ? 1 : -1 );

    var x = bot.x;
    var y = bot.y;
    if (horizontalMovement) {
        x += add;
    } else {
        y += add;
    }

    if (bot.canMove(x,y)) {
        bot.count++;
        bot.move(x,y, function(){
            bot.next(bot);
        });
    } else {
        bot.next(bot);
    }

};

module.exports = next;
