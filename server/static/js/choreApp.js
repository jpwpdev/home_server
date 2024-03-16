console.log("test");

angular.module('choreApp', [])
.controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.choreData = {};
    $scope.selectedKey = '';
    $scope.newChore = '';
    $scope.choreList = [];
    $scope.choreLists = [];

    $scope.loadData = function() {
        console.log("sending get request");
        $http.get('https://10.0.0.64:3000/choreData').then(function(response) {
            console.log("returned", response.data);
            $scope.choreData = response.data;
            $scope.choreLists = Object.keys($scope.choreData);
            $scope.selectedKey = Object.keys($scope.choreData)[0];
            console.log("before", $scope.choreData, $scope.selectedKey);
            $scope.updateChoreList();
            console.log("after", $scope.choreData, $scope.selectedKey);
        }, function(error) {
            console.log('Error fetching data:', error);
        });
    };

    $scope.updateChoreList = function() {
        if ($scope.selectedKey && $scope.choreData[$scope.selectedKey]) {
            console.log("update chore list in if statement");
            $scope.choreList = $scope.choreData[$scope.selectedKey].map(chore => ({ name: chore, checked: false }));
            console.log($scope.choreList);
        }
    };

    $scope.addChore = function() {
        if ($scope.newChore.trim() !== '') {
            $scope.choreData[$scope.selectedKey].push($scope.newChore);
            $scope.updateChoreList();
            $scope.newChore = '';
            $scope.updateServer();
        }
    };

    $scope.updateServer = function() {
        $http.post('https://10.0.0.64:3000/choreData', $scope.choreData).then(function(response) {
            console.log('Data updated successfully');
        }, function(error) {
            console.log('Error updating data:', error);
        });
    };

    $scope.sortChores = function() {
        $scope.choreList.sort((a, b) => a.name.localeCompare(b.name));
        // Move checked items to the top
        $scope.choreList.sort((a, b) => b.checked - a.checked);
    };

    // Initial data load
    console.log("calling loadData");
    $scope.loadData();
}])
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
