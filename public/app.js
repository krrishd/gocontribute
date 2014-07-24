var app = angular.module('goContribute', ['ui.router', 'gist', 'hc.marked']);

app.config(function($stateProvider, $locationProvider) {
	$stateProvider
		.state('about', {
			templateUrl: '/views/about.html',
			controller: aboutCtrl,
			url: '/about'
		})
		.state('choose', {
			templateUrl: '/views/choose.html',
			controller: mainCtrl,
			url: '/'
		})
		.state('list', {
			templateUrl: '/views/list.html',
			controller: listCtrl,
			url: '/top/:lang/:stars/:activity/:contributors/:issues'
		})
		.state('stats', {
			templateUrl: '/views/stats.html',
			controller: statsCtrl,
			url: '/stats'
		});

	$locationProvider.html5Mode(true);
});

function mainCtrl($scope, $http, $rootScope) {
	$rootScope.title = 'goContribute - Home';
	$rootScope.loading = false;
	$scope.lang = 'JavaScript';
	$http.get('/languages')
		.success(function(data) {
			$scope.languages = data;
			$rootScope.loading = false;
		});
};

function aboutCtrl($scope, $rootScope, $http) {
	$rootScope.loading = true;
	$rootScope.title = 'goContribute - About'
	$http.get('https://cdn.rawgit.com/krrishd/59503c11673f06e97e9c/raw/abf3278d87182beb171af772ab1048a4bdc37849/how-gocontribute-works.markdown')
		.success(function(data) {
			$scope.article = data;
			$rootScope.loading = false;
		});
}

function listCtrl($scope, $http, $rootScope, $stateParams) {
	$scope.infoHover = false;
	$rootScope.title = 'goContribute - Top 10 Repos in ' + $stateParams.lang + ' to contribute to.';
	$rootScope.loading = true;
	$scope.round = Math.round;
	var url = '/api/custom/' + $stateParams.lang + '/' + $stateParams.stars + '/' + 
			$stateParams.activity + '/' + $stateParams.contributors + '/' +
			$stateParams.issues;
	$scope.info = function(state) {
		if(state === true) {
			$scope.infoHover = true;
		} else {
			$scope.infoHover = false;
		}
	};
	$http.get(url)
		.success(function(data) {
			$scope.repos = data;
			if($scope.repos.length === 0) {
				$scope.none = true;
			}
			$rootScope.loading = false;
		});
	$scope.save = function(repo) {
		localStorage.repo = JSON.stringify(repo);
	}
}

function statsCtrl($scope, $rootScope) {
	if(localStorage.repo) {
		$scope.repo = JSON.parse(localStorage.repo);
		$rootScope.title = 'goContribute - ' + $scope.repo.name;
	} else {
		window.location = '/';
	}
}
