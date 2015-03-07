/**
 * @author Taylor
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todoApp', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

angular.module('app', [])
	.controller('todoController', ['$scope', function ($scope) {
		$scope.name = 'Primary Todo';
		
	}]);
