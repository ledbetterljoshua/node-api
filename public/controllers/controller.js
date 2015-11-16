var myApp = angular.module('myApp', []);


myApp.directive('myPostRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      // iteration is complete, do whatever post-processing
      // is necessary
      console.log('ng repeat is done')
      Grid.init();
    }
  };
});

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

	refresh();

	$scope.addPost = function() {
		console.log($scope.post);
		$http.post('/api/posts', $scope.post).success(function(response){
			console.log($scope.post);
			refresh();
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



