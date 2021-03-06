var todoApp = angular.module('todoApp', ['ngCookies']);

function mainController($scope, $http) {
    $scope.formData = {due: new Date()};
    //$scope.todoData = {deleted: false};

    // when landing on the page, get all todos and show them
    //$http.get('/api/todos')
        //.success(function(data) {
      //      $scope.todos = data;
    //      console.log(data);
        //})
        //.error(function(data) {
          //  console.log('Error: ' + data);
        //});

        $scope.getUserTodos = function() {

        $http.get('/api/todos/users')
            .success(function(data) {
              console.log(data)
                $scope.todos = data;
                console.log('got data!!!' + $scope.todos.length);
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                //$scope.todos = data; no longer needed in favor of the below function
                $scope.getUserTodos();
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
              //$scope.todos = data; no longer needed in favor of the below function
              $scope.getUserTodos();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

        $scope.markComplete = function(id) {
        $http.get('/api/todos/complete/' + id)
            .success(function(data) {
              $scope.deleted = true;
              //$scope.todos = data; no longer needed in favor of the below function
              $scope.getUserTodos();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}

function userController($scope, $http) {
	$scope.loginData = {username: 'taylorackley@gmail.com', password: 'Vb578Vb578!'};
    $scope.isLoggedIn = false;


    // Auth Functions via passport.
        $scope.loginUser = function() {
        $http.post('/api/users/login', $scope.loginData)
            .success(function(data) {
                $scope.loginData = {}; // clear the form so our user is ready to enter another
                $scope.user = data;
                $scope.isLoggedIn = true;
                isLoggedIn = true;
                console.log(data);
                $scope.getUserTodos()
              })

            .error(function(data) {
                console.log('Error: ' + data);
            });

    };

        $scope.createUser = function() {
        $http.post('/api/users/createuser', $scope.loginData)
            .success(function(data) {
                $scope.logindata = {}; // clear the form so our user is ready to enter another
                $scope.user = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

   }
