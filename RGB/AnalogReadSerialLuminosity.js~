// AnalogReadSerial.js <port>
var port = process.argv[2];
var serialport = require('serialport');
var value = '';
var currentValue = '';
var valueInit = parseFloat(value);
//var user = require("./BMS/server/bms/User.js");
//var user= new user();
// Inclusion de Mongoose
var mongoose = require('mongoose');




var luminosity = new serialport.SerialPort(port, {
			baudrate: 9600,
			parser: serialport.parsers.readline('\r\n')});

mongoose.connect('mongodb://localhost/BMS', function(err) {
  if (err) { throw err; }
});
// var qry = {internalLuminosity:user.prefer.getInternalLuminosity()};

// Création du schéma pour la luminosité
var luminositySchema = new mongoose.Schema({
  luminosity : String,
  
  date : { type : Date, default : Date.now }
});

// Création du Model pour la luminosité
var luminosityModel = mongoose.model('luminosity', luminositySchema);



  
luminosity.on ('data', function(line) {
	if((line=="97") || (line == "98")){
		return;
	}

	


	for ( i = 0; i<3; i++) {
		value = value + line [i];
		
	}
	// console.log(value);
	currentValue = value;
	console.log('Valeur courante: ' + parseFloat(currentValue));
	console.log('Valeur precedente: ' + valueInit);
	// On crée une instance du Model
		var lum = new luminosityModel ();
		lum.luminosity = currentValue;
		
		// On le sauvegarde dans MongoDB (seulement si la luminosite courante est inferieure a la luminosite precedente ou si celle-ci est superieure a la precedente)
		if ((parseFloat(currentValue) < valueInit ) || (parseFloat(currentValue) < valueInit ) ) { 
			lum.save(function (err) {
  			if (err) { throw err; }
  				console.log('Luminosité ajoutée avec succès !');
			if (parseFloat(currentValue) > 300) /* (parseFloat(currentValue) < qry) */ {
				luminosity.write('a', function(err, results) {
				if(err){
					console.log('err ' + err);
					console.log('results ' + results);
				}
			});
			}
				else{
					//Write to serial port the '98' flag to indicate 'high luminosity'
					luminosity.write('b', function(err, results) {
					if(err){
						console.log('err ' + err);
						console.log('results ' + results);
					}
				});
			} 
			
		
				
		

		// On se déconnecte de MongoDB maintenant
  		// mongoose.connection.close();

		});
		}

	valueInit= parseFloat(value);
	value = '';

});



