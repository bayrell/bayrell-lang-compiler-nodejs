#!/usr/bin/env node

var App = require("./app.js");
var cmd = process.argv[2];
var app = new App.App( process.cwd() );
if (!app.loadConfig())
{
	process.exit();
}


if (cmd == "watch")
{
	app.watch();
}

else if (cmd == "modules")
{
	for (var i=0; i<app.modules.length; i++)
	{
		console.log(app.modules[i].name);
	}
}

else if (cmd == "make")
{
	var name = process.argv[3];
	if (name == undefined)
	{
		console.log("Type module name");
		process.exit();
	}
	app.compileModule(name);
}

else if (cmd == "make_all")
{
	for (var i=0; i<app.modules.length; i++)
	{
		app.compileModule(app.modules[i].name);
	}
}

else
{
	console.log( "Type " + process.argv[1] + " {watch|modules|make|make_all}" );
	console.log( "" );
}