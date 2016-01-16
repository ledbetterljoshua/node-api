var myApp = angular.module('myApp', ['ngMaterial', 'ngMdIcons', 'ngResource', 'ui.router']);


myApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/all');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('all', {
            url: '/all',
            templateUrl: '../view-all.ejs'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('favorites', {
            url: "/favorites", 
            templateUrl: '../favorites.ejs'
        })
        .state('reading-list', {
            url: "/reading-list", 
            templateUrl: '../readlater.ejs'
        })
        .state('groups', {
            url: "/groups/:group_id", 
            templateUrl: '../group.ejs'
        })
        .state('users', {
            url: "/:user", 
            templateUrl: '../userProfile.ejs'
        });
        
});

myApp.factory('groupsInPost', function($resource) {
  return $resource('/api/posts/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
});
myApp.factory('getPosts', function($resource) {
  return $resource('/api/posts/', {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
});

myApp.filter( 'domain', function () {
  return function ( input ) {
    var matches,
        output = "",
        urls = /\w+:\/\/([\w|\.]+)/;

    matches = urls.exec( input );

    if ( matches !== null ) output = matches[1];

    return output;
  };
});

myApp.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    
    el.draggable = true;
    
    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      },
      false
    );
    
    el.addEventListener(
      'dragend',
      function(e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
});

myApp.directive('droppable', function() {
  return {
    scope: {
      drop: '&',
      bin: '='
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();
          
          this.classList.remove('over');
          
          var binId = this.id;
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          //this.appendChild(item);
          // call the passed drop function
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {            
              fn(item.id, binId);
            }
          });
          
          return false;
        },
        false
      );
    }
  }
});

myApp.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
      });
   };
});
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

