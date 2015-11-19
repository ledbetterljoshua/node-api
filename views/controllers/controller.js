var myApp = angular.module('myApp', []);

myApp.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      $('body').append('<script src="js/isotope.pkgd.min.js"></script><script src="js/flickity.pkgd.min.js"></script><script src="js/main.js"></script>')
    }
  };
})
myApp.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
          return attrs['ngSrc'];
        }, function (value) {
          if (!value) {
            element.attr('src', attrs.errSrc);  
          }
      });

      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
});

myApp.controller('AppCtrl', ['$scope', '$http', 
function($scope, $http) {
	console.log("Hello from the controller");


	var favorite = function(id) {
		$scope.post.group = "favorites";
		console.log("hello?")
		$http.put('/api/posts/' + $scope.post.id, $scope.post).success(function(response) {
			
			refreshPost();
		});
	}

	var refreshPost = function(){
		$http.get('/api/posts').success(function(response) {
			
			$scope.posts = response;
			$scope.post = "";
		});
	}
	var refreshGroup = function(){
		$http.get('/api/groups').success(function(response) {
			console.log('I got the group data! :D');
			$scope.groups = response;
			$scope.group = "";
		});
	}


	refreshPost();
	refreshGroup();

	$scope.addGroup = function() {
		//$scope.post.url = parenturl;
		console.log($scope.group._id);
		
		$http.post('/api/groups', $scope.group).success(function(response){
			console.log(response);
			console.log($scope.group.name)
			refreshGroup();
		});
		 
	};
	$scope.removeGroup = function(id) {
		console.log(id);
		$http.delete('/api/groups/' + id).success(function(response) {
			refreshGroup();
		});
	};
	$scope.edit = function(id){
		console.log(id);
		$http.get('/api/groups/' + id).success(function(response) {
			$scope.group = response;
		});
	};

	$scope.update = function() {
		console.log($scope.group.id);
		$http.put('/api/groups/' + $scope.group._id, $scope.group).success(function(response) {
			refreshGroup();
		});
	};


	$scope.addPost = function() {
		//$scope.post.url = parenturl;
		console.log($scope.post._id);
		
		$http.post('/api/posts', $scope.post).success(function(response){
			refreshPost();
			//$scope.post = {url: parenturl}
		});
		 
	};


	$scope.remove = function(id) {
		console.log(id);
		$http.delete('/api/posts/' + id).success(function(response) {
			//refreshPost();
		});

		return false;
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
			refreshPost();
		});
	};



	$scope.addUser = function() {
		//$scope.user.url = parenturl;
		console.log($scope.user._id);
		
		$http.user('/api/users', $scope.user).success(function(response){
			refreshuser();
			//$scope.user = {url: parenturl}
		});
		 
	};


	$scope.remove = function(id) {
		console.log(id);
		$http.delete('/api/users/' + id).success(function(response) {
			//refreshuser();
		});

		return false;
	};

	$scope.edit = function(id){
		console.log(id);
		$http.get('/api/users/' + id).success(function(response) {
			$scope.user = response;
		});
	};

	$scope.update = function() {
		console.log($scope.user.id);
		$http.put('/api/users/' + $scope.user._id, $scope.post).success(function(response) {
			refreshUser();
		});
	};


	
	
}]);



