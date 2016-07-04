app.controller('MainCtrl', function($scope, socket){

    $scope.canvasHeight = 0;
    $scope.canvasWidth = 0;

    $scope.horizontalPitch = 0;
    $scope.verticalPitch = 0;

    $scope.bot = null;
    $scope.map = null;

    $scope.paused = true;
    $scope.logs = [];

    socket.on('map', function (map) {
        //console.log(map);
        $scope.map = map;
        $scope.displayCanvas(map);
    });

    socket.on('bot', function (bot) {
        $scope.displayBot(bot);
        $scope.bot = bot;
    });

    socket.on('log', function (log) {
        $scope.logs.push({message:log});
    });

    $scope.play = function () {
        socket.emit('play');
        $scope.paused = false;
    };

    
    socket.on('bot-moved', function (bot) {
        console.log('bot-moved '+JSON.stringify($scope.bot)+' '+JSON.stringify(bot) );
        $scope.displayCanvas($scope.map);
        //$scope.hideBot($scope.bot);
        $scope.displayBot(bot);
    });

    socket.on('scenario-finished', function () {
        $scope.paused = true;
    });

    $scope.hideBot = function (bot) {
        var canvas = document.getElementById('canvas');
        var contexte = canvas.getContext('2d');

        contexte.fillStyle = "white";
        contexte.fillRect(
            bot.x*$scope.horizontalPitch, 
            bot.y*$scope.verticalPitch,
            $scope.horizontalPitch, 
            $scope.verticalPitch);

    };

    $scope.displayBot = function (bot) {
        var canvas = document.getElementById('canvas');
        var contexte = canvas.getContext('2d');

        contexte.fillStyle = "#333";
        contexte.fillRect(
            bot.x*$scope.horizontalPitch, 
            bot.y*$scope.verticalPitch,
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

        console.log('vPitch: '+$scope.verticalPitch+ ' hPitch:'+$scope.horizontalPitch);

        //contexte.fillStyle = "white";
        contexte.fillStyle = "#f2f9fc";
        contexte.fillRect(0, 0, $scope.canvasWidth, $scope.canvasHeight);

    };

});
