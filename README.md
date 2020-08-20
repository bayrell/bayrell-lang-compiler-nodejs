# Bayrell Lang Compiler for NodeJS

Install global:

```npm install -g bayrell-lang-compiler --unsafe-perm```

or local:

```npm install --save bayrell-lang-compile```

Create **project.json** in local folder

```
{
	"name": "Test",
	"modules":
	[
		{
			"name": "App",
			"path": "./lib/App",
			"lang": ["php", "es6"]
		}
	]
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


