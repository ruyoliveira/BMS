var querystring = require("querystring"),
fs = require("fs"); 

var databaseUrl = "BMS"; 
var collections = ["users","temperatures","luminosities","distances"];
var numberPeople = 0;
 
function start(response, postData) {
        console.log("connected");
        //createDB();
       	 fs.readFile(__dirname+"/www/index.html","utf-8", function(error, file) {
			if(error) {
			response.writeHead(500, {"Content-Type": "text/html"});
			response.write(err + "\n");
			response.end();
			} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf-8");
			response.end();
			}
		});
}

function createDB (){
     var db = require("mongojs").connect(databaseUrl, collections);
     
     db.createCollection("temperatures", { temperature: "10" });
     
     db.createCollection("luminosities", { luminosity: "100" });
     
     db.createCollection("distances", { people: 0 });
     
     
 }

// modify the user e redirect to login
function preference(response, postData) {
            var user = parseLogin(postData); 
			var db = require("mongojs").connect(databaseUrl, collections);
			
			
			var q = {username: user.getUsername()};
    
			console.log(q);
		    
			db.users.find(q,function (err,users_found){
					if( err || !users_found) {
					console.log("No user called '"+user_name+"' found");
					}else {
						//In case that are more than one user with the same name, return the first result
						if(users_found.length>=1) {
						    user.setPassword(users_found[0].password);
						    user.setFirstName(users_found[0].firstname);
						    user.setLastName(users_found[0].lastname);
						    user.setUsername(users_found[0].username);
							user.prefer.setTemperature(users_found[0].temperature);
							user.prefer.setLuminosity(users_found[0].luminosity);
					    }
				 
					}
		
		   });
			
			var qry = {username: user.getUsername(),firstname: user.getFirstName(), lastname: user.getLastName() ,password:user.getPassword(),temperature:user.prefer.getTemperature(),luminosity:user.prefer.getLuminosity()};
		    console.log("modifying..");
			console.log(qry);
			
			db.users.update({username: user.getUsername()}, {$set:qry}, {multi:true}, function(err) {
   				console.log("modified");
			});
			
	login (1,user,response, postData);
       	 
}

function enter(response, postData){
  
  var user = parseLogin(postData);
  
  loginDb(user,response, postData);
  
}

function login (ok,user,response, postData){
	
  if (ok == 1){
		/**fs.readFile(__dirname+"/www/welcome.html","utf-8", function(error, file) {
			if(error) {
			response.writeHead(500, {"Content-Type": "text/html"});
			response.write(err + "\n");
			response.end();
			} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf-8");
			response.end();
			}
		 });*/
		 var body = getpage(user);
		    response.writeHead(200, {"Content-Type": "text/html"});
			response.write(body, "utf-8");
			response.end();
	}else{
		 fs.readFile(__dirname+"/www/errouser.html","utf-8", function(error, file) {
			if(error) {
			response.writeHead(500, {"Content-Type": "text/html"});
			response.write(err + "\n");
			response.end();
			} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf-8");
			response.end();
			}
		});
	}
}

function newuser(response, postData){
	fs.readFile(__dirname+"/www/newuser.html","utf-8", function(error, file) {
			if(error) {
			response.writeHead(500, {"Content-Type": "text/html"});
			response.write(err + "\n");
			response.end();
			} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(file, "utf-8");
			response.end();
			}
		 });
}

function saveuser(response, postData){
     var user = parseLogin(postData);
	 saveDatabase(user);
	 enter(response, postData);
}


// saparate postData
function parseLogin(postData){
    var str = "";
    var set = "";
    var user = new User();
    
	for (var i = 0; i < postData.length; i++){
	    if(postData[i] == "=" || postData[i] == "&"){
	        if(postData[i] == "="){
	        	set = str;
	        	i++;
	        }if(postData[i] == "&"){
	        	setUser(set,str,user);
	        	i++;
	        }
	        if(postData[i+1] == "&"){
	        	 i++;
	        }
	       
			//console.log(str);
			str="";
		}
		str = str + postData[i];
	}
	return user;
}

