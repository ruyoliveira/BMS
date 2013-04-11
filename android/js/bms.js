
/**function include(file)
{

var script = document.createElement('script');
script.src = file;
script.type = 'text/javascript';
script.defer = true;
script.charset="utf-8";

document.getElementsByTagName('head').item(0).appendChild(script);
	
}

include('cordova-2.5.0.js');*/


function isValid (){
	
	var username = document.getElementById('username');
	var userpassword = document.getElementById('password');
	var msg_erro = '';

	if((username.value == '') || (userpassword.value==''))
		msg_erro = 'complete all fields';

	if(msg_erro == '')
		return true;
	else
		alert(msg_erro);
		
return false;

}


function showAlert() {
	
    navigator.notification.alert(
        'Complete all fields!',  // message
        alertDismissed,         // callback
        'Attention',            // title
        'OK'                  // buttonName
    );
}
 

// add the new user to database
function saveUser(){
    
    var msg_erro = '';

	var username = document.getElementById('username');
	var firstName = document.getElementById('firstname');
	var lastName = document.getElementById('lastname');
	var password = document.getElementById('password');
	
	if((username.value == '') || (password.value=='') || (firstName.value=='') || (password.value==''))
		msg_erro = 'complete all fields';

	if(msg_erro == '')
		return true;
	else
		alert(msg_erro);
		
return false;
	
}
 