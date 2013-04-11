var  temperatureSensor=function() {
	
	this.name="";
	this.temperature="";
	this.date="";
};

user.prototype.saveTemperature= function (temperature_name,temperature_value ,temperature_date) {
		
		var databaseUrl = "BMS"; // "username:password@example.com/mydb"
		var collections = ["temperatures"];//set the collections used in the DB, necessary to manage db the same way its managed in mongodb
		var db = require("mongojs").connect(databaseUrl, collections);//start connection, setting the dbs and collections that mongojs will use
		db.users.save({name:temperature_name,temperature=temperature_value,date=temperature_date}, function(err, saved) {
	  			if( err || !saved ) console.log("Temperaturenot saved");
				else{
					this.name=temperature_name;
					this.temperature=temperature_value;
					this.date=temperature_date;
					 console.log("Temperature"+temperature_name+ "saved");
						
				}
		});
		
	};
	

module.exports = user;
