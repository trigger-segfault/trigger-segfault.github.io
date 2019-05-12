/*=====================================================================================
COOKIES CLICKER HELPER
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-segfault/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-segfault/CookieMods/master/Overrides.js

/*=====================================================================================
HELPER DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
Helper = {};
/* The static class that manages the mod. */
Helper.Numbers = {};
/* The static class that manages the mod. */
Helper.Menu = {};
/* The static class that manages the mod. */
Helper.Mods = {};
/* True if the mod has been loaded. */
Helper.Loaded = false;

//#endregion
/*=====================================================================================
HELPER INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Overrides. */
Helper.Init = function () {

	Helper.Loaded = true;
}

//#endregion
/*=====================================================================================
HELPER MODS
=======================================================================================*/
//#region Mods

/*// Returns true if the specified mod is loaded.
function IsModLoaded(name) {
	return (document.getElementById('modscript_' + name) != null);
}
// Loads the Trigger Cookies Mod Manager.
function LoadTriggerCookies() {
	if (!IsModLoaded('TriggerCookies')) {
		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/TriggerCookies.js');
	}
}
// Loads the an original TriggerCookies mod if the it hasn't been loaded yet.
function LoadTriggerCookiesMod(name) {
	if (!IsModLoaded(name)) {
		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/' + name + '.js');
	}
}
// Returns true if the variable is defined and equals the value.
function IsDefined(name, value) {
	return eval('(typeof ' + name.split('.')[0] + ' !== \'undefined\') && (typeof ' + name + ' !== \'undefined\') && (' + name + ' === ' + value + ')');
}
// Creates an interval to wait until the specified mod is loaded.
function IntervalUntilModLoaded(mod, func) {
	var checkReady = setInterval(function () {
		if (IsDefined(mod + '.Loaded', 'true')) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}*/

//#endregion
/*=====================================================================================
HELPER NUMBERS
=======================================================================================*/
//#region Numbers

/* Strictly parses a float but also allows for place names. */
Helper.Numbers.ParseFloat = function (text, allowPlaceNames, canEndWith) {
	// Remove commas and set to lowercase
	text = text.replace(',', '').toLowerCase();
	var place = 1, multiplier = 1, value = NaN;

	if (canEndWith && text.indexOf(canEndWith) == (text.length - canEndWith.length) && text.lastIndexOf(canEndWith) == (text.length - canEndWith.length)) {
		text.replace(canEndWith, '');
	}
	if (allowPlaceNames) {
		for (var i = 0; i < Helper.Numbers.PlaceNames.length; i++) {
			place++;

			var numName = ' ' + Helper.Numbers.PlaceNames[i].toLowerCase();
			if (text.indexOf(numName) != -1 && text.indexOf(numName) == text.lastIndexOf(numName)) {
				multiplier = Math.pow(10, place * 3);
				text = text.replace(numName, ' ');
				break;
			}
			numName = ' ' + Helper.Numbers.PlaceNamesShort[i].toLowerCase();
			if (text.indexOf(numName) != -1 && text.indexOf(numName) == text.lastIndexOf(numName)) {
				multiplier = Math.pow(10, place * 3);
				text = text.replace(numName, ' ');
				break;
			}
		}
		text = text.replace(' ', '');
	}
	if (/^(\-|\+)?(([0-9]+\.?[0-9]*)|(\.[0-9]+)|Infinity)$/.test(text)) {
		value = parseFloat(text);
		value *= multiplier;
	}

	return value;
}
/* Strictly parses an integer but also allows for place names. */
Helper.Numbers.ParseInt = function (text, allowPlaceNames, canEndWith) {
	// Remove commas and set to lowercase
	text = text.replace(',', '').toLowerCase();
	var place = 1, multiplier = 1, value = NaN;

	if (canEndWith && text.indexOf(canEndWith) == (text.length - canEndWith.length) && text.lastIndexOf(canEndWith) == (text.length - canEndWith.length)) {
		text.replace(canEndWith, '');
	}
	if (allowPlaceNames) {
		for (var i = 0; i < Helper.Numbers.PlaceNames.length; i++) {
			place++;

			var numName = ' ' + Helper.Numbers.PlaceNames[i].toLowerCase();
			if (text.indexOf(numName) != -1 && text.indexOf(numName) == text.lastIndexOf(numName)) {
				multiplier = Math.pow(10, place * 3);
				text = text.replace(numName, ' ');
				break;
			}
			numName = ' ' + Helper.Numbers.PlaceNamesShort[i].toLowerCase();
			if (text.indexOf(numName) != -1 && text.indexOf(numName) == text.lastIndexOf(numName)) {
				multiplier = Math.pow(10, place * 3);
				text = text.replace(numName, ' ');
				break;
			}
		}
		text = text.replace(' ', '');
	}
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(text)) {
		value = parseInt(text);
		value *= multiplier;
	}

	return value;
}

