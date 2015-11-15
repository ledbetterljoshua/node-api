var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', 
function($scope, $http) {
	console.log("Hello from the controller");

	var refresh = function(){
		$http.get('/api/posts').success(function(response) {
			console.log('I got the data! :D');
			$scope.posts = response;
			$scope.post = "";
			console.log(response + ": this is the response")
		});
	}
	var parenturl = (window.location != window.parent.location)
            ? document.referrer
            : document.location;

	refresh();


	$scope.addPost = function(fn) {
		fn()
		console.log($scope.post.url + ": urlss");
		
		$http.post('/api/posts', $scope.post).success(function(response){
			console.log(response);
			console.log($scope.post.comment)
			refresh();
			//$scope.post = {url: parenturl}
		});
		
	};

	$scope.setUrl = function() {
		$scope.post.url = parenturl.href;
	}

	$scope.remove = function(id) {
		console.log(id);
		$http.delete('/api/posts/' + id).success(function(response) {
			refresh();
		});
	};

	$scope.edit = function(id){
		console.log(id);
		$http.get('/api/posts/' + id).success(function(response) {
			$scope.post = response;
		});
	};

	$scope.update = function() {
		console.log($scope.post.id);
		$http.put('/api/posts/' + $scope.post._id, $scope.post).success(function(response) {
			refresh();
		});
	};



	
	
}]);



