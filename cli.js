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

else if (cmd == "make_symlink")
{
	var name = process.argv[3];
	if (name == undefined)
	{
		console.log("Type module name");
		process.exit();
	}
	app.makeSymlink(name);
}

else if (cmd == "make_symlinks")
{
	for (var i=0; i<app.modules.length; i++)
	{
		app.makeSymlink(app.modules[i].name);
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
	
	var lang = process.argv[4];
	if (lang == undefined)
	{
		lang = ["php", "es6"]
	}
	else
	{
		lang = [ lang ];
	}
	app.compileModule(name, lang);
}

else if (cmd == "make_all")
{
	var lang = process.argv[3];
	if (lang == undefined)
	{
		lang = ["php", "es6"]
	}
	else
	{
		lang = [ lang ];
	}
	
	for (var i=0; i<app.modules.length; i++)
	{
		app.compileModule(app.modules[i].name, lang);
	}
}

else
{
	console.log( "Type " + process.argv[1] + " {watch|modules|make|make_all|make_symlinks|make_symlink}" );
	console.log( "" );
}