var todoApp = angular.module('todoApp', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}

//function userController($scope) {
	
//$scope.name = "Taylor Ackley";
//$scope.email = 'taylorackley@gmail.com';
//$scope.photo = 'https://s3-us-west-2.amazonaws.com/hwcdn/images/img/27a9670.png';

//}
	//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/todoApp', function(err) {
    //if(err) {
       // console.log('connection error', err);
    //} else {
      //  console.log('connection successful');
  //  }
//});
