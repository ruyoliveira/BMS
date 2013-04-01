// Keypad.js
var user = require("./BMS/server/bms/User.js");
var adm_unlocker= new user();
var password_buffer='';
adm_unlocker.load_user("adm",function(err,user_found){
			if(err||!user_found) console.log("ERROR: Not possible to loggin as 'adm'");
			adm_unlocker = user_found[0];
			console.log("Logged as '"+adm_unlocker.name+"'\nEnter your password:\n");
			main_keypad();
								
			}
	);

function main_keypad(){
	var port = process.argv[2];
	var serialport = require('serialport');

	var sp = new serialport.SerialPort(port, {
		        baudrate: 9600,
		        parser: serialport.parsers.readline('\r\n')
		        });

	sp.on('data', function(line) {
	
	    	
		console.log(line[0]);
	    	password_buffer=password_buffer+line[0];
	    
	    	if(password_buffer.length>4){
	    		if(password_buffer==adm_unlocker.password){
	    			console.log("Password CORRECT!");
	    		
	    		}
	    		else{
	    		console.log("Password Incorrect");
	    	}
	    	password_buffer='';
	    }
	    
	});
}