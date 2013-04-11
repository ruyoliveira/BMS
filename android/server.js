
var http = require("http");
var url = require("url");
var fs = require("fs");
var path    =   require('path');
 

function start(route, handle) {
function onRequest(request, response) {
        var postData = "";
		var pathname = url.parse(request.url).pathname;
		//console.log("Request for " + pathname + " received.");
	 

request.setEncoding("utf8");		
		
// called when a new chunk of data was received
request.addListener("data", function(postDataChunk) {
   
	postData += postDataChunk;
 
});



// called when all chunks of data have been received
request.addListener("end", function() {
         
         if(postData == "" && pathname != "/"){
         		postData = pathname;
         		pathname = "/"+path.extname(pathname).toLowerCase();
         }
         console.log(postData);
		 route(handle, pathname, response, postData);
});

}	


http.createServer(onRequest).listen(8888);

}

exports.start = start;