function setUser(set,str,user){
	if (set == 'username' ){
		user.setUsername(str);
	}
	if (set == 'firstname' ){
		user.setFirstName(str);
	}
	if (set == 'lastname' ){
		user.setLastName(str);
	}
	if (set == 'password' ){
		user.setPassword(str);
	}
	if (set == 'temperature' ){
		user.prefer.setTemperature(str);
	}
	if (set == 'externalLuminosity' ){
		user.prefer.setExternalLuminosity(str);
	}
	if (set == 'internalLuminosity' ){
		user.prefer.setInternalLuminosity(str);
	}
	if (set == 'luminosity' ){
		user.prefer.setLuminosity(str);
	}
	if (set == 'purify' ){
		user.prefer.setPurify(str);
	}

}

// find the user and redirect to login
function loginDb(user,response, postData){
     
	var db = require("mongojs").connect(databaseUrl, collections);
	 
    var query = {username: user.getUsername()};
    var loginok = 0;
	console.log(query);
    
	db.users.find(query,function (err,users_found){
			if( err || !users_found) {
			console.log("No user called '"+user_name+"' found");
			 login(0,user,response, postData);
			}else {
				//In case that are more than one user with the same name, return the first result
				if(users_found.length>=1) {
				//console.log(users_found[0]);
				if(users_found[0].password == user.getPassword() && users_found[0].username == user.getUsername()){
				    console.log(users_found[0].firstname);
				    user.setFirstName(users_found[0].firstname);
				    user.setLastName(users_found[0].lastname);
				    user.setUsername(users_found[0].username);
					loginok = 1;
				}else{
					login(0,user,response, postData);
				}
				
			
			}
			//In the other case, return the result
			else{
			  login(0,user,response, postData);
			 }
		   }

   });
   
    
   
   db.temperatures.find(function (err,users_found){
           if( err || !users_found) {
			console.log("No user called '"+user_name+"' found");
			 login(0,user,response, postData);
			}else {
				//In case that are more than one user with the same name, return the first result
				user.prefer.setTemperature(users_found[0].temperature);
			}
  
   });	
   
   
   db.luminosities.find(function (err,users_found){
      if( err || !users_found) {
			console.log("No user called '"+user_name+"' found");
			 login(0,user,response, postData);
			}else {
				//In case that are more than one user with the same name, return the first result
				user.prefer.setLuminosity(users_found[0].luminosity);
			}
  
   });	
   
   db.distances.find(function (err,users_found){
      if( err || !users_found) {
			console.log("No user called '"+user_name+"' found");
			 login(0,user,response, postData);
			}else {
				//In case that are more than one user with the same name, return the first result
				numberPeople = users_found[0].people;
				if (loginok == 1){
					login(1,user,response, postData);
				}
			}
  
   });	
  
 
  
 
      
	
}

// save the user in the database
function saveDatabase(user){ 

			var db = require("mongojs").connect(databaseUrl, collections);
			
			//var querySave = {username: user.getUsername(),firstname: user.getFirstName(), lastname: user.getLastName() ,password:user.getPassword(),temperature:user.prefer.getTemperature(),internalLuminosity:user.prefer.getInternalLuminosity(),externalLuminosity:user.prefer.getExternalLuminosity()};
			var querySave = {username: user.getUsername(),firstname: user.getFirstName(), lastname: user.getLastName() ,password:user.getPassword(),temperature:user.prefer.getTemperature(),luminosity:user.prefer.getLuminosity()};
			
			console.log(querySave);
			
			db.users.save(querySave,function (err,saved){
			if( err ) {
			console.log("No saved ");
			}else {
				//In case that are more than one user with the same name, return the first result
				 console.log("saved");
			}
			 
			});
			
			
}


function User (){

	var firstname;
	var lastname;
	var password;
	var username;

	
	this.prefer = new Preference();
	
	this.setFirstName = function (_firstname){
			 firstname = _firstname;
	}
	
	this.getFirstName = function (){
			 return firstname;
	}
	
	
	this.setLastName = function (_lastname){
			 lastname = _lastname;
	}
	
	this.getLastName = function (){
			 return lastname;
	}
	
	this.setPassword = function (_password){
			 password = _password;
	}
	
	this.getPassword = function (){
			 return password;
	}
	
	this.setUsername = function (_username){
			 username = _username;
	}
	
	this.getUsername = function (){
			 return username;
	}
	
}

