#!/usr/bin/env node

var m_path = require("path");
var use = require('bayrell').use;
use.add_modules( __dirname + "/node_modules" );
//use.add_src( __dirname + "/../app/src" );

var App = require("./app.js");

//console.log( use("Runtime.Context").create );
//exit();

var cmd = process.argv[2];
var app = new App.App( process.cwd() );
var Context = use("Runtime.Context");
var Collection = use("Runtime.Collection");
var Map = use("Runtime.Map");
var ParserBay = use("Bayrell.Lang.LangBay.ParserBay");
var TranslatorES6 = use("Bayrell.Lang.LangES6.TranslatorES6");
var TranslatorNode = use("Bayrell.Lang.LangNode.TranslatorNode");
var TranslatorPHP = use("Bayrell.Lang.LangPHP.TranslatorPHP");

/*
app.is_context = true;
use("Runtime._Map").is_ctx = app.is_context;
use("Runtime._Collection").is_ctx = app.is_context;
use("Runtime.rtl").is_ctx = app.is_context;
*/

app.context = Context.create
(
	null,
	Collection.from(["Runtime", "Bayrell.Lang"]),
	null
);
use("Runtime.RuntimeUtils").setContext(app.context);

app.current_path = process.cwd();
app.modules = [];
app.parser_bay = new ParserBay();
app.translator_es6 = new TranslatorES6();
app.translator_nodejs = new TranslatorNode();
app.translator_php = new TranslatorPHP();

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
	try
	{
		app.compileModule(name, lang);
	}
	catch(e)
	{
		var RuntimeException = use("Runtime.Exceptions.RuntimeException");
		if (e instanceof RuntimeException)
		{
			console.log(e.toString());
			console.log(e.stack);
		}
		else
		{
			throw e;
		}
	}
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