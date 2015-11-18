/**
 * Created by Admin on 12.11.2015.
 */

angular.module('record', [])
    .controller('Members', function($scope){
        var adminResponse = $http.post('/admin/records/');
        adminResponse. success(function (data, status, headers, config) {
            $scope.data = data;
        });
        adminResponse. error(function (data, status, headers, config) {
            throw new Error('Something went wrong...');
        });            var adminResponse = $http.post('data.json');

        $scope.hasValidLength =  function () {

            if ($scope.membername !== undefined && $scope.membername.length > 1) {
                return true;
            } else {
                return false;
            }
        }
        $scope.send =  function () {
            alert("send");
        }

        });
