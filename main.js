var fs = require('fs');
var path = require('path');
var watch = require('node-watch');
var Runtime = require('bayrell-runtime-nodejs');
var BayrellLang = require('bayrell-lang-nodejs');


class Module 
{
	constructor()
	{
		this.path = "";
		this.langs = [];
	}
}


class App
{
	constructor(path)
	{
		this.context = Runtime.Utils.registerGlobalContext( new Runtime.Vector("BayrellFileSystem") );
		this.current_path = path;
		this.modules = [];
		this.parser_bay_factory = new BayrellLang.LangBay.ParserBayFactory(this.context);
		this.translator_es6_factory = new BayrellLang.LangES6.TranslatorES6Factory(this.context);
		this.translator_nodejs_factory = new BayrellLang.LangNodeJS.TranslatorNodeJSFactory(this.context);
		this.translator_php_factory = new BayrellLang.LangPHP.TranslatorPHPFactory(this.context);
	}
	addModule(path, langs)
	{
		var module = new Module();
		module.path = path;
		module.langs = langs;
		this.modules.push(module);
	}
	init(obj)
	{
		for (var i=0; i<obj.modules.length; i++)
		{
			var item = obj.modules[i];
			this.addModule( path.normalize(this.current_path + "/" + item.path), item.lang );
		}
	}
	loadConfig()
	{
		var content = fs.readFileSync(this.current_path + "/project.json").toString();
		this.init( JSON.parse(content) );
	}
	run()
	{
		console.log('Ready');
		watch(this.current_path, { recursive: true }, this.onChange.bind(this));
	}
	onChange(eventType, filename)
	{
		if (eventType == "update")
		{
			var stat = fs.lstatSync(filename);
			if (stat.isFile())
			{
				this.onChangeFile(filename);				
			}
		}
	}
	onChangeFile(filename)
	{
		var module = this.findModuleByFileName(filename);
		if (module == null)
			return;
		
		this.onChangeFileInModule(module, filename);
	}
	findModuleByFileName(filename)
	{
		for (var i=0; i<this.modules.length; i++)
		{
			var module = this.modules[i];
			if (filename.indexOf(module.path) == 0) return module;
		}
		return null;
	}
	onChangeFileInModule(module, filename)
	{
		var lib_path = path.normalize(module.path + "/bay");
		if (filename.indexOf(lib_path) == 0)
		{
			this.compileFile(module, filename);
		}
	}
	compileFile(module, filename)
	{
		var lib_path = path.normalize(module.path + "/bay");
		var extname = path.extname(filename).substr(1);
		var rel_path = filename.substr( lib_path.length + 1 );
		
		if (extname == "bay")
		{
			var content = fs.readFileSync(filename).toString();
			var res = BayrellLang.Utils.translateSource(
				this.context, 
				this.parser_bay_factory, 
				this.translator_nodejs_factory,
				content
			);
			
			console.log('%s in %s changed', rel_path, lib_path);
			console.log(res);
		}
		
		
	}
}

var app = new App( process.cwd() );
app.loadConfig();
app.run();
