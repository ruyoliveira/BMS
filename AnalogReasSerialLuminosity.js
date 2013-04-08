// AnalogReadSerial.js <port>
var port = process.argv[2];
var serialport = require('serialport');
var value = '';
var currentValue = '';
var valueInit = parseFloat(value);
// Inclusion de Mongoose
var mongoose = require('mongoose');




var luminosity = new serialport.SerialPort(port, {
			baudrate: 9600,
			parser: serialport.parsers.readline('\r\n')});

mongoose.connect('mongodb://localhost/bms', function(err) {
  if (err) { throw err; }
});

// Création du schéma pour les distances
var luminositySchema = new mongoose.Schema({
  luminosity : String,
  activity : {type : String, default : 'TV'},
  
  date : { type : Date, default : Date.now }
});

// Création du Model pour les distances
var luminosityModel = mongoose.model('luminosity', luminositySchema);


  
luminosity.on ('data', function(line) {

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
		
		// On le sauvegarde dans MongoDB (seulement si la distance courante est inferieure a la distance precedente ou si celle-ci est superieure a la precedente)
		if ((parseFloat(currentValue) < valueInit ) || (parseFloat(currentValue) < valueInit ) ) { 
			lum.save(function (err) {
  			if (err) { throw err; }
  				console.log('Luminosité ajoutée avec succès !');
		
				
		

		// On se déconnecte de MongoDB maintenant
  		// mongoose.connection.close();

		});
		}

	valueInit= parseFloat(value);
	value = '';
});



