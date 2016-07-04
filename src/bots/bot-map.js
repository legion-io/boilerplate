function next (bot) {

    if (bot.topleft == undefined) {
        bot.topleft = true;
    }

    if (!bot.topleft && bot.bottomright == undefined) {
        bot.bottomright = true;
    }


    if (bot.topleft) {
        if (bot.canMove(bot.x -1, bot.y - 1)) {
            bot.move(bot.x-1,bot.y -1, function(){
                bot.next(bot);
            });
        } else if (bot.canMove(bot.x -1 , bot.y)) {
            bot.move(bot.x-1,bot.y, function(){
                bot.next(bot);
            });
        } else {
            bot.topleft = false;
            bot.next(bot);
        }
    } else if (bot.bottomright) {
        if (bot.canMove(bot.x+1, bot.y + 1)) {
            bot.move(bot.x+1,bot.y+1, function(){
                bot.next(bot);
            });
        } else if (bot.canMove(bot.x+1 , bot.y)) {
            bot.move(bot.x+1,bot.y, function(){
                bot.next(bot);
            });
        } else {
            bot.finish();
        }
    }
};

module.exports = next;
