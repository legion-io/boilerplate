function next (bot) {
    if (bot.finished) {
        return;
    }

    if (bot.topleft == undefined) {
        bot.topleft = true;
    }

    if (bot.mapWidth == undefined) {
        bot.mapWidth = 0;
    }
    
    if (bot.mapHeight == undefined) {
        bot.mapHeight = 0;
    }

    if (!bot.topleft && bot.bottomright == undefined) {
        bot.bottomright = true;
    }


    if (bot.topleft) {
        if (bot.canMoveTo('north')) {
            bot.moveTo('north', function(){
                bot.next(bot);
            });
        } else if (bot.canMoveTo('west')) {
            bot.moveTo('west', function(){
                bot.next(bot);
            });
        } else {
            bot.topleft = false;
            bot.next(bot);
        }
    } else if (bot.bottomright) {
        if (bot.canMoveTo('south')) {
            bot.moveTo('south', function(){
                bot.mapHeight++;
                bot.next(bot);
            });
        } else if (bot.canMoveTo('east')) {
            bot.moveTo('east', function(){
                bot.mapWidth++;
                bot.next(bot);
            });
        } else {

            bot.emit('speak', 'map width: '+bot.mapWidth+' map height:'+bot.mapHeight); 
            bot.finish();
        }
    }
};

module.exports = next;
