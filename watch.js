#!/usr/bin/env node

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
		this.context = Runtime.RuntimeUtils.createContext();
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
			this.compileFileInModule(module, filename);
		}
	}
	compileFileInModule(module, file_path)
	{
		var extname = path.extname(file_path).substr(1);
		
		if (extname == "bay")
		{
			console.log(file_path);
			
			try
			{
				for (var i=0; i<module.langs.length; i++)
				{
					var lang = module.langs[i];
					this.compileFile(module, file_path, "bay", lang);
				}
				console.log('Ok');
			}
			catch(e)
			{
				console.log(e.toString());
			}
			
		}
		
		
	}
	compileFile(module, file_path, lang_from, lang_to)
	{
		var lib_path = path.normalize(module.path + "/bay");
		var extname = path.extname(file_path);
		var basename = path.basename(file_path, extname);
		var relative_path = file_path.substr( lib_path.length + 1 );
		var dir_path = path.dirname(relative_path);
		extname = extname.substr(1);
		
		var save_dir = "";
		var save_ext = "";
		var translator = null;
		
		if (lang_to == "php")
		{
			save_dir = "php";
			save_ext = ".php";
			translator = this.translator_php_factory;
		}
		if (lang_to == "es6")
		{
			save_dir = "es6";
			save_ext = ".js";
			translator = this.translator_es6_factory;
		}
		if (lang_to == "nodejs")
		{
			save_dir = "nodejs";
			save_ext = ".js";
			translator = this.translator_nodejs_factory;
		}
		
		if (save_dir == "" || save_ext == "")
			return;
		
		var save_path = path.normalize(module.path + "/" + save_dir + "/" + dir_path + "/" + basename + save_ext);
		
		/* Compile */
		var content = fs.readFileSync(file_path).toString();
		var res = BayrellLang.Utils.translateSource(
			this.context, 
			this.parser_bay_factory, 
			translator,
			content
		);
		console.log('=>' + save_path);
		
		fs.writeFileSync(save_path, res);
	}
}


module.exports = {
	"App": App,
	"Module": Module,
}

