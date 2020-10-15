# Bayrell Lang Compiler for NodeJS

Install NodeJS on Ubuntu:
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
apt-get install -y nodejs
```

Install g++ on Ubuntu for inotify
```
apt install g++ make
```

Install global:

```npm install -g bayrell-lang-compiler --unsafe-perm```

or local:

```npm install --save bayrell-lang-compile```

Example **project.json** in local folder of the project:

```
{
	"name": "Test",
	"assets": "assets/",
	"cache": "var/bundler",
	"bundles":
	[
		{
			"name": "runtime.js",
			"dest": "web/js/runtime.js",
			"lang": "es6",
			"modules":
			[
				"Runtime",
				"Runtime.Core",
				"Runtime.Web"
			]
		},
		{
			"name": "app.js",
			"dest": "web/js/app.js",
			"lang": "es6",
			"modules":
			[
				"App"
			],
			"websocket": true
		}
	],
	"plugins":
	[
		"Bayrell.Bundler.Plugins.BayLang",
		"Bayrell.Bundler.Plugins.Bundle",
		"Bayrell.Bundler.Plugins.FilesPHP",
		"Bayrell.Bundler.Plugins.FilesES6",
		"Bayrell.Bundler.Plugins.FilesJS"
	],
	"modules":
	[
		"app",
		"lib"
	],
	"languages": ["php", "es6"],
	"watch":
	{
		"dir":
		[
			"lib",
			"src"
		],
		"timeout": 500,
		"websocket": true
	}
}
```

Run autocompile mode

```
bayrell-lang-nodejs watch
```

Create file **./lib/App/bay/Test.bay**

```
namespace App;

class Test
{
  lambda string hello() => "Hello World!!!";
}
```

The files *./lib/App/php/Test.php* and *./lib/App/es6/Test.js* are created automatically


