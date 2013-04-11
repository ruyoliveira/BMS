var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

console.log("server running...");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/enter"] = requestHandlers.enter;
handle["/newuser"] = requestHandlers.newuser;
handle["/saveuser"] = requestHandlers.saveuser;
handle["/.css"] = requestHandlers.css;
handle["/.js"] = requestHandlers.js;
handle["/preference"] = requestHandlers.preference;


server.start(router.route,handle);