Helper.Numbers.GetTime = function (time, format) {
	var seconds = 0, minutes = 0, hours = 0;
	var days = 0, weeks = 0;
	var str = '';

	if (format == 0) {
		seconds = (time / 1000);
	}
	else if (format == 1) {
		seconds = (time / 1000) % 60;
		minutes = (time / 1000 / 60);
	}
	else if (format == 2) {
		seconds = (time / 1000) % 60;
		minutes = (time / 1000 / 60) % 60;
		hours = (time / 1000 / 60 / 60);
	}
	else if (format == 3) {
		seconds = (time / 1000) % 60;
		minutes = (time / 1000 / 60) % 60;
		hours = (time / 1000 / 60 / 60) % 24;
		days = (time / 1000 / 60 / 60 / 24)
	}
	else if (format == 4) {
		seconds = (time / 1000) % 60;
		minutes = (time / 1000 / 60) % 60;
		hours = (time / 1000 / 60 / 60) % 24;
		days = (time / 1000 / 60 / 60 / 24) % 7;
		weeks = (time / 1000 / 60 / 60 / 24 / 7);
	}

	if (Math.floor(weeks) != 0)
		str += Beautify(weeks) + 'w ' + Beautify(days) + 'd';
	else if (Math.floor(days) != 0)
		str += Beautify(days) + 'd ' + Beautify(hours) + 'h';
	else if (Math.floor(hours) != 0)
		str += Beautify(hours) + 'h ' + Beautify(minutes) + 'm';
	else if (Math.floor(minutes) != 0)
		str += Beautify(minutes) + 'm ' + Beautify(seconds) + 's';
	else
		str += Beautify(seconds) + 's';

	return str;
}

//#endregion
/*=====================================================================================
HELPER MENU
=======================================================================================*/
//#region Menu

/* Writes the header of a section with a name and icon. */
Helper.Menu.WriteSectionHeader = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';

	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';
	return str;
}
/* Writes the middle of a section with spacing or a line. */
Helper.Menu.WriteSectionMiddle = function (useLine) {
	var str = '';
	if (useLine)
		str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 6px 0px 6px 14px;"></div>';
	else
		str += '<div style="width: 100%; margin: 12px 0px;"></div>';
	return str;
}
/* Writes the end of a section. */
Helper.Menu.WriteSectionEnd = function () {
	var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
	return str;
}
/* Writes spacing on the same line. */
Helper.Menu.WriteSpacing = function (pixels) {
	if (!pixels)
		pixels = 8;
	var str = '<div style="margin-left: ' + pixels.toString() + 'px; display: inline;"></div>';
	return str;
}

//#endregion
/*=====================================================================================
HELPER VARIABLES
=======================================================================================*/
//#region Variables

Helper.Numbers.PlaceNames = [
	'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion',
	'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quattuordecillion', 'quindecillion'
];
Helper.Numbers.PlaceNamesShort = ['M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UnD', 'DoD', 'TrD', 'QaD', 'QiD'];

//#endregion
/*=====================================================================================
LAUNCH COOKIE CLICKER HELPER
=======================================================================================*/

// Launch Helper
Helper.Init();

