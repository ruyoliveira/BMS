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
user.prototype.save_user = function(user_name){
	var databaseUrl = "BMS"; // "username:password@example.com/mydb"
	var collections = ["users"];//set the collections used in the DB, necessary to manage db the same way its managed in mongodb
	var db = require("mongojs").connect(databaseUrl, collections);//start connection, setting the dbs and collections that mongojs will use
	db.users.save({name:user_name,email: "adm@bms.com", password: "111111", sex: "male"}, function(err, saved) {
	  		if( err || !saved ) console.log("User not saved");
			else console.log("User"+user_name+ "saved");
	});
	
}
user.prototype.load_user = function(user_name){
	var databaseUrl = "BMS"; // "username:password@example.com/mydb"
	var collections = ["users"];//set the collections used in the DB, necessary to manage db the same way its managed in mongodb
	var db = require("mongojs").connect(databaseUrl, collections);//start connection, setting the dbs and collections that mongojs will use
	db.users.find({name:user_name},function(err, users_found) {
		if( err || !users_found) console.log("No user called '"+user_name+"' found");
		else {
			//In case that are more than one user with the same name, return the first result
			if(users_found.length>1) {
				console.log(users_found[0]);
				return users_found[0];
				
			}
			//In the other case, return the result
    			else{
    				console.log(users_found);
    				return users_found;
    			}
  		}
	});
}
user.prototype.load_all_users = function(){
	var databaseUrl = "BMS"; // "username:password@example.com/mydb"
	var collections = ["users"];//set the collections used in the DB, necessary to manage db the same way its managed in mongodb
	var db = require("mongojs").connect(databaseUrl, collections);//start connection, setting the dbs and collections that mongojs will use
	db.users.find(function(err, users_found) {
	if( err || !users_found) console.log("No users found");
		else users_found.forEach( function(single_user_found) {
    			console.log(single_user_found);
  		});
	});
}

module.exports = user;

