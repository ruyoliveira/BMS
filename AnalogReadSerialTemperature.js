// AnalogReadSerial.js <port>
var port = process.argv[2];
var serialport = require('serialport');
var value = '';
var currentValue = '';
var valueInit = parseFloat(value);
var user_temperature='23.00';
// Inclusion de Mongoose
var mongoose = require('mongoose');


/*var sp = new serialport.SerialPort(port, {
                baudrate: 9600,
                parser: serialport.parsers.readline('\r\n')});

sp.on('data', function(line) {
    console.log(line);
});*/

var temperature = new serialport.SerialPort(port, {
			baudrate: 9600,
			parser: serialport.parsers.readline('\r\n')});

mongoose.connect('mongodb://localhost/BMS', function(err) {
  if (err) { throw err; }
});

// Création du schéma pour les temperatures
var temperatureSchema = new mongoose.Schema({
  name : String,	
  temperature : String,
  date : { type : Date, default : Date.now }
});

// Création du Model pour les temperatures
var temperatureModel = mongoose.model('temperatures', temperatureSchema);


  
temperature.on ('data', function(line) {

	
	for ( i = 0; i<5; i++) {
		value = value + line [i];
		
	}
	currentValue = value;
	if(parseFloat(currentValue)-parseFloat(user_temperature)>0.5){
		    		//Write to serial port the '97' flag to indicate 'password correct'
	    			temperature.write('a', function(err, results) {
	    			if(err){ 
	    			console.log('err ' + err);
	    			}
	    			console.log('Envoye a ');
	 		 });  
	 		//end write to serial port
			console.log("Password CORRECT!");
	}
	else{
		    			//Write to serial port the '98' flag to indicate 'password incorrect'
		    			temperature.write('b', function(err, results) {
	    						if(err){ 
	    							console.log('err ' + err);
	    						}
	    						console.log('Envoye b');
	 				 });
	 				 //end write to serial port
	 				 console.log("Password Incorrect");  
		    	}
	
	console.log('Valeur courante: ' + currentValue);
	console.log('Valeur precedente: ' + valueInit);
	// On crée une instance du Model
		var temp = new temperatureModel ();
		temp.temperature = currentValue;
		temp.name = "LastEntry";
		// On le sauvegarde dans MongoDB (seulement si la temperature courante est superieure a la temperature precedente)
		if ((parseFloat(currentValue) - parseFloat(valueInit) ) >= 0.02) { 

			var conditions = {name:temp.name}
  			, update = { temperature: currentValue,date:temp.date }
  			, options = { upsert: true };

  			temperatureModel.findOneAndUpdate(conditions,update,options,function(err,nAffected){
  					if(err) console.log('ERROR ON TEMPERATURE UPDATE');
  					//console.log('nAffected ='+nAffected);
  			});

		}

	valueInit= parseFloat(value);
	value = '';
});



