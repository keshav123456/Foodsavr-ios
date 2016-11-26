// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//tsk added firebase
 //var fb = null;

angular.module('starter', ['ionic','ngCordova','firebase','starter.controllers','ngStorage'])

	// Changue this for your Firebase App URL.
.constant('FURL', {
     apiKey: "AIzaSyArQQLXStQRMemST2vYc9CCyoiQvAczTqQ",
    authDomain: "ionic-trial.firebaseapp.com",
    databaseURL: "https://ionic-trial.firebaseio.com",
    storageBucket: "ionic-trial.appspot.com"})

.run(function($ionicPlatform,$rootScope, fbFactory) {
  $ionicPlatform.ready(function() {
    
   // add global variables here such as head and footer - bakery name etc
   // reading localstorage data 21 sep
   //$rootScope.bakerName = "Montano Bakers";

   if (window.localStorage){

    

      // pls do not change the order the supplier name is tied to email
    $rootScope.email = localStorage.getItem("email");
      $rootScope.username = $rootScope.email;
      $rootScope.suppliername = localStorage.getItem("suppliername");
      $rootScope.password = localStorage.getItem("password");
    
      console.log("suppliername from localStorage is "+$rootScope.suppliername);
      console.log("email from localStorage is "+$rootScope.email);
      

   }
  // reading localstorage data 21 sep

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
	console.log("Checking fbFactory", fbFactory);
	
  });	
  
  //aug 28
     var deviceInformation = ionic.Platform.device();
     var isAndroid = ionic.Platform.isAndroid();
	   console.log ("app.js client is android "+isAndroid);
  
})

.factory('Items', [ function(){
	return [];
}])

/*
.factory('Items', ['$firebaseArray', function($firebaseArray) {
  var fbRef = new Firebase('https://ionic-trial.firebaseio.com/items');
  console.log("fbRef in Items factory = "+fbRef);
  //firebase.initializeApp(FURL);
  return $firebaseArray(fbRef);
}])
*/

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider	
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('app.broadcast', {
    url: '/broadcast',
    views: {
      'menuContent': {
        templateUrl: 'templates/broadcast.html',
		controller: 'cameraCtrl'
     }
    }
  })
 
 .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('app.eujustlist', {
    url: '/eujustlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/eujustlist.html',
        controller: 'justlistCtrl'
      }
    }
  })

 .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })
   
 .state('app.justlist', {
    url: '/justlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/justlist.html',
        controller: 'justlistCtrl'
      }
    }
	
  });  

$urlRouterProvider.otherwise('/app/home');
})

.config(function($ionicConfigProvider) {
  //aug 28
     var deviceInformation = ionic.Platform.device();
     var isAndroid = ionic.Platform.isAndroid();
  
     if (isAndroid) {$ionicConfigProvider.tabs.position('bottom');
	  console.log("tab position set for android");	}
  // this is required for the tabs menu to appear in the bottom for andriod
})

// Return imageDATA --- creating a camera service that will return a promise object q - the service uses the camera plugin via the angular factory 	
.factory('Camera', function($q) {

   return {
      getPicture: function(options) {
         var q = $q.defer();

           navigator.camera.getPicture(function(result) {
            q.resolve(result);
			}, function(err) {
            q.reject(err);
         }, options);
		 
         return q.promise;
      }
   }

});
