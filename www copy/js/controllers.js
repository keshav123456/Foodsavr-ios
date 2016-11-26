angular.module('starter.controllers', [])
		
.controller('AppCtrl', function($scope, $state,$ionicModal, $timeout,$http, fbFactory ) {

//$scope.items = fbFactory.getItems(); 
  
})  // end of AppCtrl

.controller('homeCtrl', function($scope, $state, $stateParams, $ionicModal, $timeout,$http, fbFactory, $ionicPlatform ) {

//console.log("in home controller");  
//console.log($stateParams);

$scope.gotoState = function (gotostate) {
	   //console.log("goto state= "+gotostate);
if (gotostate == 1){$state.go('app.login');} 
else if (gotostate ==2){$state.go('app.eujustlist');}
else if (gotostate ==3){$state.go('app.home');}};

//disable back button 29 sep & added $ionicPlatform injection in the function definition of home controller
$ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == "app.home") {navigator.app.exitApp();} else { navigator.app.backHistory();}
},100); //end of disable backbutton  29 sep


})	  // end of homeCtrl


.controller('justlistCtrl', function($scope, $rootScope, $ionicModal, $http, fbFactory ) {
$scope.items = fbFactory.getItemsFILO();   
console.log("items in just list controller "+$scope.items); 

 $ionicModal.fromTemplateUrl('image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    }); //end of $ionicmodal 


 $scope.showDetails = function(thing){
 	    console.log("in showDetails"+thing.prod);
 	    $scope.pic = thing.pic;
        $scope.modal.show();
  };//end of show details

 $scope.closeModal = function() {
    $scope.modal.hide();
 };

})  // end of justlistCtrl



//firebase, FURL, $rootScope, $ionicModal, $http, Items, $firebaseObject, $firebaseAuth,
.controller('loginCtrl', ['$scope','fbFactory','$state','$rootScope', function($scope, fbFactory, $state,$rootScope) {
	
	console.log("login  controller ", fbFactory);
	
	$scope.doLogin = function(){ 
	
		//console.log("login  controller "+ this.username +" ", fbFactory);
		
		var user ={email: this.username, password : this.password };
		
		//login(user)
		fbFactory.login(user).then
		    (function(response){
				     //login successfull reponse handling below  
					 //21 sep checking if local data has suppliername then no need to call getsuppliername via singleitem fetch
                if (user.email == $rootScope.email)
                    {
                    	//suppliername read from localstorage  no need to prSingleItem.
			        	$state.go('app.broadcast');			            			         
			        } else {
			        	    
                        var  prSingleItem;
			            //calling getSingleitem to key supplier name based on email key
			            prSingleItem = fbFactory.getSingleItem(response.email);
			                    prSingleItem.then(function (response) {
			                                 $rootScope.suppliername = response;
			                                 $scope.suppliername = response;
			                                 console.log("in controller suppliername = "+$rootScope.suppliername);
			                                 //console.log("in controller email = "+user.email);			                                
			                                 //21 sep for local storage
			                                 localStorage.setItem("suppliername",$rootScope.suppliername);
		   	                                 localStorage.setItem("email",user.email);
		   	                                 localStorage.setItem("password",user.password);
		   	                                 //21 sep for local storage			                          
			                                 $state.go('app.broadcast');
			                           },function(response) {
			                                  alert('Failed E001: ' + response);
			                           });			             

			            };
		   }).catch(function(error){
			           console.log('fbFactory.login', error);
			           alert('Error'+ error.message);
			
		           });

    }; // end of doLogin

	
}])  // end of loginCtrl


.controller('cameraCtrl', function($scope, $rootScope,Camera, fbFactory, Items, $cordovaFile, $state,$ionicScrollDelegate) {
 
    
    $scope.items = fbFactory.getItems();   
	
	
	$scope.useremail = $rootScope.useremail;
	
	//console.log('useremail in broadcast controller'+$scope.useremail);
	
    $scope.desc = "";
      
    //$scope.urlForImage = function(imageName) {
    //console.log("get correct path for image");
    //}

   $scope.takePicture = function (options) {
	   //console.log("INSIDE take pic option setting	");
	   //alert("inside take pic");
   
		var options = {
			quality : 100,
			targetWidth: 600,
			targetHeight: 300,
			sourceType: 1,
			destinationType:0, //data urlForImage
			//destinationType:1, // fire urlForImage
            allowEdit:false,	
			encodingType:0, //jpeg
			SaveToPhotoAlbum:false
		};  // end of options setting

		
	  /************ use this for imageData **********/
      //console.log('before camera get picture');
	  //alert("before camera get pic");
	  
	  Camera.getPicture(options).then(function(imageData) {   
        $scope.picture = imageData;
        $ionicScrollDelegate.resize();
      }, function(err) {
         console.log(err);
      });
 }; // end of take picture
 
  
  $scope.sendPicture = function() {
      $scope.items = fbFactory.getItems();
      	  var tempdate = -1 * Date.now();
      	  var user ={location: this.location};
  
      //alert("$scope.desc in send picture "+ $scope.desc +"**"+$scope.storeloc+"***"+$scope.discount+"***"+$scope.suppliername);
	  $scope.items.$add({'pic':$scope.picture,'prod':$scope.desc,'discount':$scope.discount,'storeloc':$scope.storeloc,'suppliername':$scope.suppliername,'datetime':tempdate});
	  //alert("sending image");
	  //localStorage.setItem("location",user.location);
      //$scope.copy3 = angular.fromJson($scope.copy2);
	  $state.go('app.justlist');
    }
	
});// end of Camera Controller	
