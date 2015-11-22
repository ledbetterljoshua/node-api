var myApp = angular.module('myApp', ['ngMaterial', 'ngMdIcons']);



myApp.directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      $('body').append("<script type=\"text/javascript\">$(function(){$('h2.md-title').each(function(){if($(this).text().length < 1) {$(this).addClass('unseen')}});});</script>");
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

	$scope.isOpen = false;
	  $scope.fab = {
	    isOpen: false,
	    count: 0,
	    selectedDirection: 'right'
	  };
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


	refreshPost();

	


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


myApp.controller('group', ['$scope', '$http', '$timeout', '$q', '$log',
function($scope, $http, $timeout, $q, $log) {

	

    var self = this;
    self.simulateQuery = false;
    self.isDisabled    = false;
    self.repos         = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `components` list of key/value pairs
     */

    function loadAll() {
    	
      $http.get('/api/groups').then(function(results) { return results.data; console.log(results.data); });

    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(item) {
        return (item.name.indexOf(lowercaseQuery) === 0);
      };
    }
  
  
  

	$scope.group = {};

	var refreshGroup = function(){
		$http.get('/api/groups').success(function(response) {
			console.log('Refreshed groups, and I have the response');
			$scope.groups = response;
			$scope.group = "";
			console.log(JSON.stringify(response))
		});
	}
	refreshGroup();

	$scope.addGroup = function(name) {
		
		$http.post('/api/groups', $scope.group).success(function(response){
			refreshGroup();
			console.log("$scope.group.name.val: " + $scope.group.name);
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
}]);


myApp.controller('sideNav', function ($http, $scope, $timeout, $mdSidenav, $log) {
	

    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  });



