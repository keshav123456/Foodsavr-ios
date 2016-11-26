angular.module('starter.controllers').factory('fbFactory', function(FURL, $log, $q, $firebaseAuth, $firebaseArray, $firebaseObject) {


console.log("Init fb facotyr here ", this);
	//var ref = new Firebase(FURL);

	  firebase.initializeApp(FURL);
	//var auth = $firebaseAuth(ref);
  var ref = firebase.database().ref();
  //var auth = $firebaseObject(ref);
  var auth = $firebaseAuth();

	var fbFactory = {
		user: {},

    login: function(user) {
	  itemsRef = firebase.database().ref('/items');
	  var itemArray = $firebaseArray(itemsRef);
      auth.$signInWithEmailAndPassword(user.email, user.password);
	  //return(itemsRef);
	  return auth.$signInWithEmailAndPassword(user.email, user.password);
	  //var checkitem = $firebaseArray(firebase.database().ref().child('items'));
	  //console.log("firebase array "+ checkitem);
	  //return;
    },
    createProfile: function(uid, user) {
      var profile = {
				id: uid,
        email: user.email,
				registered_in: Date()
      };

      // If you want insert more data should modify register.html and modify your object.

      
      var messagesRef = $firebaseArray(firebase.database().ref().child("users"));
      messagesRef.$add(profile);
      $log.log("User Saved");
    },
	
	getItems : function(){
		var ref = firebase.database().ref().child("/items");
		return $firebaseArray(ref);
 
	},

  getItemsFILO : function(){
  var ref = firebase.database().ref().child("/items").orderByChild("datetime");
  return $firebaseArray(ref);
 
  },

	    getSingleItem : function(itemid) {
	    console.log("itemid in getSingleItem"+itemid);
        var deferred = $q.defer();
        var temp = itemid;
            temp = temp.replace("@","at");
            temp = temp.replace(".","dot"); 
            temp = temp.replace(".","dot");
           
      console.log('in fbFactory for singleitem '+itemid+" converted string "+temp);
      var ref = firebase.database().ref().child("/items").child(temp);
      var refvalue ="";
           ref = ref.once("value").then(
                                function(snapshot){
                                       refvalue = snapshot.val();
                                       console.log(refvalue);
                                       deferred.resolve(refvalue);      
                                       //return(refvalue);
                                    }, 
                                 function (errorObject) {
                                         console.log("The read failed: " + errorObject.code);
                                         deferred.reject(errorObject.code);
                                         //return (errorObject.code);
                                     });
                    //return;
                  return deferred.promise;
         },  //end of getSingleItem

    register: function(user) {
      return auth.$createUserWithEmailAndPassword(user.email, user.password)
        .then(function(firebaseUser) {
          console.log("User created with uid: " + firebaseUser.uid);
          Auth.createProfile(firebaseUser.uid,user);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    logout: function() {
      auth.$signOut();
			console.log("Usuario Sale.");
    },

		resetpassword: function(email) {
			return auth.$sendPasswordResetEmail(
				  email
				).then(function() {
					//Utils.alertshow("Exito.","La clave fue enviada a su correo.");
				  //console.log("Password reset email sent successfully!");
				}).catch(function(error) {
					//Utils.errMessage(error);
				  //console.error("Error: ", error.message);
				});
    },

		changePassword: function(user) {
			return auth.$changePassword({email: user.email, oldPassword: user.oldPass, newPassword: user.newPass});
		},

    signInWithProvider: function(provider) {
      return Auth.signInWithPopup('google');
    }
	};
	
	console.log("Returning ", fbFactory);
	return fbFactory;

});
/*********
.factory('Items', ['$firebaseArray', function($firebaseArray,$firebaseObject) {
  var rootRef = firebase.database().ref();
  var fbRef =  rootRef.child('items');
  console.log("items object in factory = "+ fbRef);
  return $firebaseArray(fbRef);
}]);
***********/