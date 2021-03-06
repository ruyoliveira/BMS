// Keypad.js

//Declare required scripts
var user = require("./BMS/server/bms/User.js");

//Variables
var adm_unlocker= new user();
var password_buffer='';
var rfid='';
//Load user from db
adm_unlocker.load_user("adm",function(err,user_found){
			if(err||!user_found) console.log("ERROR: Not possible to loggin as 'adm'");
			adm_unlocker = user_found[0];
			console.log("Logged as "+adm_unlocker.name);
			main_keypad();
								
			}
	);
	
//Main function
function main_keypad(){
	var date;
	var port = process.argv[2];
	var serialport = require('serialport');
	
	var sp = new serialport.SerialPort(port, {
		        baudrate: 9600,
		        parser: serialport.parsers.readline('\r\n')
		        });
	//Open event handler
	sp.on("open", function () {
	
		console.log("serialport: ok"+"\nEnter your password:\n");
		
		//Register data callback, only after serial port opening event;
		sp.on('data', function(line) {
	
			//Identifies if its a arduino led flag(97)
			if(line[0]=="a" || line[0] =="b"|| line[0] =="c"|| line[0] == null){
				return;
			}
			if(line[0]=='R'){//if read RFID flag
			 	rfid='';
			 	for(var i=4;i < 14;i++)
			 	{
			 		if(line[i]=='.'){
			 			rfid=rfid+line[i];
			 			break;
			 		}
			 		rfid=rfid+line[i];
			 		
			 	}
			 	switch(rfid){
			 		case "1364313112":
			 		case ".":
				 		sp.write('c', function(err, results) {//Write to serial port the '99' flag to indicate 'rfid registered'
		    						if(err){ 
		    							console.log('err ' + err);
		    							console.log('results ' + results);
		    						}
		 				 });
		 				break;
			 		
			 	}
			 	
	 			return;  
			
			}
			//Identifies arduino flags
			if(line=="ALARM1"||line=="ALARM2"||line=="ALARM3"||line=="ALARM"){
				date = new Date();
				console.log(line+" happened at:  "+date);
				return;
			}
			if(line=="OFF"){
				console.log("Alarm OFF");
				return;
			}
			if(line=="loading"){
				console.log(".");
				return;
			}
			if(line=="loading"){
				console.log(".");
				return;
			}
			if(line=="opening"){
				console.log("\nOPENING DOOR");
				return;
			}
			if(line=="open"){
				console.log("DOOR OPEN! NOW CLOSING DOOR");
				return;
			}
			
			if(line=="Closed"){
				console.log("DOOR CLOSED.\nEnter your password:\n");
				return;
			}
			
			
			console.log(line);//Print line received from serialport
			password_buffer=password_buffer+line[0];//Adds char read from serialport to buffer reader
		    	
		    	if(password_buffer.length>4){//If buffer reachs size >4 compare string buffered read to admin's password
		    		if(password_buffer==adm_unlocker.password){
		    			
		    			sp.write('a', function(err, results) {//Write to serial port the '97' flag to indicate 'password correct'
	    						if(err){ 
	    							console.log('err ' + err);
	    							console.log('results ' + results);
	    						}
	 				 });  
		    			console.log("Password CORRECT!");
		    		}
		    		else{
		    			console.log(password_buffer);
		    			sp.write('b', function(err, results) {//Write to serial port the '98' flag to indicate 'password incorrect'
	    						if(err){ 
	    							console.log('err ' + err);
	    							console.log('results ' + results);
	    						}
	 				 });
	 				 console.log("Password Incorrect");  
		    	}
		    	password_buffer='';//reset password buffer
		    }
		    
		});
	});
}
