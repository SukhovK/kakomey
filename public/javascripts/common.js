/**
 * Created by Admin on 11.10.2015.
 */
var HelloCtrl = function ($scope) {
    $scope.getName = function() {
        return $scope.name+" test";
    };
}

function GuessTheNumberController($scope) {
    $scope.verifyGuess = function () {
        $scope.deviation = $scope.original - $scope.guess;
        $scope.noOfTries = $scope.noOfTries + 1;
    }
    $scope.initializeGame = function () {
        $scope.noOfTries = 0;
        $scope.original = Math.floor((Math.random() * 1000) + 1);
        $scope.guess = null;
        $scope.deviation = null;
    }
    $scope.initializeGame();
}