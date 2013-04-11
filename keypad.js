// Keypad.js
var user = require("./BMS/server/bms/User.js");
var adm_unlocker= new user();
var password_buffer='';
adm_unlocker.load_user("adm",function(err,user_found){
			if(err||!user_found) console.log("ERROR: Not possible to loggin as 'adm'");
			adm_unlocker = user_found[0];
			console.log("Logged as "+adm_unlocker.name);
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
	sp.on("open", function () {
		console.log("serialport: ok"+"\nEnter your password:\n");
		//Register data callback, only after serial port opening event;
		sp.on('data', function(line) {
	
		    	//if(line[0]=='t'){return;}
			console.log(line);
			//Identifies if its a arduino led flag(97)
			if(line=="97"){
				return;
			}
		    	password_buffer=password_buffer+line[0];
		    
		    	if(password_buffer.length>4){
		    		if(password_buffer==adm_unlocker.password){
		    			//Write to serial port the '97' flag to indicate 'password correct'
		    			sp.write('a', function(err, results) {
	    						if(err){ 
	    							console.log('err ' + err);
	    							console.log('results ' + results);
	    						}
	 				 });  
	 				//end write to serial port
		    			console.log("Password CORRECT!");
		    		}
		    		else{
		    			//Write to serial port the '98' flag to indicate 'password incorrect'
		    			sp.write('b', function(err, results) {
	    						if(err){ 
	    							console.log('err ' + err);
	    							console.log('results ' + results);
	    						}
	 				 });
	 				 //end write to serial port
	 				 console.log("Password Incorrect");  
		    	}
		    	password_buffer='';
		    }
		    
		});
	});
}
