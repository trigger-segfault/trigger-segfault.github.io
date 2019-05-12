/*=====================================================================================
JAVASCRIPT OVERRIDES
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-segfault/trigger-segfault.github.io/
// Raw File:     https://raw.githubusercontent.com/trigger-segfault/trigger-segfault.github.io/master/mods/Overrides.js

/*=====================================================================================
OVERRIDES DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
Overrides = {};
/* The static class that manages Game backups. */
Overrides.Backup = {};
/* True if the mod has been loaded. */
Overrides.Loaded = false;

//#endregion
/*=====================================================================================
OVERRIDES INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Overrides. */
Overrides.Init = function () {

	Overrides.Loaded = true;
}

//#endregion
/*=====================================================================================
OVERRIDES OVERRIDES
=======================================================================================*/
//#region Overrides

/* Overrides a function and stores the backup. */
Overrides.AppendFunction = function (gameFunc, userFunc, bindTo, owner) {

	// If an appended function hasn't been made yet
	if (!(gameFunc in Overrides.AppendedFunctions)) {

		// Backup the real function if it hasn't been overridden yet
		if (!(gameFunc in Overrides.UserFunctions)) {
			Overrides.Backup.Functions[gameFunc] = { func: eval(gameFunc), name: gameFunc, owner: 'Game' };
			Overrides.Backup.AppendedFunctions[gameFunc] = { func: eval(gameFunc), name: gameFunc, owner: 'Game' };
		}
		else {
			console.log('WARNING! "' + gameFunc + '" is being turned into an appended function' + (owner ? (' by "' + owner + '"') : '') + ', but is also overridden' + (Overrides.UserFunctions[gameFunc].owner ? (' by "' + Overrides.UserFunctions[gameFunc].owner + '"!') : '!'));
			Overrides.Backup.AppendedFunctions[gameFunc] = Overrides.UserFunctions[gameFunc];
		}

		// Backup the (possibly overriden) function

		if (bindTo) {
			var bindVar = null;
			if (bindTo != 'this')
				eval('bindVar = ' + bindTo);

			// Store the new appended function
			Overrides.AppendedFunctions[gameFunc] = {
				func: function () {
					// Call the original function
					Overrides.Backup.AppendedFunctions[gameFunc].func.bind(bindTo == 'this' ? this : bindVar)();

					// Call the added functions
					for (var i in Overrides.AppendedUserFunctions[gameFunc]) {
						Overrides.AppendedUserFunctions[gameFunc][i].func.bind(bindTo == 'this' ? this : bindVar)();
					}
				},
				owner: 'Overrides'
			};
		}
		else {
			// Store the new appended function
			Overrides.AppendedFunctions[gameFunc] = {
				func: function () {
					// Call the original function
					Overrides.Backup.AppendedFunctions[gameFunc].func();

					// Call the added functions
					for (var i in Overrides.AppendedUserFunctions[gameFunc]) {
						Overrides.AppendedUserFunctions[gameFunc][i].func();
					}
				},
				owner: 'Overrides'
			};
		}

		// Overwrite the function
		eval(gameFunc + ' = Overrides.AppendedFunctions[\'' + gameFunc + '\'].func');

		// Create a list of user functions to call
		Overrides.AppendedUserFunctions[gameFunc] = [];

		console.log('Function "' + gameFunc + '" turned into appended function' + (owner ? (' by "' + owner + '".') : '.'));
	}

	// Add the user function to the list
	Overrides.AppendedUserFunctions[gameFunc][userFunc] = { func: eval(userFunc), name: userFunc, owner: owner };

	console.log('Function "' + userFunc + '" appended to function "' + gameFunc + '"' + (owner ? (' by "' + owner + '".') : '.'));
}
/* Overrides a function and stores the backup. */
Overrides.AppendFunctionWithParameters = function (gameFunc, userFunc, parameters, bindTo, owner) {

	// If an appended function hasn't been made yet
	if (!(gameFunc in Overrides.AppendedFunctions)) {

		// Backup the real function if it hasn't been overridden yet
		if (!(gameFunc in Overrides.UserFunctions)) {
			Overrides.Backup.Functions[gameFunc] = { func: eval(gameFunc), name: gameFunc, owner: 'Game' };
			Overrides.Backup.AppendedFunctions[gameFunc] = { func: eval(gameFunc), name: gameFunc, owner: 'Game' };
		}
		else {
			console.log('WARNING! "' + gameFunc + '" is being turned into an appended function' + (owner ? (' by "' + owner + '"') : '') + ', but is also overridden' + (Overrides.UserFunctions[gameFunc].owner ? (' by "' + Overrides.UserFunctions[gameFunc].owner + '"!') : '!'));
			Overrides.Backup.AppendedFunctions[gameFunc] = Overrides.UserFunctions[gameFunc];
		}

		// Backup the (possibly overriden) function

		// Store the new appended function
		eval("Overrides.AppendedFunctions[gameFunc] = {" +
			"func: function (" + parameters + ") {" +
				// Call the original function
				"Overrides.Backup.AppendedFunctions[gameFunc].func" + (bindTo ? ".bind(" + bindTo + ")" : "") + "(" + parameters + ");" +

				// Call the added functions
				"for (var i in Overrides.AppendedUserFunctions[gameFunc]) {" +
					"Overrides.AppendedUserFunctions[gameFunc][i].func" + (bindTo ? ".bind(" + bindTo + ")" : "") + "(" + parameters + ");" +
				"}" +
			"}," +
			"owner: 'Overrides'" +
		"};");

		// Overwrite the function
		eval(gameFunc + ' = Overrides.AppendedFunctions[\'' + gameFunc + '\'].func');

		// Create a list of user functions to call
		Overrides.AppendedUserFunctions[gameFunc] = [];

		console.log('Function "' + gameFunc + '(' + parameters + ')" turned into appended function' + (owner ? (' by "' + owner + '".') : '.'));
	}

	// Add the user function to the list
	Overrides.AppendedUserFunctions[gameFunc][userFunc] = { func: eval(userFunc), name: userFunc, owner: owner };

	console.log('Function "' + userFunc + '" appended to function "' + gameFunc + '"' + (owner ? (' by "' + owner + '".') : '.'));
}
/* Overrides a function and stores the backup. Returns true if the function hasn't already been overridden. */
Overrides.OverrideFunction = function (gameFunc, userFunc, owner, force) {

	// If the function hasn't already been overridden yet
	if (!(gameFunc in Overrides.UserFunctions) || force) {

		if (gameFunc in Overrides.UserFunctions)
			console.log('WARNING! "' + gameFunc + '" override' + (Overrides.UserFunctions[gameFunc].owner ? (' by "' + Overrides.UserFunctions[gameFunc].owner + '"') : '') + ' has been replaced!');

		// Backup the game and user function
		// If a appended function hasn't been made yet
		if (!(gameFunc in Overrides.AppendedFunctions)) {
			Overrides.Backup.Functions[gameFunc] = { func: eval(gameFunc), name: gameFunc, owner: 'Game' };

			// Overwrite the function
			eval(gameFunc + ' = ' + userFunc);
		}
		else {
			// Overwrite the appended function
			Overrides.Backup.AppendedFunctions[gameFunc] = { func: eval(userFunc), name: userFunc, owner: owner }
			console.log('WARNING! "' + gameFunc + '" is being overridden' + (owner ? (' by "' + owner + '"') : '') + ', but is also an appended function!');
		}

		Overrides.UserFunctions[gameFunc] = { func: eval(userFunc), name: userFunc, owner: owner };

		console.log('Function "' + gameFunc + '" has been overriden' + (owner ? (' by "' + owner + '".') : '.'));
		return true;
	}

	console.log('ERROR! "' + gameFunc + '" has already been overridden' + (Overrides.UserFunctions[gameFunc].owner ? (' by "' + Overrides.UserFunctions[gameFunc].owner + '"!') : '!'));
	return false;
}
/* Returns true if a function has been overridden. */
Overrides.IsFunctionOverridden = function (gameFunc) {
	return (gameFunc in Overrides.Backup.Functions);
}
/* Returns true if a function has been turned into an appended function. */
Overrides.IsFunctionAppended = function (gameFunc) {
	return (gameFunc in Overrides.Backup.AppendedFunctions);
}
/* Restores the specified function to it's original state. */
Overrides.RestoreFunction = function (gameFunc, owner) {
	if (gameFunc in Overrides.Backup.Functions) {
		eval(gameFunc + ' = Overrides.Backup.Functions[\'' + gameFunc + '\'].func');

		// Remove the function from the list
		delete Overrides.Backup.Functions[gameFunc];
		//Overrides.Backup.Functions.splice(Overrides.Backup.Functions.indexOf(gameFunc), 1);
		if (gameFunc in Overrides.Backup.AppendedFunctions)
			delete Overrides.Backup.AppendedFunctions[gameFunc];
		//Overrides.Backup.AppendedFunctions.splice(Overrides.Backup.AppendedFunctions.indexOf(gameFunc), 1);

		if (gameFunc in Overrides.AppendedFunctions)
			delete Overrides.AppendedFunctions[gameFunc];
		//Overrides.AppendedFunctions.splice(Overrides.AppendedFunctions.indexOf(gameFunc), 1);

		if (gameFunc in Overrides.UserFunctions)
			delete Overrides.UserFunctions[gameFunc];
		//Overrides.UserFunctions.splice(Overrides.UserFunctions.indexOf(gameFunc), 1);
		if (gameFunc in Overrides.AppendedUserFunctions)
			delete Overrides.AppendedUserFunctions[gameFunc];
		//Overrides.AppendedUserFunctions.splice(Overrides.AppendedUserFunctions.indexOf(gameFunc), 1);

		console.log('Function "' + gameFunc + '" has been restored' + (owner ? (' by "' + owner + '".') : '.'));
	}
}
/* Restores all functions to their original state. */
Overrides.RestoreAll = function (owner) {
	for (var i in Overrides.Backup.Functions) {
		var gameFunc = Overrides.Backup.Functions[i].name;

		eval(gameFunc + ' = Overrides.Backup.Functions[\'' + gameFunc + '\'].func');

		// Remove the function from the list
		delete Overrides.Backup.Functions[gameFunc];
		//Overrides.Backup.Functions.splice(Overrides.Backup.Functions.indexOf(gameFunc), 1);
		if (gameFunc in Overrides.Backup.AppendedFunctions)
			delete Overrides.Backup.AppendedFunctions[gameFunc];
		//Overrides.Backup.AppendedFunctions.splice(Overrides.Backup.AppendedFunctions.indexOf(gameFunc), 1);

		if (gameFunc in Overrides.AppendedFunctions)
			delete Overrides.AppendedFunctions[gameFunc];
		//Overrides.AppendedFunctions.splice(Overrides.AppendedFunctions.indexOf(gameFunc), 1);

		if (gameFunc in Overrides.UserFunctions)
			delete Overrides.UserFunctions[gameFunc];
		//Overrides.UserFunctions.splice(Overrides.UserFunctions.indexOf(gameFunc), 1);
		if (gameFunc in Overrides.AppendedUserFunctions)
			delete Overrides.AppendedUserFunctions[gameFunc];
		//Overrides.AppendedUserFunctions.splice(Overrides.AppendedUserFunctions.indexOf(gameFunc), 1);
	}

	console.log('All functions restored' + (owner ? (' by "' + owner + '".') : '.'));
}

//#endregion
/*=====================================================================================
OVERRIDES VARIABLES
=======================================================================================*/
//#region Variables

/* The collection of function backups. */
Overrides.Backup.Functions = [];
/* The collection of function backups for when an appended function is overridden. */
Overrides.Backup.AppendedFunctions = [];

/* The collection of appended functions. */
Overrides.AppendedFunctions = [];

/* The collection of user functions. */
Overrides.UserFunctions = [];
/* The collection of user functions used in appended functions. */
Overrides.AppendedUserFunctions = [];

//#endregion
/*=====================================================================================
LAUNCH JAVASCRIPT OVERRIDES
=======================================================================================*/

// Launch Overrides Manager
Overrides.Init();

