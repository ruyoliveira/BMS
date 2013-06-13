// AnalogReadSerial.js <port>
var port = process.argv[2];
var serialport = require('serialport');

var value = '';
var currentValue = '';
var valueInit = parseFloat(value);

var user_temperature='23.00';

// Inclusion de Mongoose
var mongoose = require('mongoose');


//Initialize serialport
var temperature = new serialport.SerialPort(port, {
			baudrate: 9600,
			parser: serialport.parsers.readline('\r\n')});

//Connect to mongodb
mongoose.connect('mongodb://localhost/BMS', function(err) {
  if (err) { throw err; }
});

// Create temperature schema to use in temperature models
var temperatureSchema = new mongoose.Schema({
  name : String,	
  temperature : String,
  date : { type : Date, default : Date.now }
});

// Création du Model pour les temperatures
var temperatureModel = mongoose.model('temperatures', temperatureSchema);


//Data received event from serialport
temperature.on ('data', function(line) {

	//Read serialport vector of character and creates one string
	for ( i = 0; i<5; i++) {
		value = value + line [i];
		
	}
	
	currentValue = value;
	
	//Compares current temperature and user preferencial temperature
	if(parseFloat(currentValue)-parseFloat(user_temperature)>0.5)
	{	    		
		//Write to serial port '97'  to indicate 'turn on fan'
		temperature.write('a', function(err, results) 
		{
			if(err)
			{ 
				console.log('err ' + err);
			}
			console.log('Sent \'turn on Air Conditioning fan \' ');
		});
  		//end write to serial port
	}
	else
	{
		//Write to serial port '98' to indicate 'turn off fan'
		temperature.write('b', function(err, results) {
	    		if(err)
	    		{ 
	    			console.log('err ' + err);
	    		}
	    		console.log('Sent \'turn on Heating fan \' ');
	 	});
	 	//end write to serial port
	}
	
	console.log('Current Temperature value: ' + currentValue);
	console.log('Old temperature value: ' + valueInit);
	
	// Create Temperature Model instance
		var temp = new temperatureModel ();
		temp.temperature = currentValue;
		temp.name = "LastEntry";
		// Save temperature on MongoDB (if current temperature is higher than the old temperature)
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



