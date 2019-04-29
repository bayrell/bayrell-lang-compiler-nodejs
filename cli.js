#!/usr/bin/env node

var cmd = process.argv[2];

if (cmd == "watch")
{
	var App = require("./app.js");
	var app = new App.App( process.cwd() );
	if (app.loadConfig())
	{
		app.watch();
	}
}

else
{
	console.log( "Type " + process.argv[1] + " watch" );
	console.log( "" );
}