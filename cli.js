#!/usr/bin/env node

var cmd = process.argv[2];

if (cmd == "watch")
{
	var Watch = require("./watch.js");
	var app = new Watch.App( process.cwd() );
	app.loadConfig();
	app.run();
}

else
{
	console.log( "Type " + process.argv[1] + " watch" );
	console.log( "" );
}