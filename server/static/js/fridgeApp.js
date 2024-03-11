angular.module('fridgeApp', [])
.controller('MainController', ['$scope', '$http', "$window", function($scope, $http, $window) {
    $http.get('https://10.0.0.64:3000/fridgeData').then(function(response) {
        $scope.jsonData = response.data;
        $scope.categories = Object.keys($scope.jsonData.items);
        $scope.selectedCategory = $scope.categories[0];
    });

    $scope.addItem = function() {
        if ($scope.newItem && $scope.newItem !== "") {
            $scope.jsonData.items[$scope.selectedCategory].push($scope.newItem);
            $scope.newItem = ''; // Clear the input field after adding
            $scope.updateItems();
        }
    };

    $scope.removeItem = function(item) {
        const index = $scope.jsonData.items[$scope.selectedCategory].indexOf(item);
        if (index > -1) {
            $scope.jsonData.items[$scope.selectedCategory].splice(index, 1);
            $scope.updateItems();
        }
    };

    $scope.updateItems = function() {
        $http.post('https://10.0.0.64:3000/fridgeData', $scope.jsonData).then(function(response) {
            console.log('Data sent successfully');
        }, function(error) {
            console.error('Error sending data', error);
        });
    };

    $scope.adjustContainerHeight = function(focus) {
        const container = document.querySelector('.items-container');
        if (!container) return; // Exit if the container is not found

        if (focus) {
            // When input is focused, reduce the container height
            const keyboardHeightApprox = 300; // An approximate height of the virtual keyboard
            const availableHeight = $window.innerHeight - keyboardHeightApprox + 'px';
            container.style.height = availableHeight;
        } else {
            // When input loses focus, revert the height adjustment
            container.style.height = 'calc(100vh - 150px)';
        }
    };
    
}]);
