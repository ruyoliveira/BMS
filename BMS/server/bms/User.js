//Wont stay here in the near future
var mongoose = require('mongoose');

//---------------------------------


var user = function() {
	
	this.name="hahah";
	this.password="haho";
	this.userPreference="hahe";
};	
user.createUser= function (name, pwd) {
		
		this.name = name;
		this.password = pwd;
		
	};
	
user.changeName = function(name) {
		

		
	};
	
user.changePassword= function (pwd) {
		
	};
	
user.setUserPreference = function(name, pwd, userPref) {
		
	};
//Will be modified, because the method to do this task will be in a module called db_manager, though the method load()
user.prototype.load_user = function(name){
	mongoose.connect('localhost', 'BMS');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', function callback () {
  		var userSchema = mongoose.Schema({
    						name: String,
    						password: String
					});

		var UserModel = mongoose.model('UserModel', userSchema);
		var adm = new UserModel({ name: 'ADM' ,password:'11111'});
	
		adm.save(function (err, adm) {
	  		if (err){
	  			console.log("error : function adm.save()");
	  		}
	  		console.log("Saved")
	  		
		});
	
		UserModel.find(function (err, users) {
	  		if (err){
	  			console.log("error : function UserModel.find()");
	  		} 
	  		console.log(users)
		});

	});
	
}

module.exports = user;

