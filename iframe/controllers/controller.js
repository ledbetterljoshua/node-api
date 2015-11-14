var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', 
function($scope, $http) {
	console.log("Hello from the controller");

	var refresh = function(){
		$http.get('/api/posts').success(function(response) {
			console.log('I got the data! :D');
			$scope.posts = response;
			$scope.post = "";
		});
	}
	var parenturl = (window.location != window.parent.location)
            ? document.referrer
            : document.location;

	refresh();
	$scope.url = parenturl;
	console.log($scope.url)

	$scope.set = function(new_url) {
        this.post.url = new_url;
    }
	$scope.addPost = function() {
		console.log($scope.post);
		$scope.post = {url: parenturl}

		$http.post('/api/posts', $scope.post).success(function(response){
			console.log(response);
			refresh();
			$scope.post = {url: parenturl}
		});
	};
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



