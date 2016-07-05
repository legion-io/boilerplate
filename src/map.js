function Map (opts) {

    if (opts == undefined) {
        opts = {};
    }

    this.width = 0;
    this.height = 0;

    if (opts.hasOwnProperty('width')) {
        this.width = opts.width;
    }

    if (opts.hasOwnProperty('height')) {
        this.height = opts.height;
    }

    this.get = function (x,y) {
        if (this.contains(x,y)) {
            return 0;
        } else {
            return -1;
        }
    };

    this.contains = function (x,y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    },

    this.serialize = function () {

        var map = [];
        for (var x = 0 ; x < this.width ; x++) {
            map[x] = [];
            for (var y = 0 ; y < this.height ; y++) {
                map[x][y] = this.get(x,y);
            }
        }
        return map;
    }
}

module.exports = Map;
