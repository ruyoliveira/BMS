// AnalogReadSerial.js <port>
var port = process.argv[2];
var serialport = require('serialport');
var value = '';
var currentValue = '';
var valueInit = parseFloat(value);
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
	if(currentValue>0){
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
	
	console.log('Valeur courante: ' + currentValue);
	console.log('Valeur precedente: ' + valueInit);
	// On crée une instance du Model
		var temp = new temperatureModel ();
		temp.temperature = currentValue;
		temp.name = "LastEntry";
		// On le sauvegarde dans MongoDB (seulement si la temperature courante est superieure a la temperature precedente)
		if ((parseFloat(currentValue) - valueInit ) >= 0) { 
			temp.save(function (err) {
  			if (err) { throw err; }
  				console.log('Temperature ajoutée avec succès !');
		
		
		

		// On se déconnecte de MongoDB maintenant
  		// mongoose.connection.close();

			});
		}

	valueInit= parseFloat(value);
	value = '';
});



