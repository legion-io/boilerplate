app.controller('MainCtrl', function($scope, socket){

    $scope.canvasHeight = 0;
    $scope.canvasWidth = 0;

    $scope.horizontalPitch = 0;
    $scope.verticalPitch = 0;

    $scope.bots = {};
    $scope.map = null;

    $scope.paused = true;
    $scope.logs = [];

    $scope.play = function () {
        $scope.bots = {};
        socket.emit('play');
        $scope.paused = false;
        $scope.logs = [];
    };

    socket.on('map', function (map) {
        console.log('map');
        $scope.map = map;
        $scope.displayCanvas(map);
    });

    socket.on('log', function (log) {
        $scope.logs.push({message:log});
    });

    var i = 0;

    socket.on('bot-added', function (bot) {
        console.log('bot-added');
        $scope.bots[bot.name] = {
            color: (i==0?'black':'blue'),
            position: bot.position
        };
        i++;
        $scope.displayBot(bot);
    });
    
    socket.on('bot-moved', function (bot) {
        $scope.hideBot(bot);
        $scope.bots[bot.name].position = bot.position;
        $scope.displayBot(bot);
    });

    socket.on('scenario-finished', function () {
        console.log('scenario-finished');
        $scope.paused = true;
    });

    $scope.hideBot = function (bot) {
        //console.log('hide');
        var canvas = document.getElementById('canvas');
        var contexte = canvas.getContext('2d');

        //contexte.fillStyle = "white";
        contexte.fillStyle = "#f2f9fc";
        contexte.fillRect(
            $scope.bots[bot.name].position.x*$scope.horizontalPitch, 
            $scope.bots[bot.name].position.y*$scope.verticalPitch,
            $scope.horizontalPitch, 
            $scope.verticalPitch);
    };

    $scope.displayBot = function (bot) {
        var canvas = document.getElementById('canvas');
        var contexte = canvas.getContext('2d');

        contexte.fillStyle = $scope.bots[bot.name].color;//"#333";
        contexte.fillRect(
            bot.position.x*$scope.horizontalPitch, 
            bot.position.y*$scope.verticalPitch,
            $scope.horizontalPitch, 
            $scope.verticalPitch);
    };

    $scope.displayCanvas = function (map) {

        var ratio = map.length/map[0].length;

        var max = 300;

        if (max*ratio > 980) {
           max = 800/ratio; 
        }

        $scope.canvasWidth = max*ratio;
        $scope.canvasHeight = max;

        console.log('width :'+$scope.canvasWidth+' height:'+$scope.canvasHeight);

        var canvas = document.getElementById('canvas');
        var contexte = canvas.getContext('2d');

        $scope.verticalPitch = $scope.canvasHeight/map[0].length;
        $scope.horizontalPitch = $scope.canvasWidth/map.length;

        //console.log('vPitch: '+$scope.verticalPitch+ ' hPitch:'+$scope.horizontalPitch);

        //contexte.fillStyle = "white";
        contexte.fillStyle = "#f2f9fc";
        contexte.fillRect(0, 0, $scope.canvasWidth, $scope.canvasHeight);

    };

});