myApp.controller('AppCtrl', ['$scope', '$http', '$timeout', '$q', '$log', '$filter', '$mdDialog', '$mdMedia', 'groupsInPost', 'getPosts', '$mdToast',
function($scope, $http, $timeout, $q, $log, $filter, $mdDialog, $mdMedia, groupsInPost, getPosts, $mdToast) {
	$scope.SearchQueryEmpty = function() {
		$scope.SearchQuery = '';
	}

	var showSimpleToast = function() {
	    $mdToast.show(
	      $mdToast.simple()
	        .textContent('Simple Toast!')
	        .position('right')
	        .hideDelay(3000)
	    );
	  };

	$scope.groupUrl = window.location.hash.replace('#/groups/', '');

	$scope.getPostsFromSUser = function(user_id) {
		$scope.isLoading = true;
		$http.get('/api/users/'+user_id+'/posts').success(function(response){
			$scope.thisUsersPosts = response;
		});
		$http.get('/api/users/'+user_id).success(function(response){
			$scope.thisUsersInfo = response;
			console.log($scope.thisUsersInfo)
			$scope.isLoading = false;
		});
	}

	$scope.searchAll = function() {
		$scope.isLoading = true;
		$http.get('/api/users/').success(function(response){
			$scope.queryUsers = response;
			$scope.isLoading = false;
		});
		$http.get('/api/posts/').success(function(response){
			$scope.queryPosts = response;
			console.log($scope.queryPosts)
			$scope.isLoading = false;
		});
		$http.get('/api/groups/').success(function(response){
			$scope.queryGroups = response;
			$scope.isLoading = false;
		});
	}
	$scope.searchAll();

	$scope.getPostsInGroup = function(group_id) {
		$scope.groupUrl = group_id;
		$http.get('/api/groups/'+group_id+'/posts').success(function(response) {
			$scope.postsWithinGroup = response;
		})
	}

	$scope.refreshPostsInGroup = function(group_id){
		$scope.isLoading = true;
		$http.get('/api/groups/'+group_id+'/posts').success(function(response) {
			$scope.posts = response;
			console.log("scope.posts: " + $scope.posts);
			$scope.isLoading = false;
		});
	}
	$scope.customFullscreen = $mdMedia('sm');
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: '../newpost.ejs',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      fullscreen: $mdMedia('sm') && $scope.customFullscreen
	    });
	     $scope.$watch(function() {
	      return $mdMedia('sm');
	    }, function(sm) {
	      $scope.customFullscreen = (sm === true);
	    });
	}

	$scope.refreshPost = function(){
		$scope.isLoading = true;
		$http.get('/api/posts').success(function(response) {
			$scope.posts = response;
			$scope.isLoading = false;
		});
	}

	var refreshPost = function(){

		$http.get('/api/posts').success(function(response) {
			$scope.posts = response;
			$scope.post = "";
		});
	}
	$scope.getPostss = function(){
		$scope.isLoading = true;
		$http.get('/api/posts').success(function(response) {	
			$scope.posts = response;
			$scope.isLoading = false;
		});
	} 

	var refreshSinglePost = function(post_id){
		$http.get('/api/posts/' + post_id).success(function(response) {
			
			$scope.post = response;
		});
	}
	var refreshGroup = function(){
		$http.get('/api/groups').success(function(response) {
			console.log('Refreshed groups, and I have the response');
			$scope.groups = response;
			$scope.group = "";
		});
	}
	var refreshSingleGroup = function(group_id){
		$http.get('/api/groups/' + group_id).success(function(response) {
			
			$scope.group = response;
		});
	}

	refreshGroup();
	refreshPost();


	$scope.handleDrop = function(post_id, group_id) {

	    console.log('group Id: ' + group_id)
		$scope.post = groupsInPost.get({ id: post_id }, function() {
			var array = $scope.post.group;
			var index = array.indexOf(group_id);

			if (index > -1) {
		  		array.splice(index, 1);
		  		
		  		
		  		console.log('group removed');

			} else {
				$scope.post.group.push(group_id);
				
				console.log('group added');
				console.log('group Id: ' + group_id);
				
			}


		  $scope.post.$update(function() {
		    // updated in the backend
		  });
		  refreshPost();
		});
	};

	$scope.getGroup = function(group_id, group_name, fn) {
		$scope.groupSearch = group_id;
		$scope.groupName = group_name;
		if(fn) {
			fn(group_id);
		}
		
	}
	$scope.showRemovePost = {};
	$scope.hideGroups = {};
	$scope.hideGroups.active = true;

	$scope.hideAllGroups = function() {
		$scope.hideGroups.active = false;
	}
	$scope.showRemoveGroup = function(group_id) {
		$scope.showRemovePost.active = true;
		$scope.showRemovePost.group = group_id;
	}
	$scope.hideRemoveGroup = function() {
		$scope.showRemovePost.active = false;
		$scope.hideGroups.active = true;
	}

	$scope.focusInput = function() {
		$scope.$broadcast('newItemAdded');
	}
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

	$scope.mobile = function(){
		if(/Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return true;
		} else {
			return false;
		}
	}


	$scope.addPost = function() {
		//$scope.post.url = parenturl;
		console.log($scope.post._id);
		
		$http.post('/api/posts', $scope.post).success(function(response){
			refreshPost();
			showSimpleToast();
			//$scope.post = {url: parenturl}
		});
		 
	};



	$scope.remove = function(id) {
		$scope.isLoading = true;
		console.log(id);
		$http.delete('/api/posts/' + id).success(function(response) {
			refreshPost();
			$scope.isLoading = false;
		});
	};

	$scope.edit = function(id){
		console.log(id);
		$http.get('/api/posts/' + id).success(function(response) {
			$scope.post = response;
		});
	};


	$scope.addToGroup = function(post_id, group_id) {

		console.log('group Id: ' + group_id)
		$scope.post = groupsInPost.get({ id: post_id }, function() {
			var array = $scope.post.group;
			var index = array.indexOf(group_id);

			if (index > -1) {
		  		array.splice(index, 1);
		  		console.log('group removed');
		  		refreshPost();
		  		refreshGroup();
			} else {
				$scope.post.group.push(group_id);
				console.log('group added');
				console.log('group Id: ' + group_id);
				refreshPost();
				refreshGroup();
			}


		  $scope.post.$update(function() {
		    // updated in the backend
		  });
		});
	};
	$scope.removeFromGroup = function(post_id) {
		var favorite = $scope.favorite;
		$scope.post = groupsInPost.get({ id: post_id }, function() {

		  var array = $scope.post.group;
		  var index = array.indexOf(favorite);

		  if (index > -1) {
			  array.splice(index, 1);
		  }
		  $scope.post.$update(function() {
		    // updated in the backend
		  });
		});
	};
	$scope.readLater = function(post_id) {
		$scope.isLoading = true;
		$scope.post = groupsInPost.get({ id: post_id }, function() {
		  $scope.post.readlater = true;
		  console.log('added to readLater')
		  console.log($scope.post.readlater)
		  $scope.post.$update(function() {
		    refreshPost()
		    $scope.isLoading = false;
		  });
		});
	}
	$scope.markAsRead = function(post_id) {
		$scope.isLoading = true;
		$scope.post = groupsInPost.get({ id: post_id }, function() {
		  $scope.post.readlater = false;
		  console.log('marked as read')
		  $scope.post.$update(function() {
		    refreshPost()
		    $scope.isLoading = false;
		  });
		});
	}
	$scope.favoritePost = function(post_id) {
		$scope.isLoading = true;
		$scope.post = groupsInPost.get({ id: post_id }, function() {
		  $scope.post.favorite = true;
		  console.log('added to favorites')
		  $scope.post.$update(function() {
		    refreshPost()
		    $scope.isLoading = false;
		  });
		});
	};
	$scope.removeFavorite = function(post_id) {
		$scope.isLoading = true;
		$scope.post = groupsInPost.get({ id: post_id }, function() {
		  $scope.post.favorite = false;
		  console.log('removed from favorites');

		  $scope.post.$update(function() {
		    refreshPost()
		    $scope.isLoading = false;
		  });
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


	$scope.removeUser = function(id) {
		console.log(id);
		$http.delete('/api/users/' + id).success(function(response) {
			//refreshuser();
		});

		return false;
	};

	$scope.editUser = function(id){
		console.log(id);
		$http.get('/api/users/' + id).success(function(response) {
			$scope.user = response;
		});
	};

	$scope.updateUser = function() {
		console.log($scope.user.id);
		$http.put('/api/users/' + $scope.user._id, $scope.post).success(function(response) {
			refreshUser();
		});
	};


/* ================================ */

	$scope.filterGroup = function(id){
		$scope.queryPosts = id;
	}
	

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

	$scope.addGroup = function(groupName) {
		$scope.group = {name: groupName};

		$http.post('/api/groups', $scope.group).success(function(response){
			refreshGroup();
			console.log("$scope.group.name.val: " + $scope.group.name);
		});
		console.log($scope.group)
		 
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

function DialogController($http, $scope, $mdDialog) {
	var refreshPost = function(){

		$http.get('/api/posts').success(function(response) {
			$scope.posts = response;
			$scope.post = "";
		});
	}
	$scope.addPost = function() {
		//$scope.post.url = parenturl;
		console.log($scope.post._id);
		
		$http.post('/api/posts', $scope.post).success(function(response){
			refreshPost();
			//$scope.post = {url: parenturl}
		});
		 
	};
	  $scope.hide = function() {
	    $mdDialog.hide();
	  };
	  $scope.cancel = function() {
	    $mdDialog.cancel();
	  };
	  $scope.answer = function(answer) {
	    $mdDialog.hide(answer);
	  };
}
myApp.controller('groupController', function($http, $scope) {

	$scope.refreshPostsInGroup = function(group_id){
		$http.get('/api/groups/'+group_id+'/posts').success(function(response) {
			$scope.posts = response;
			console.log("scope.posts: " + $scope.posts);
		});

	}
	refreshPostsInGroup(group_id);

});


