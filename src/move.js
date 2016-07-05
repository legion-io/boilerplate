
var toWest = function (position) {
    return {x:position.x-1, y:position.y};
};

var toEast = function (position) {
    return {x:position.x+1, y:position.y};
};

var toNorth = function (position) {
    return {x:position.x, y:position.y-1};
};

var toSouth = function (position) {
    return {x:position.x, y:position.y+1};
};

var to = function (direction) {
    if (direction == 'south') {
        return toSouth;
    } else if (direction == 'north') {
        return toNorth;
    } else if (direction == 'east') {
        return toEast;
    } else if (direction == 'west') {
        return toWest;
    }
};

function from (position) {
    return {
        to:function (direction) {
            return to(direction)(position);
        }
    };
}

module.exports.from = from;
module.exports.to = to;
