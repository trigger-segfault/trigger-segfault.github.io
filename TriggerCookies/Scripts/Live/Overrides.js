/*=====================================================================================
COOKIES CLICKER OVERRIDES
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/Overrides.js

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

	Overrides.OverrideFunction('Game.UpdateMenu', 'Overrides.UpdateMenu', 'Overrides');
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
OVERRIDES MENU OVERRIDES
=======================================================================================*/
//#region Menu Overrides

/* Updates the mods menu. */
Overrides.UpdateMenuMods = function () {
	return '';
}
/* Updates the Info menu. */
Overrides.UpdateMenuLog = function () {
	return Game.updateLog;
}
/* Updates the Preferences menu. */
Overrides.UpdateMenuPrefs = function () {
	var str = '';
	str +=
	'<div class="section">Menu</div>' +
	'<div class="subsection">' +
	'<div class="title">General</div>' +
	'<div class="listing"><a class="option" ' + Game.clickStr + '="Game.WriteSave();">Save</a><label>Save manually (the game autosaves every 60 seconds)</label></div>' +
	'<div class="listing"><a class="option" ' + Game.clickStr + '="Game.ExportSave();">Export save</a><a class="option" ' + Game.clickStr + '="Game.ImportSave();">Import save</a><label>You can use this to backup your save or to transfer it to another computer</label></div>' +
	//'<div class="listing"><span class="warning" style="font-size:12px;">[Note : importing saves from earlier versions than 1.0 will be disabled beyond September 1st, 2013.]</span></div>'+
	'<div class="listing"><a class="option warning" ' + Game.clickStr + '="Game.Reset();">Reset</a><label>Reset your game (you will keep your achievements)</label></div>' +
	'<div class="listing"><a class="option warning" ' + Game.clickStr + '="Game.HardReset();">Wipe save</a><label>Delete all your progress, including your achievements and prestige</label></div>' +
	'<div class="title">Settings</div>' +
	'<div class="listing">' +
	Game.WriteButton('fancy', 'fancyButton', 'Fancy graphics ON', 'Fancy graphics OFF', 'Game.ToggleFancy();') +
	Game.WriteButton('particles', 'particlesButton', 'Particles ON', 'Particles OFF') +
	Game.WriteButton('numbers', 'numbersButton', 'Numbers ON', 'Numbers OFF') +
	Game.WriteButton('milk', 'milkButton', 'Milk ON', 'Milk OFF') +
	Game.WriteButton('cursors', 'cursorsButton', 'Cursors ON', 'Cursors OFF') +
	Game.WriteButton('format', 'formatButton', 'Short numbers OFF', 'Short numbers ON', 'BeautifyAll();Game.RefreshStore();Game.upgradesToRebuild=1;') +
	Game.WriteButton('notifs', 'notifsButton', 'Fast notes ON', 'Fast notes OFF') +
	'</div>' +
	'<div class="listing">' + Game.WriteButton('autoupdate', 'autoupdateButton', 'Offline mode OFF', 'Offline mode ON') + '<label>(note : this disables update notifications)</label></div>' +
	'<div class="listing">' + Game.WriteButton('warn', 'warnButton', 'Closing warning ON', 'Closing warning OFF') + '<label>(the game will ask you to confirm when you close the window)</label></div>' +
	'<div class="listing">' + Game.WriteButton('focus', 'focusButton', 'Focus OFF', 'Focus ON') + '<label>(the game will be less resource-intensive when out of focus)</label></div>' +
	//'<div class="listing">'+Game.WriteButton('autosave','autosaveButton','Autosave ON','Autosave OFF')+'</div>'+
	(1 == 2 ? (
	'<div class="title">Customization</div>' +
	'<div class="listing"><b>Background</b>' +
	Game.WriteSelector('backgroundType', 'backgroundType', ['Blue background', 'Red background', 'White background', 'Black background'], 'Blue background', (Game.backgroundType > 0 ? Game.UpgradesById[Game.backgroundType].name : Game.Upgrades['Blue background'].name)) +
	'</div>'
	) : '') +
	'<div style="padding-bottom:128px;"></div>' +
	'</div>'
	;
	return str;
}
/* Updates the Stats menu. */
Overrides.UpdateMenuStats = function () {
	var str = '';
	var buildingsOwned = 0;
	buildingsOwned = Game.BuildingsOwned;
	var upgrades = '';
	var cookieUpgrades = '';
	var hiddenUpgrades = '';
	var upgradesTotal = 0;
	var upgradesOwned = 0;

	var list = [];
	for (var i in Game.Upgrades)//sort the upgrades
	{
		list.push(Game.Upgrades[i]);
	}
	var sortMap = function (a, b) {
		if (a.order > b.order) return 1;
		else if (a.order < b.order) return -1;
		else return 0;
	}
	list.sort(sortMap);
	for (var i in list) {
		var str2 = '';
		var me = list[i];
		if (!Game.Has('Neuromancy')) {
			if (me.bought > 0) {
				str2 += '<div class="crate upgrade enabled" ' + Game.getTooltip(
				'<div style="min-width:200px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.basePrice)) + '</span></div><small>[Upgrade] [Purchased]</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div></div>'
				, 'bottom-right') + ' style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48 + 6) + 'px ' + (-me.icon[1] * 48 + 6) + 'px;"></div>';
				if (me.hide != 3) upgradesOwned++;
			}
		}
		else {
			str2 += '<div ' + Game.clickStr + '="Game.UpgradesById[' + me.id + '].toggle();" class="crate upgrade' + (me.bought > 0 ? ' enabled' : '') + '" ' + Game.getTooltip(
			'<div style="min-width:200px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.basePrice)) + '</span></div><small>[Upgrade]' + (me.bought > 0 ? ' [Purchased]' : '') + '</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div></div>'
			, 'bottom-right') + ' style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48 + 6) + 'px ' + (-me.icon[1] * 48 + 6) + 'px;"></div>';
			if (me.hide != 3) upgradesOwned++;
		}
		if (me.hide != 3) upgradesTotal++;
		if (me.debug) hiddenUpgrades += str2; else if (me.type == 'cookie') cookieUpgrades += str2; else upgrades += str2;
	}
	var achievements = [];
	var shadowAchievements = '';
	var achievementsOwned = 0;
	var achievementsTotal = 0;

	var list = [];
	for (var i in Game.Achievements)//sort the achievements
	{
		list.push(Game.Achievements[i]);
	}
	var sortMap = function (a, b) {
		if (a.order > b.order) return 1;
		else if (a.order < b.order) return -1;
		else return 0;
	}
	list.sort(sortMap);

	for (var i in list) {
		var me = list[i];
		if (!me.disabled && me.hide != 3 || me.won > 0) achievementsTotal++;
		var category = me.category;
		if (!achievements[category]) achievements[category] = '';

		if (me.won > 0 && me.hide == 3) {
			shadowAchievements += '<div class="crate achievement enabled" ' + Game.getTooltip(
			'<div style="min-width:200px;"><small>[Achievement] [Unlocked]' + (me.hide == 3 ? ' [Shadow]' : '') + '</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div></div>'
			, 'bottom-right') + ' style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48 + 6) + 'px ' + (-me.icon[1] * 48 + 6) + 'px;"></div>';
			achievementsOwned++;
		}
		else if (me.won > 0) {
			achievements[category] += '<div class="crate achievement enabled" ' + Game.getTooltip(
			'<div style="min-width:200px;"><small>[Achievement] [Unlocked]' + (me.hide == 3 ? ' [Shadow]' : '') + '</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div></div>'
			, 'bottom-right') + ' style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48 + 6) + 'px ' + (-me.icon[1] * 48 + 6) + 'px;"></div>';
			achievementsOwned++;
		}
		else if (me.hide == 0) {
			achievements[category] += '<div class="crate achievement" ' + Game.getTooltip(
			'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div></div>'
			, 'bottom-right') + ' style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48 + 6) + 'px ' + (-me.icon[1] * 48 + 6) + 'px;"></div>';
		}
		else if (me.hide == 1) {
			achievements[category] += '<div class="crate achievement" ' + Game.getTooltip(
			'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">' + me.name + '</div><div class="description">???</div></div>'
			, 'bottom-right') + ' style="background-position:' + (-0 * 48 + 6) + 'px ' + (-7 * 48 + 6) + 'px;"></div>';
		}
		else if (me.hide == 2) {
			achievements[category] += '<div class="crate achievement" ' + Game.getTooltip(
			'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">???</div><div class="description">???</div></div>'
			, 'bottom-right') + ' style="background-position:' + (-0 * 48 + 6) + 'px ' + (-7 * 48 + 6) + 'px;"></div>';
		}
	}

	var achievementsStr = '';
	var categories = { 'dungeon': 'Dungeon achievements' };
	for (var i in achievements) {
		if (achievements[i] != '') {
			var cat = i;
			if (categories[i]) achievementsStr += '<div class="listing"><b>' + categories[i] + '</b></div>';
			achievementsStr += '<div class="listing" style="overflow-y:hidden;">' + achievements[i] + '</div>';
		}
	}

	var santaStr = '';
	if (Game.Has('A festive hat')) {
		for (var i = 0; i <= Game.santaLevel; i++) {
			santaStr += '<div ' + Game.getTooltip(
			'<div style="min-width:200px;text-align:center">' + Game.santaLevels[i] + '</div>'
			, 'bottom-right') + ' style="width:96px;height:96px;margin:2px;float:left;background:url(img/santa.png) ' + (-i * 96) + 'px 0px;"></div>';
		}
		santaStr += '<div style="clear:both;"></div>';
	}

	var milkName = 'plain milk';
	if (Game.milkProgress >= 4) milkName = 'caramel milk';
	else if (Game.milkProgress >= 3) milkName = 'orange juice';
	else if (Game.milkProgress >= 2) milkName = 'raspberry milk';
	else if (Game.milkProgress >= 1) milkName = 'chocolate milk';

	var researchStr = Game.sayTime(Game.researchT);
	var pledgeStr = Game.sayTime(Game.pledgeT);
	var wrathStr = '';
	if (Game.elderWrath == 1) wrathStr = 'awoken';
	else if (Game.elderWrath == 2) wrathStr = 'displeased';
	else if (Game.elderWrath == 3) wrathStr = 'angered';
	else if (Game.elderWrath == 0 && Game.pledges > 0) wrathStr = 'appeased';

	var date = new Date();
	date.setTime(new Date().getTime() - Game.startDate);
	var timeInSeconds = date.getTime() / 1000;
	var startDate = Game.sayTime(timeInSeconds * Game.fps, 2);
	date.setTime(new Date().getTime() - Game.fullDate);
	var fullDate = Game.sayTime(date.getTime() / 1000 * Game.fps, 2);
	if (!fullDate || fullDate.length < 1) fullDate = 'a long while';
	/*date.setTime(new Date().getTime()-Game.lastDate);
	var lastDate=Game.sayTime(date.getTime()/1000*Game.fps,2);*/

	var heavenlyMult = 0;
	if (Game.Has('Heavenly chip secret')) heavenlyMult += 5;
	if (Game.Has('Heavenly cookie stand')) heavenlyMult += 20;
	if (Game.Has('Heavenly bakery')) heavenlyMult += 25;
	if (Game.Has('Heavenly confectionery')) heavenlyMult += 25;
	if (Game.Has('Heavenly key')) heavenlyMult += 25;

	var seasonStr = Game.sayTime(Game.seasonT);

	str += '<div class="section">Statistics</div>' +
	'<div class="subsection">' +
	'<div class="title">General</div>' +
	'<div class="listing"><b>Cookies in bank :</b> <div class="price plain">' + Game.tinyCookie() + Beautify(Game.cookies) + '</div></div>' +
	'<div class="listing"><b>Cookies baked (this game) :</b> <div class="price plain">' + Game.tinyCookie() + Beautify(Game.cookiesEarned) + '</div></div>' +
	'<div class="listing"><b>Cookies baked (all time) :</b> <div class="price plain">' + Game.tinyCookie() + Beautify(Game.cookiesEarned + Game.cookiesReset) + '</div></div>' +
	(Game.cookiesReset > 0 ? '<div class="listing"><b>Cookies forfeited by resetting :</b> <div class="price plain">' + Game.tinyCookie() + Beautify(Game.cookiesReset) + '</div></div>' : '') +
	(Game.resets ? ('<div class="listing"><b>Legacy started :</b> ' + (fullDate == '' ? 'just now' : (fullDate + ' ago')) + ', with ' + Beautify(Game.resets) + ' reset' + (Game.resets == 1 ? '' : 's') + '</div>') : '') +
	'<div class="listing"><b>Session started :</b> ' + (startDate == '' ? 'just now' : (startDate + ' ago')) + '</div>' +
	'<div class="listing"><b>Buildings owned :</b> ' + Beautify(buildingsOwned) + '</div>' +
	'<div class="listing"><b>Cookies per second :</b> ' + Beautify(Game.cookiesPs, 1) + ' <small>' +
		'(multiplier : ' + Beautify(Math.round(Game.globalCpsMult * 100), 1) + '%)' +
		(Game.cpsSucked > 0 ? ' <span class="warning">(withered : ' + Beautify(Math.round(Game.cpsSucked * 100), 1) + '%)</span>' : '') +
		'</small></div>' +
	'<div class="listing"><b>Cookies per click :</b> ' + Beautify(Game.computedMouseCps, 1) + '</div>' +
	'<div class="listing"><b>Cookie clicks :</b> ' + Beautify(Game.cookieClicks) + '</div>' +
	'<div class="listing"><b>Hand-made cookies :</b> ' + Beautify(Game.handmadeCookies) + '</div>' +
	'<div class="listing"><b>Golden cookie clicks :</b> ' + Beautify(Game.goldenClicksLocal) + ' <small>(all time : ' + Beautify(Game.goldenClicks) + ')</small></div>' +//' <span class="hidden">(<b>Missed golden cookies :</b> '+Beautify(Game.missedGoldenClicks)+')</span></div>'+
	'<br><div class="listing"><b>Running version :</b> ' + Game.version + '</div>' +

	((researchStr != '' || wrathStr != '' || pledgeStr != '' || santaStr != '' || Game.season != '') ? (
	'</div><div class="subsection">' +
	'<div class="title">Special</div>' +
	(Game.season != '' ? '<div class="listing"><b>Seasonal event :</b> ' + Game.seasons[Game.season].name +
		(seasonStr != '' ? ' <small>(' + seasonStr + ' remaining)</small>' : '') +
	'</div>' : '') +
	(Game.season == 'fools' ?
		'<div class="listing"><b>Money made from selling cookies :</b> ' + Beautify(Game.cookiesEarned * 0.08, 2) + '$</div>' +
		(Game.Objects['Portal'].amount > 0 ? '<div class="listing"><b>TV show seasons produced :</b> ' + Beautify(Math.floor((timeInSeconds / 60 / 60) * (Game.Objects['Portal'].amount * 0.13) + 1)) + '</div>' : '')
	: '') +
	(researchStr != '' ? '<div class="listing"><b>Research :</b> ' + researchStr + ' remaining</div>' : '') +
	(wrathStr != '' ? '<div class="listing"><b>Grandmatriarchs status :</b> ' + wrathStr + '</div>' : '') +
	(pledgeStr != '' ? '<div class="listing"><b>Pledge :</b> ' + pledgeStr + ' remaining</div>' : '') +
	(Game.wrinklersPopped > 0 ? '<div class="listing"><b>Wrinklers popped :</b> ' + Beautify(Game.wrinklersPopped) + '</div>' : '') +
	//(Game.cookiesSucked>0?'<div class="listing warning"><b>Withered :</b> '+Beautify(Game.cookiesSucked)+' cookies</div>':'')+
	(Game.reindeerClicked > 0 ? '<div class="listing"><b>Reindeer found :</b> ' + Beautify(Game.reindeerClicked) + '</div>' : '') +
	(santaStr != '' ? '<div class="listing"><b>Santa stages unlocked :</b></div><div>' + santaStr + '</div>' : '') +
	''
	) : '') +
	(Game.prestige['Heavenly chips'] > 0 ? (
	'</div><div class="subsection">' +
	'<div class="title">Prestige</div>' +
	'<div class="listing"><small>(Note : each heavenly chip grants you +2% CpS multiplier. You can gain more chips by resetting with a lot of cookies.)</small></div>' +
	'<div class="listing"><div class="icon" style="background-position:' + (-19 * 48) + 'px ' + (-7 * 48) + 'px;"></div> <span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + Beautify(Game.prestige['Heavenly chips']) + ' heavenly chip' + (Game.prestige['Heavenly chips'] == 1 ? '' : 's') + '</span> at ' + heavenlyMult + '% of their potential (+' + Beautify(Game.prestige['Heavenly chips'] * 2 * heavenlyMult / 100, 1) + '% CpS)</span></div>') : '') +

	'</div><div class="subsection">' +
	'<div class="title">Upgrades unlocked</div>' +
	'<div class="listing"><b>Unlocked :</b> ' + upgradesOwned + '/' + upgradesTotal + ' (' + Math.round((upgradesOwned / upgradesTotal) * 100) + '%)</div>' +
	'<div class="listing" style="overflow-y:hidden;">' + upgrades + '</div>' +
	(cookieUpgrades != '' ? ('<div class="listing"><b>Cookies</b></div>' +
	'<div class="listing" style="overflow-y:hidden;">' + cookieUpgrades + '</div>') : '') +
	(hiddenUpgrades != '' ? ('<div class="listing"><b>Debug</b></div>' +
	'<div class="listing" style="overflow-y:hidden;">' + hiddenUpgrades + '</div>') : '') +
	'</div><div class="subsection">' +
	'<div class="title">Achievements</div>' +
	'<div class="listing"><b>Unlocked :</b> ' + achievementsOwned + '/' + achievementsTotal + ' (' + Math.round((achievementsOwned / achievementsTotal) * 100) + '%)</div>' +
	'<div class="listing"><b>Milk :</b> ' + Math.round(Game.milkProgress * 100) + '% (' + milkName + ') <small>(Note : you gain milk through achievements. Milk can unlock unique upgrades over time.)</small></div>' +
	achievementsStr +
	(shadowAchievements != '' ? (
		'<div class="listing"><b>Shadow achievements</b> <small>(These are feats that are either unfair or difficult to attain. They do not give milk.)</small></div>' +
		'<div class="listing" style="overflow-y:hidden;">' + shadowAchievements + '</div>'
	) : '') +
	'</div>' +
	'<div style="padding-bottom:128px;"></div>'
	;
	return str;
}
/* Updates the menu. */
Overrides.UpdateMenu = function () {
	var str = '';
	if (Game.onMenu != '') {
		str += '<div style="position:absolute;top:8px;right:8px;cursor:pointer;font-size:16px;" ' + Game.clickStr + '="Game.ShowMenu();">X</div>';
	}
	if (Game.onMenu == 'prefs') {
		str += Overrides.UpdateMenuPrefs();
	}
	else if (Game.onMenu == 'main') {
		str +=
		'<div class="listing">This isn\'t really finished</div>' +
		'<div class="listing"><a class="option big title" ' + Game.clickStr + '="Game.ShowMenu(\'prefs\');">Menu</a></div>' +
		'<div class="listing"><a class="option big title" ' + Game.clickStr + '="Game.ShowMenu(\'stats\');">Stats</a></div>' +
		'<div class="listing"><a class="option big title" ' + Game.clickStr + '="Game.ShowMenu(\'log\');">Updates</a></div>' +
		'<div class="listing"><a class="option big title" ' + Game.clickStr + '="">Quit</a></div>' +
		'<div class="listing"><a class="option big title" ' + Game.clickStr + '="Game.ShowMenu(Game.onMenu);">Resume</a></div>';
	}
	else if (Game.onMenu == 'log') {
		str += Overrides.UpdateMenuLog();
	}
	else if (Game.onMenu == 'mods') {
		str += Overrides.UpdateMenuMods();
	}
	else if (Game.onMenu == 'stats') {
		str += Overrides.UpdateMenuStats();
	}
	l('menu').innerHTML = str;
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
LAUNCH COOKIE CLICKER OVERRIDES
=======================================================================================*/

// Launch Overrides Manager
Overrides.Init();

