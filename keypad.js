// Keypad.js
var User = require("./BMS/server/bms/User.js");
var password_buffer='';
var port = process.argv[2];
var serialport = require('serialport');

var sp = new serialport.SerialPort(port, {
                baudrate: 9600,
                parser: serialport.parsers.readline('\r\n')});

sp.on('data', function(line) {
    
    console.log(line[0]);
    password_buffer=password_buffer+line[0];
    
    if(password.length>4){
    	if(password=="11111"){
    		console.log("Password CORRECT!");
    		
    		}
    	else{
    		console.log("Password Incorrect");
    	}
    	password='';
    }
    
});
