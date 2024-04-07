angular.module('taskListApp', [])
    .controller('MainController', ['$scope', '$http', function($scope, $http) {
        $scope.people = [];
        $scope.tasks = [];
        $scope.selectedPerson = '';
        $scope.newTask = { name: '', priority: 'low' };

        $scope.fetchTasks = function() {
            $http.get('https://10.0.0.64/taskListData')
                .then(function(response) {
                    $scope.people = Object.keys(response.data);
                    if($scope.people.length > 0) {
                        $scope.selectedPerson = $scope.people[0];
                        $scope.tasks = response.data[$scope.selectedPerson].tasks;
                    }
                });
        };

        $scope.selectPerson = function(person) {
            $http.get('https://10.0.0.64/taskListData')
                .then(function(response) {
                    $scope.tasks = response.data[person].tasks;
                });
        };

        $scope.addTask = function() {
            if (!$scope.newTask.name) return;
            $http.post('https://10.0.0.64/taskListData', { personName: $scope.selectedPerson, task: $scope.newTask })
                .then(function(response) {
                    $scope.tasks.push($scope.newTask);
                    $scope.newTask = { name: '', priority: 'low' }; // Reset form
                });
        };

        $scope.fetchTasks();
    }]);
