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

var distance = new serialport.SerialPort(port, {
			baudrate: 9600,
			parser: serialport.parsers.readline('\r\n')});

mongoose.connect('mongodb://localhost/BMS', function(err) {
  if (err) { throw err; }
});

// Création du schéma pour les distances
var distanceSchema = new mongoose.Schema({
  distance : String,
  people : { type: Number, default : 0},
  
  date : { type : Date, default : Date.now }
});

// Création du Model pour les distances
var distanceModel = mongoose.model('distances', distanceSchema);


  
distance.on ('data', function(line) {

	for ( i = 0; i<3; i++) {
		value = value + line [i];
		
	}
	// console.log(value);
	currentValue = value;
	console.log('Valeur courante: ' + parseFloat(currentValue));
	console.log('Valeur precedente: ' + valueInit);
	// On crée une instance du Model
		var dist = new distanceModel ();
		dist.distance = currentValue;
		if ((parseFloat (currentValue) >0) && (parseFloat (currentValue) < 20))
			dist.people ++;
		else if ((parseFloat (currentValue) >= 20))
			dist.people --;
		
		// On le sauvegarde dans MongoDB (seulement si la distance courante est inferieure a la distance precedente ou si celle-ci est superieure a la precedente)
		if ((parseFloat(currentValue) < valueInit ) || (parseFloat(currentValue) < valueInit ) ) { 
			dist.save(function (err) {
  			if (err) { throw err; }
  				console.log('Distance ajoutée avec succès !');
		
				
		

		// On se déconnecte de MongoDB maintenant
  		// mongoose.connection.close();

		});
		}

	valueInit= parseFloat(value);
	value = '';
});



