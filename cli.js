#!/usr/bin/env node

var m_path = require("path");
var use = require('bayrell').use;
use.add_modules( __dirname + "/node_modules" );
//use.add_src( __dirname + "/../lib" );

/* Use */
var CoreStruct = use("Runtime.CoreStruct");
var Collection = use("Runtime.Collection");
var Dict = use("Runtime.Dict");
var Context = use("Runtime.Core.Context");

/* Get enviroment */
var env = process.env;
env = Dict.from(env);

/* Create context */
var context = Context.create(null, env);

/* Set context params */
context = context.copy(context, {
	"start_time": Date.now(),
	"cli_args": Collection.from(process.argv.slice(1)),
	"base_path": process.cwd(),
});

/* Set entry */
context = context.constructor.setMainModule(context, context, "Bayrell.Bundler");
context = context.constructor.setEntryPoint(context, context, "Runtime.Task.Entry");

/* Set global context */
use("Runtime.RuntimeUtils").setContext(context);

/* Run app */
(async () => {
	
	try
	{
		/* Run entry */
		context = await context.constructor.run(context, context);
	}
	catch (e)
	{
		console.log( e.stack );
	}
})();