function Preference (){

	var temperature;
	var externalLuminosity;
	var internalLuminosity;
	var purify;
	var luminosity;
	
	this.setTemperature = function (_temperature){
	       
			 temperature = _temperature;
	}
	
	this.getTemperature = function (){
	         
			 return temperature;
	}
	
	
	this.setExternalLuminosity = function (_externalLuminosity){
			 externalLuminosity = _externalLuminosity;
	}
	
	this.getExternalLuminosity = function (){
			 return externalLuminosity;
	}
	
	this.setInternalLuminosity = function (_internalLuminosity){
			 internalLuminosity = _internalLuminosity;
	}
	
	this.getLuminosity = function (){
			 return luminosity;
	}
	
	this.setLuminosity = function (_luminosity){
			 luminosity = _luminosity;
	}
	
	
	this.getInternalLuminosity = function (){
			 return internalLuminosity;
	}
	
	this.setPurify = function (_purify){
			 purify = _purify;
	}
	
	this.getPurify = function (){
			 return purify;
	}
	
}

// load the css files
function css(response, postData){
 
			  fs.readFile(__dirname+"/css/index.css", function(error, file) {
			
			    if(error) {
			        response.writeHead(500, {"Content-Type": "text/plain"});
			
			        response.write(error + "\n");
			
			        response.end();
			
			    } else {
			        response.writeHead(200, {"Content-Type": "text/css"});
			
			        response.write(file);
			
			        response.end();
			
			    }
			
			  });
}

// load the js files
function js(response, postData){
 
			console.log(postData);
			  fs.readFile(__dirname+"/js"+postData, function(error, file) {
			
			    if(error) {
					console.log("error");
			        response.writeHead(500, {"Content-Type": "text/plain"});
			
			        response.write(error + "\n");
			
			        response.end();
			
			    } else {
					 
			        response.writeHead(200, {"Content-Type": "text/javascript"});
			
			        response.write(file);
			
			        response.end();
			
			    }
			
			  });
}

// return web page with the data of the user
function getpage(user){
	var body = '<html>'+
    '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
        '<meta name="at-detection" content="telephone=no" />'+
        '<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">'+
        '<link rel="stylesheet" type="text/css" href="css/index.css" />'+
        '<title>BMS</title>'+
    '</head>'+
    '<body">'+
        '<script type="text/javascript" src="cordova-2.5.0.js"></script>'+
        '<script type="text/javascript" src="bms.js"></script>'+
        '<script type="text/javascript">'+
        '</script>'+
        '<form action="/preference" method="post"> <table align="center" > '+
        '<input type="hidden" name="firstname" id="firstname" value='+user.getFirstName()+'> </input>'+
        '<input type="hidden" name="lastname" id="lastname" value='+user.getLastName()+'> </input>'+
         '<input type="hidden" name="password" id="password" value='+user.getPassword()+'> </input>'+
         '<input type="hidden" name="username" id="username" value='+user.getUsername()+'> </input>'+
		'<tr><td colspan="3">Building Management System</td><td></td><td></td></tr>'+ 
		'<tr><td></td><td>'+user.getUsername()+'</td><td></td></tr>'+
		'<tr><td></td><td></td><td></td></tr>'+
		'<tr><td>Temperature</td><td>'+
		 ' <input type="text" name="temperature" id="temperature" value='+user.prefer.getTemperature()+'>'+
		'</td><td></td></tr>'+
		'<tr><td>Luminosity</td><td>'+
		  '<input type="text" name="luminosity" id="luminosity" value='+user.prefer.getLuminosity()+'>'+
		'</td><td></td></tr>'+
		'<tr><td>Number of people</td><td>'+
		 ' <input type="text" disabled name="numberPeople" id="numberPeople" value='+numberPeople+'>'+
		'</td><td></td></tr>'+
		'<tr><td><form action="/purify" method="post">'+
		 ' <input type="submit" name="purify" value="Purify Air"> </form>'+
		'</></td><td></td><td></td></tr>'+
		'<tr><td></td><td>'+
		 ' <input type="submit" name="ok" value="OK"> </form>'+
		'</></td><td></td></tr>'+
		'<tr><td></td><td><form action="/" method="post">'+
		 ' <input type="submit" name="logout" value="Logout"></form>'+
		'</></td><td></td></tr>'+
		'</table>'+
    '</body>'+
'</html>';

return body;
}

exports.start = start;
exports.enter = enter;
exports.newuser = newuser;
exports.saveuser = saveuser;
exports.css = css;
exports.js = js;
exports.preference = preference;