# Bayrell Lang Compiler for NodeJS

Install global:

```npm install -g bayrell-lang-compiler --unsafe-perm```

or local:

```npm install --save bayrell-lang-compile```

Example **project.json** in local folder of the project:

```
{
	"name": "Test",
	"cache": "var/bundler",
	"build":
	[
		{
			"dest": "web/js/runtime.js",
			"modules":
			[
				"Runtime",
				"Runtime.Core",
				"Runtime.Web"
			]
		},
		{
			"dest": "web/js/app.js",
			"modules":
			[
				"App"
			],
			"websocket": true
		}
	],
	"plugins":
	[
		"Bayrell.Bundler.Plugins.BayLang"
	],
	"modules":
	[
		"lib"
	],
	"languages": ["php", "es6", "nodejs"],
	"output": "web",
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


