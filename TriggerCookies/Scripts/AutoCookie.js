/*=====================================================================================
AUTO-COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/AutoCookie.js

// Based off "Cookieclicker Bots".
// Link: https://gist.githubusercontent.com/pernatiy/38bc231506b06fd85473/raw/cc.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'AutoCookie';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace('Scripts/' + name + '.js', '');
	return url;
}
/* Returns true if the specified mod is loaded. */
function IsModLoaded(name) {
	return (document.getElementById('modscript_' + name) != null);
}
/* Loads the Trigger Cookies Mod Manager. */
function LoadTriggerCookies() {
	if (!IsModLoaded('TriggerCookies')) {
		Game.LoadMod(GetModURL() + 'Scripts/TriggerCookies.js');
	}
}
/* Loads the specified Trigger Cookies Mod. */
function LoadMod(name) {
	if (!IsModLoaded(name)) {
		Game.LoadMod(GetModURL() + 'Scripts/' + name + '.js');
	}
}
/* Returns true if the variable is defined and equals the value. */
function IsDefined(name, value) {
	return eval('(typeof ' + name.split('.')[0] + ' !== \'undefined\') && (typeof ' + name + ' !== \'undefined\') && (' + name + ' === ' + value + ')');
}
/* Creates an interval to wait until TriggerCookies is loaded */
function IntervalUntilLoaded(func) {
	var checkReady = setInterval(function () {
		if (IsDefined('TriggerCookies.Loaded', 'true')) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}
/* Creates an interval to wait until all the specified mods are loaded loaded */
function IntervalUntilAllLoaded(mods, func) {
	var checkReady = setInterval(function () {
		var allLoaded = true;
		for (var i = 0; i < mods.length; i++) {
			if (!IsDefined(mods[i] + '.Loaded', 'true')) { allLoaded = false; break; }
		}
		if (allLoaded && IsDefined('TriggerCookies.Loaded', 'true')) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}

/* Returns the element used in Auto Cookie. */
function lAuto(name) {
	if (name.indexOf('AutoCookie') != 0)
		return l('AutoCookie' + name);
	return l(name);
}
/* Returns the element with the name used in Auto Cookie. */
function iAuto(name) {
	if (name.indexOf('AutoCookie') != 0)
		return 'AutoCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
AutoCookie = {};
/* True if the mod has been loaded. */
AutoCookie.Loaded = false;
/* True if the mod is enabled. */
AutoCookie.Enabled = false;

//#endregion
/*=====================================================================================
AUTO-COOKIE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Auto-Cookie. */
AutoCookie.Init = function () {
	LoadTriggerCookies();
	LoadMod('CalcCookie');

	IntervalUntilAllLoaded(['CalcCookie'], function () {
		TriggerCookies.AddMod('Auto Cookie', 'AutoCookie', [22, 7], AutoCookie.Enable, AutoCookie.Disable, AutoCookie.Load, AutoCookie.Save, AutoCookie.WriteMenu, AutoCookie.UpdateMenu, true);
		TriggerCookies.AddTab('Automation', 300);

		AutoCookie.Loaded = true;
	});
}

/* Enables Auto-Cookie. */
AutoCookie.Enable = function (firstTime) {
	
	if (firstTime) {


	}
	AutoCookie.Actions['autobuy'].Enable(false);
	AutoCookie.Actions['checkautoclick'].Enable(false);
	AutoCookie.Actions['checkascendinputs'].Enable(false);
	AutoCookie.Actions['updateclickrate'].Enable(false);

	AutoCookie.Enabled = true;
}
/* Disables Auto-Cookie. */
AutoCookie.Disable = function () {

	AutoCookie.DisableAll();
	AutoCookie.Actions['autobuy'].Disable(false);
	AutoCookie.Actions['checkautoclick'].Disable(false);
	AutoCookie.Actions['checkascendinputs'].Disable(false);
	AutoCookie.Actions['updateclickrate'].Disable(false);

	AutoCookie.Enabled = false;
}
/* Loads the mod settings. */
AutoCookie.Load = function (data) {
	function isValid(varname, name, value) { return (name == varname && !isNaN(value)); }
	function readAction(action, name, value) {
		if (action == name) {
			if (value && !AutoCookie.Actions[action].Enabled)
				AutoCookie.Actions[action].Enable(false);
			else if (!value && AutoCookie.Actions[action].Enabled)
				AutoCookie.Actions[action].Disable(false);
		}
	}

	var lines = data.split('|');
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.indexOf('=') != -1) {
			var line = line.split('=');
			var name = line[0], valueStr = line[1], value = parseInt(valueStr), valuef = parseFloat(valueStr + 'f');

			readAction('autoclick', name, value);
			readAction('instantclick', name, value);
			readAction('gold', name, value);
			readAction('wrath', name, value);
			readAction('gnotify', name, value);
			readAction('wrinkler', name, value);
			readAction('reindeer', name, value);

			readAction('autobuildings', name, value);
			readAction('autoupgrades', name, value);
			readAction('autoresearch', name, value);
			readAction('autoseason', name, value);

			readAction('autoascend', name, value);
			readAction('allowdevil', name, value);
			readAction('chocegg', name, value);

			readAction('maintainseason', name, value);
			readAction('maintainpledge', name, value);
			readAction('maintainelder', name, value);

			if (isValid('autoclickspeed', name, value)) {
				AutoCookie.AutoClickRate = value;
				AutoCookie.Actions['autoclick'].Delay = Math.floor(1000.0 / AutoCookie.AutoClickRate);
				if (AutoCookie.Actions['autoclick'].Enabled) {
					AutoCookie.Actions['autoclick'].Action(false);
					AutoCookie.Actions['autoclick'].Action(false);
				}
			}

			if (isValid('ascendminhc', name, value))
				AutoCookie.AscendMinChips = value;
			if (isValid('ascendmaxhc', name, value))
				AutoCookie.AscendMaxChips = value;
			if (isValid('ascendminmult', name, valuef))
				AutoCookie.AscendMinMultiplier = valuef;
			if (isValid('ascendmaxmult', name, valuef))
				AutoCookie.AscendMaxMultiplier = valuef;
			if (isValid('hccookies', name, value))
				AutoCookie.ChipsForCookies = value;

			if (isValid('glevel', name, value))
				AutoCookie.GrandmapocalypseLevel = valueStr;

			if (name == 'seasoninput')
				AutoCookie.MaintainSeason = valueStr;
		}
	}
}
/* Saves the mod settings. */
AutoCookie.Save = function () {
	function write(name, value) { return name + '=' + value.toString() + '|'; }
	function writeAction(name) { return name + '=' + (AutoCookie.Actions[name].Enabled ? 1 : 0).toString() + '|'; }

	var str = '';
	str +=
	writeAction('autoclick') +
	writeAction('instantclick') +
	writeAction('gold') +
	writeAction('wrath') +
	writeAction('gnotify') +
	writeAction('wrinkler') +
	writeAction('reindeer') +

	writeAction('autobuildings') +
	writeAction('autoupgrades') +
	writeAction('autoresearch') +
	writeAction('autoseason') +

	writeAction('autoascend') +
	writeAction('allowdevil') +
	writeAction('chocegg') +

	writeAction('maintainseason') +
	writeAction('maintainpledge') +
	writeAction('maintainelder') +

	write('autoclickspeed', AutoCookie.AutoClickRate) +

	write('ascendminhc', AutoCookie.AscendMinChips) +
	write('ascendmaxhc', AutoCookie.AscendMaxChips) +
	write('ascendminmult', AutoCookie.AscendMinMultiplier) +
	write('ascendmaxmult', AutoCookie.AscendMaxMultiplier) +
	write('hccookies', AutoCookie.ChipsForCookies) +

	write('seasoninput', AutoCookie.MaintainSeason) +

	write('glevel', AutoCookie.GrandmapocalypseLevel) +

	'';
	return str;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE MENU
=======================================================================================*/
//#region Menu

/* Writes the Auto-Cookie buttons. */
AutoCookie.WriteMenu = function (tab) {

	var str = '';

	if (tab == 'Automation') {

		str += Helper.Menu.WriteSectionHeader('Auto Clicking', [12, 0]);

		str += '<div class="listing">' +
				AutoCookie.WriteButton('allclick') +
				AutoCookie.WriteButton('noneclick') +
				'</div>';

		str += '<div class="listing">' +
				AutoCookie.WriteButton('gold') +
				AutoCookie.WriteButton('wrath') +
				AutoCookie.WriteButton('gnotify') +
				Helper.Menu.WriteSpacing() +
				AutoCookie.WriteButton('wrinkler') +
				AutoCookie.WriteButton('reindeer') +
				'</div>';

		str += '<div class="listing">' +
				'Clicks per second (max 250): ' +
				'<input id="' + iAuto('clickRateInput') + '" type="text" value="' + AutoCookie.AutoClickRate + '" style="width: 80px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				AutoCookie.WriteButton('autoclick') +
				AutoCookie.WriteButton('instantclick') +
				'</div>';



		str += Helper.Menu.WriteSectionEnd();
		str += Helper.Menu.WriteSectionHeader('Autobuy', [15, 0]);

		str += '<div class="listing">' +
				AutoCookie.WriteButton('allbuy') +
				AutoCookie.WriteButton('nonebuy') +
				'</div>';

		str += '<div class="listing">' +
				AutoCookie.WriteButton('autobuildings') +
				AutoCookie.WriteButton('autoupgrades') +
				AutoCookie.WriteButton('autoresearch') +
				AutoCookie.WriteButton('autoseason') +
				'<label style="display: none">Disables the settings below until the cycle is complete</label>' +


				//'<label id="' + iAuto('nextItem') + '"> Next ' + AutoCookie.NextItem.Type + ': ' + AutoCookie.NextItem.Name + '</label>' +
				'</div>';
		str +=
		'<div class="listing">' +
		AutoCookie.WriteButton('maintainelder') +
		AutoCookie.WriteButton('maintainpledge') +
		AutoCookie.WriteButton('maintainseason') +
		Helper.Menu.WriteSpacing() +
		'<select id="' + iAuto('seasonInput') + '" onchange="AutoCookie.CheckSeasonInput();" style="font-size: 14px; background-color: #111; color: #FFF; border: 1px ridge #444; padding: 2px;">' +
		'<option value="christmas"' + (AutoCookie.MaintainSeason == 'christmas' ? ' selected' : '') + '>Christmas</option>' +
		'<option value="halloween"' + (AutoCookie.MaintainSeason == 'halloween' ? ' selected' : '') + '>Halloween</option>' +
		'<option value="valentines"' + (AutoCookie.MaintainSeason == 'valentines' ? ' selected' : '') + '>Valentines Day</option>' +
		'<option value="fools"' + (AutoCookie.MaintainSeason == 'fools' ? ' selected' : '') + '>Business Day</option>' +
		'<option value="easter"' + (AutoCookie.MaintainSeason == 'easter' ? ' selected' : '') + '>Easter</option>' +
		'</select>' +
		'</div>';

		str += '<div class="listing">' +
		'Grandmapocalypse Research: ' +
		'<select id="' + iAuto('gResearchInput') + '" onchange="AutoCookie.CheckGResearchInput();" style="font-size: 14px; background-color: #111; color: #FFF; border: 1px ridge #444; padding: 2px;">' +
		'<option value="0"' + (AutoCookie.GrandmapocalypseLevel == 0 ? ' selected' : '') + '>None</option>' +
		'<option value="1"' + (AutoCookie.GrandmapocalypseLevel == 1 ? ' selected' : '') + '>One mind</option>' +
		'<option value="2"' + (AutoCookie.GrandmapocalypseLevel == 2 ? ' selected' : '') + '>Communal brainsweep</option>' +
		'<option value="3"' + (AutoCookie.GrandmapocalypseLevel == 3 ? ' selected' : '') + '>Elder Pact</option>' +
		'</select>' +
		'</div>';

		str += '<div class="listing"><b id="' + iAuto('nextType') + '">Next item : </b> <div id="' + iAuto('nextItem') + '" class="priceoff">' + Beautify(Game.heavenlyCookies) + '</div></div>';

		str += Helper.Menu.WriteSectionEnd();

		str += Helper.Menu.WriteSectionHeader('Ascending', [19, 7]);

		str += '<div class="listing">' +
				AutoCookie.WriteButton('autoascend') +
				AutoCookie.WriteButton('allowdevil') +
				AutoCookie.WriteButton('chocegg') +
				'<label style="display: none">This applies for manual ascends as well</label>' +
				'</div>';

		str += '<div class="listing">' +
				'Min Ascend Chips: ' +
				'<input id="' + iAuto('ascendMinChips') + '" type="text" value="' + Beautify(AutoCookie.AscendMinChips) + '" style="width: 160px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				'Min Ascend Multiplier: ' +
				'<input id="' + iAuto('ascendMinMultiplier') + '" type="text" value="' + Beautify(AutoCookie.AscendMinMultiplier, 2) + '" style="width: 80px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				'</div>';
		str += '<div class="listing">' +
				'Max Ascend Chips: ' +
				'<input id="' + iAuto('ascendMaxChips') + '" type="text" value="' + Beautify(AutoCookie.AscendMaxChips) + '" style="width: 160px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				'Max Ascend Multiplier: ' +
				'<input id="' + iAuto('ascendMaxMultiplier') + '" type="text" value="' + Beautify(AutoCookie.AscendMaxMultiplier, 2) + '" style="width: 80px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				'</div>';
		str += '<div class="listing">' +
				'Percentage of chips used for cookies: ' +
				'<input id="' + iAuto('chipsForCookies') + '" type="text" value="' + AutoCookie.ChipsForCookies + '%" style="width: 60px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				'</div>';


		var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));
		var heavenlyChips = Game.heavenlyChipsEarned;

		// log ten so the scale progression is actually useful
		var logMinChips = Math.log(AutoCookie.AscendMinChips) / Math.log(10);
		var logMaxChips = Math.log(AutoCookie.AscendMaxChips) / Math.log(10);
		var logChips = Math.log(Game.heavenlyChipsEarned) / Math.log(10);

		var scale = 0.0;
		if (heavenlyChips >= AutoCookie.AscendMinChips) {
			if (heavenlyChips >= AutoCookie.AscendMaxChips) {
				scale = 1.0;
			}
			else {
				scale = (logChips - logMinChips) / (logMaxChips - logMinChips);
				scale = Math.sqrt(1 - Math.pow(1 - scale, 2));
			}
		}

		var multiplier = AutoCookie.AscendMaxMultiplier + (1.0 - scale) * (AutoCookie.AscendMinMultiplier - AutoCookie.AscendMaxMultiplier);
		var nextAscend = Game.heavenlyChipsEarned * (multiplier - 1);

		if (heavenlyChips < AutoCookie.AscendMinChips) {
			multiplier = 0;
			scale = 0.0;
			nextAscend = AutoCookie.AscendMinChips;
		}

		str += '<div class="listing"><b>Next Ascend at :</b>' +
			Helper.Menu.WriteSpacing(8) +
			'<div id="' + iAuto('nextAscend') + '" class="price plain heavenly">' + Beautify(nextAscend) +
			' <small>(scale : ' + Beautify(scale, 2) + '  multiplier : ' + Beautify(multiplier) + ')</small>' +
			(ascendNowToGet >= nextAscend ? ' Ready'.fontcolor('green') : '') +
			'</div>' +
			'</div></div>';

		str += Helper.Menu.WriteSectionEnd();

		str += Helper.Menu.WriteSectionHeader('Achievements', [12, 5]);

		str += '<div class="listing"><div class="priceoff">' + 'No achievement hunting features yet...' + '</div></div>';

		str += Helper.Menu.WriteSectionEnd();
	}

	return str;
}
/* Writes the Auto-Cookie buttons. */
AutoCookie.UpdateMenu = function () {

	//lAuto('nextItem').innerHTML = (AutoCookie.NextItem.Type != 'invalid' ? ('Next ' + AutoCookie.NextItem.Type + ': ' + AutoCookie.NextItem.Name) : '');

	if (lAuto('nextItem') != null) {
		lAuto('nextItem').innerHTML = (AutoCookie.NextItem.Type != 'invalid' ? AutoCookie.NextItem.Name + (AutoCookie.NextItem.CanAfford() ? '' : ' <small>(' + Helper.Numbers.GetTime(AutoCookie.NextItem.Time * 1000, 4) + ')</small>') : 'N/A');
		lAuto('nextType').innerHTML = 'Next ' + (AutoCookie.NextItem.Type != 'invalid' ? AutoCookie.NextItem.Type : 'item') + ' : ';
	}

	AutoCookie.UpdateAscendInfo();
}

AutoCookie.UpdateAscendInfo = function () {

	var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));
	var heavenlyChips = Game.heavenlyChipsEarned;

	// log ten so the scale progression is actually useful
	var logMinChips = Math.log(AutoCookie.AscendMinChips) / Math.log(10);
	var logMaxChips = Math.log(AutoCookie.AscendMaxChips) / Math.log(10);
	var logChips = Math.log(Game.heavenlyChipsEarned) / Math.log(10);

	var scale = 0.0;
	if (heavenlyChips >= AutoCookie.AscendMinChips) {
		if (heavenlyChips >= AutoCookie.AscendMaxChips) {
			scale = 1.0;
		}
		else {
			scale = (logChips - logMinChips) / (logMaxChips - logMinChips);
			scale = Math.sqrt(1 - Math.pow(1 - scale, 2));
		}
	}

	var multiplier = AutoCookie.AscendMaxMultiplier + (1.0 - scale) * (AutoCookie.AscendMinMultiplier - AutoCookie.AscendMaxMultiplier);
	var nextAscend = Game.heavenlyChipsEarned * (multiplier - 1);

	if (heavenlyChips < AutoCookie.AscendMinChips) {
		multiplier = 0;
		scale = 0.0;
		nextAscend = AutoCookie.AscendMinChips;
	}

	AutoCookie.ChipsForAscend = nextAscend;

	if (lAuto('nextAscend') != null) {
		lAuto('nextAscend').innerHTML =
			Beautify(AutoCookie.ChipsForAscend) +
			' <small>(scale : ' + Beautify(scale, 4) + '  multiplier : ' + Beautify(multiplier) + ')</small>' +
			(ascendNowToGet >= nextAscend ? ' Ready'.fontcolor('green') : '');
	}
}

//#endregion
//============ MODES ============
//#region Modes

AutoCookie.UpdateButtons = function () {

	for (var i in AutoCookie.Actions) {
		if (lAuto(i + 'Button') != null) {
			AutoCookie.SetButtonVisual(i);
		}
	}
}

AutoCookie.GetNumber = function (inputID) {
	var numNames = [
		' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion',
		' nonillion', ' decillion', ' undecillion', ' duodecillion', ' tredecillion', ' quattuordecillion', ' quindecillion'
	];
	var numNames2 = [' M', ' B', ' T', ' Qa', ' Qi', ' Sx', ' Sp', ' Oc', ' No', ' Dc', ' UnD', ' DoD', ' TrD', ' QaD', ' QiD'];

	var text = lAuto(inputID).value;
	// Remove commas and set to lowercase
	text = text.replace(',', '').toLowerCase();
	var place = 1, multiplier = 1, value = NaN;

	for (var i = 0; i < numNames.length; i++) {
		place++;

		var numName = numNames[i].toLowerCase();
		var index1 = text.indexOf(numName);
		if (index1 != -1 && index1 == text.lastIndexOf(numName)) {
			multiplier = Math.pow(10, place * 3);
			text = text.replace(numName, ' ');
			break;
		}
		numName = numNames2[i].toLowerCase();
		index1 = text.indexOf(numName);
		if (index1 != -1 && index1 == text.lastIndexOf(numName)) {
			multiplier = Math.pow(10, place * 3);
			text = text.replace(numName, ' ');
			break;
		}
	}
	text = text.replace(' ', '');
	if (/^(\-|\+)?(([0-9]+\.?[0-9]*)|(\.[0-9]+)|Infinity)$/.test(text)) {
		value = parseFloat(text);
		value *= multiplier;
		//Math.floor(value);
	}

	return value;
}
AutoCookie.GetNumberSimple = function (inputID) {
	
	var text = lAuto(inputID).value;
	var value = NaN;
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(text)) {
		value = parseInt(text);
	}

	return value;
}
AutoCookie.GetNumberSimplePercentage = function (inputID) {
	
	var text = lAuto(inputID).value;
	if (text.indexOf('%') == text.lastIndexOf('%'))
		text = text.replace('%', '');
	var value = NaN;
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(text)) {
		value = parseInt(text);
	}

	return value;
}
AutoCookie.CheckAutoClick = function () {
	
	if (lAuto('clickRateInput') != null) {
		var invalid = true;

		var newRate = Math.floor(AutoCookie.GetNumberSimple('clickRateInput'));

		if (!isNaN(newRate)) {
			if (newRate < 1) {
				//newRate = 1;
			}
			else if (newRate > 250) {
				//newRate = 250;
			}
			else {
				invalid = false;
				if (newRate != AutoCookie.AutoClickRate) {
					AutoCookie.AutoClickRate = newRate;

					AutoCookie.Actions['autoclick'].Delay = Math.floor(1000.0 / AutoCookie.AutoClickRate);
					if (AutoCookie.Actions['autoclick'].Enabled) {
						AutoCookie.Actions['autoclick'].Action(false);
						AutoCookie.Actions['autoclick'].Action(false);
					}
				}
			}
		}
		lAuto('clickRateInput').style.color = (invalid ? '#F00' : '#FFF');
	}
}
AutoCookie.CheckSeasonInput = function () {
	
	if (lAuto('seasonInput') != null) {
		var season = lAuto('seasonInput').value;
		if (season != AutoCookie.MaintainSeason) {
			AutoCookie.MaintainSeason = season;
		}
	}
}
AutoCookie.CheckGResearchInput = function () {
	
	if (lAuto('gResearchInput') != null) {
		var level = parseInt(lAuto('gResearchInput').value);
		if (level != AutoCookie.GrandmapocalypseLevel) {
			AutoCookie.GrandmapocalypseLevel = level;
		}
	}
}
AutoCookie.CheckAscendInputs = function () {

	var updated = false;

	if (lAuto('ascendMinChips') != null) {
		var invalid = true;
		var newMinChips = Math.floor(AutoCookie.GetNumber('ascendMinChips'));

		if (!isNaN(newMinChips) && newMinChips >= 1 && newMinChips < AutoCookie.AscendMaxChips) {
			invalid = false;
			if (newMinChips != AutoCookie.AscendMinChips) {
				AutoCookie.AscendMinChips = newMinChips;
				updated = true;
			}
		}
		lAuto('ascendMinChips').style.color = (invalid ? '#F00' : '#FFF');
	}
	if (lAuto('ascendMaxChips') != null) {
		var invalid = true;
		var newMaxChips = Math.floor(AutoCookie.GetNumber('ascendMaxChips'));

		if (!isNaN(newMaxChips) && newMaxChips >= 1 && newMaxChips > AutoCookie.AscendMinChips) {
			invalid = false;
			if (newMaxChips != AutoCookie.AscendMaxChips) {
				AutoCookie.AscendMaxChips = newMaxChips;
				updated = true;
			}
		}
		lAuto('ascendMaxChips').style.color = (invalid ? '#F00' : '#FFF');
	}
	if (lAuto('ascendMinMultiplier') != null) {
		var invalid = true;
		var newMinMult = AutoCookie.GetNumber('ascendMinMultiplier');

		if (!isNaN(newMinMult) && newMinMult >= 1 && newMinMult > AutoCookie.AscendMaxMultiplier) {
			invalid = false;
			if (newMinMult != AutoCookie.AscendMinMultiplier) {
				AutoCookie.AscendMinMultiplier = newMinMult;
				updated = true;
			}
		}
		lAuto('ascendMinMultiplier').style.color = (invalid ? '#F00' : '#FFF');
	}
	if (lAuto('ascendMaxMultiplier') != null) {
		var invalid = true;
		var newMaxMult = AutoCookie.GetNumber('ascendMaxMultiplier');

		if (!isNaN(newMaxMult) && newMaxMult >= 1 && newMaxMult < AutoCookie.AscendMinMultiplier) {
			invalid = false;
			if (newMaxMult != AutoCookie.AscendMaxMultiplier) {
				AutoCookie.AscendMaxMultiplier = newMaxMult;
				updated = true;
			}
		}
		lAuto('ascendMaxMultiplier').style.color = (invalid ? '#F00' : '#FFF');
	}
	
	if (lAuto('chipsForCookies') != null) {
		var invalid = true;
		var newChips = Math.floor(AutoCookie.GetNumberSimplePercentage('chipsForCookies'));

		if (!isNaN(newChips) && newChips >= 0 && newChips <= 100) {
			invalid = false;
			if (newChips != AutoCookie.ChipsForCookies) {
				AutoCookie.ChipsForCookies = newChips;
				updated = true;
			}
		}
		lAuto('chipsForCookies').style.color = (invalid ? '#F00' : '#FFF');
	}

	if (updated)
		AutoCookie.UpdateAscendInfo();
}
/* Enables all important modes. */
AutoCookie.EnabledAll = function () {
	AutoCookie.Actions['autoclick'].Enable(false);
	AutoCookie.Actions['instantclick'].Enable(false);
	AutoCookie.Actions['gold'].Enable(false);
	AutoCookie.Actions['wrath'].Enable(false);
	AutoCookie.Actions['wrinkler'].Enable(false);
	AutoCookie.Actions['reindeer'].Enable(false);

	AutoCookie.Actions['autobuildings'].Enable(false);
	AutoCookie.Actions['autoupgrades'].Enable(false);
	AutoCookie.Actions['autoresearch'].Enable(false);
	AutoCookie.Actions['autoseason'].Enable(false);

	AutoCookie.Actions['autoascend'].Enable(false);
	AutoCookie.Actions['allowdevil'].Enable(false);
	AutoCookie.Actions['chocegg'].Enable(false);

	AutoCookie.Actions['maintainseason'].Enable(false);
	AutoCookie.Actions['maintainpledge'].Enable(false);
	AutoCookie.Actions['maintainelder'].Enable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Disables all modes. */
AutoCookie.DisableAll = function () {
	AutoCookie.Actions['autoclick'].Disable(false);
	AutoCookie.Actions['instantclick'].Disable(false);
	AutoCookie.Actions['gold'].Disable(false);
	AutoCookie.Actions['wrath'].Disable(false);
	AutoCookie.Actions['wrinkler'].Disable(false);
	AutoCookie.Actions['reindeer'].Disable(false);

	AutoCookie.Actions['autobuildings'].Disable(false);
	AutoCookie.Actions['autoupgrades'].Disable(false);
	AutoCookie.Actions['autoresearch'].Disable(false);
	AutoCookie.Actions['autoseason'].Disable(false);

	AutoCookie.Actions['maintainseason'].Disable(false);
	AutoCookie.Actions['maintainpledge'].Disable(false);
	AutoCookie.Actions['maintainelder'].Disable(false);

	AutoCookie.Actions['autoascend'].Disable(false);
	AutoCookie.Actions['allowdevil'].Disable(false);
	AutoCookie.Actions['chocegg'].Disable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Enables all important modes. */
AutoCookie.EnabledAllClick = function () {
	AutoCookie.Actions['autoclick'].Enable(false);
	AutoCookie.Actions['instantclick'].Disable(false);
	AutoCookie.Actions['gold'].Enable(false);
	AutoCookie.Actions['wrath'].Enable(false);
	AutoCookie.Actions['wrinkler'].Enable(false);
	AutoCookie.Actions['reindeer'].Enable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Disables all modes. */
AutoCookie.DisableAllClick = function () {
	AutoCookie.Actions['autoclick'].Disable(false);
	AutoCookie.Actions['instantclick'].Disable(false);
	AutoCookie.Actions['gold'].Disable(false);
	AutoCookie.Actions['wrath'].Disable(false);
	AutoCookie.Actions['wrinkler'].Disable(false);
	AutoCookie.Actions['reindeer'].Disable(false);


	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Enables all important modes. */
AutoCookie.EnabledAllBuy = function () {
	AutoCookie.Actions['autobuildings'].Enable(false);
	AutoCookie.Actions['autoupgrades'].Enable(false);
	AutoCookie.Actions['autoresearch'].Enable(false);
	AutoCookie.Actions['autoseason'].Enable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}
/* Disables all modes. */
AutoCookie.DisableAllBuy = function () {
	AutoCookie.Actions['autobuildings'].Disable(false);
	AutoCookie.Actions['autoupgrades'].Disable(false);
	AutoCookie.Actions['autoresearch'].Disable(false);
	AutoCookie.Actions['autoseason'].Disable(false);

	AutoCookie.Actions['maintainseason'].Disable(false);
	AutoCookie.Actions['maintainpledge'].Disable(false);
	AutoCookie.Actions['maintainelder'].Disable(false);

	AutoCookie.UpdateButtons();
	Game.UpdateMenu();
}

/* Auto-clicks the big cookie. */
AutoCookie.AutoClick = function () {
	var click = Game.Click;
	Game.ClickCookie();
	Game.Click = click;
}
AutoCookie.InstantClick = function () {
	if (Game.OnAscend) { }
	else if (new Date().getTime() - Game.lastClick < 1000 / 250) { }
	else
	{
		var moni = Game.computedMouseCps * AutoCookie.AutoClickRate / 2;
		Game.Earn(moni);
		Game.handmadeCookies += moni;

		Game.cookieClicks += AutoCookie.AutoClickRate / 2;
		Game.lastClick = new Date().getTime() + 490;
	}
}
/* Clicks the golden cookies. */
AutoCookie.ClickGoldenCookies = function () {
	// Prevent dealing with golden cookies while ascended.
	if (!Game.AscendTimer && !Game.OnAscend) {
		if (Game.goldenCookie.life > 0 && (Game.goldenCookie.wrath == 0 || AutoCookie.Actions['wrath'].Enabled)) {
			var click = Game.Click;
			Game.goldenCookie.click();
			Game.Click = click;
			if (AutoCookie.Actions['gnotify'].Enabled)
				AutoCookie.NotifySound.play();
		}
	}
}
/* Auto-clicks the big cookie. */
AutoCookie.ToggleWrath = function () {

}
/* Alerts when golden cookies appear. */
AutoCookie.GoldenCookieAlert = function () {
	// Prevent dealing with golden cookies while ascended.
	if (!Game.AscendTimer && !Game.OnAscend) {
		if (Game.goldenCookie.life > 0 && (Game.goldenCookie.wrath == 0 || AutoCookie.Actions['wrath'].Enabled) && !AutoCookie.Actions['gold'].Enabled)
			AutoCookie.NotifySound.play();
	}
}
/* Pops wrinklers when they appear. */
AutoCookie.PopWrinklers = function () {
	for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];
		if (me.phase == 2) {
			me.hp = 0;
		}
	}
}
/* Clicks a reindeer if one exists. */
AutoCookie.ClickReindeer = function () {
	// This is what happens when a reindeer is clicked. There's no function for it.
	var me = Game.seasonPopup;
	if (me.life > 0) {
		if (me.type == 'reindeer') {
			me.toDie = 1;
			Game.reindeerClicked++;

			var moni = Math.max(25, Game.cookiesPs * 60 * 1); //1 minute of cookie production, or 25 cookies - whichever is highest
			if (Game.Has('Ho ho ho-flavored frosting'))
				moni *= 2;
			Game.Earn(moni);

			var failRate = 0.8;
			var cookie = '';
			if (Game.HasAchiev('Let it snow'))
				failRate = 0.6;
			if (Game.Has('Santa\'s bottomless bag'))
				failRate *= 0.9;
			if (Game.Has('Starsnow'))
				failRate *= 0.95;
			if (Math.random() > failRate) {//christmas cookie drops
				cookie = choose(['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits']);
				if (!Game.HasUnlocked(cookie) && !Game.Has(cookie)) {
					Game.Unlock(cookie);
				}
				else cookie = '';
			}

			if (Game.prefs.popups)
				Game.Popup('You found ' + choose(['Dasher', 'Dancer', 'Prancer', 'Vixen', 'Comet', 'Cupid', 'Donner', 'Blitzen', 'Rudolph']) + '!<br>The reindeer gives you ' + Beautify(moni) + ' cookies.' + (cookie == '' ? '' : '<br>You are also rewarded with ' + cookie + '!'));
			else
				Game.Notify('You found ' + choose(['Dasher', 'Dancer', 'Prancer', 'Vixen', 'Comet', 'Cupid', 'Donner', 'Blitzen', 'Rudolph']) + '!', 'The reindeer gives you ' + Beautify(moni) + ' cookies.' + (cookie == '' ? '' : '<br>You are also rewarded with ' + cookie + '!'), [12, 9], 6);

			l('seasonPopup').style.display = 'none';
			me.minTime = me.getMinTime();
			me.maxTime = me.getMaxTime();
		}
	}
}

/* Autobuys the next item. */
AutoCookie.Autobuy = function () {
	// Prevent buying while ascended.
	if (!Game.AscendTimer && !Game.OnAscend) {
		AutoCookie.GoalItem = new BuyoutItem();
		var buyBuildings = AutoCookie.Actions['autobuildings'].Enabled;
		var buyUpgrades = AutoCookie.Actions['autoupgrades'].Enabled;
		var buyResearch = AutoCookie.Actions['autoresearch'].Enabled;
		var buySeasons = AutoCookie.Actions['autoseason'].Enabled;
		var maintainSeason = (AutoCookie.Actions['maintainseason'].Enabled ? AutoCookie.MaintainSeason : '');
		var bestItem = new BuyoutItem();

		if (buyResearch) {
			CalcCookie.Price.FindBestResearch(AutoCookie.GrandmapocalypseLevel);
			bestItem = CalcCookie.BestResearchItem;
		}
		if ((buySeasons || maintainSeason != '') && bestItem.Type == 'invalid') {
			CalcCookie.Season.FindBestUpgrade(buySeasons, maintainSeason);
			bestItem = CalcCookie.BestSeasonItem;
		}
		if ((buyBuildings || buyUpgrades) && bestItem.Type == 'invalid') {
			if (buyBuildings && buyUpgrades) {
				CalcCookie.Price.FindBestItem();
				bestItem = CalcCookie.BestOverallItem;
				AutoCookie.GoalItem = CalcCookie.BestOverallGoal;
			}
			else if (buyBuildings) {
				CalcCookie.Price.FindBuildingBCIs();
				bestItem = CalcCookie.BuildingBCIs.bestItem;
				if (CalcCookie.BuildingBCIs.timeItem.Type != 'invalid') {
					bestItem = CalcCookie.BuildingBCIs.timeItem;
					AutoCookie.GoalItem = CalcCookie.BuildingBCIs.bestItem;
				}
			}
			else {
				CalcCookie.Price.FindUpgradeBCIs(true, false);
				bestItem = CalcCookie.UpgradeBCIs.bestItem;
				if (CalcCookie.UpgradeBCIs.timeItem.Type != 'invalid') {
					bestItem = CalcCookie.UpgradeBCIs.timeItem;
					AutoCookie.GoalItem = CalcCookie.UpgradeBCIs.bestItem;
				}
			}
		}
		
		AutoCookie.NextItem = bestItem;

		if (lAuto('nextItem') != null) {
			//lAuto('nextItem').innerHTML = (AutoCookie.NextItem.Type != 'invalid' ? ('Next ' + AutoCookie.NextItem.Type + ': ' + AutoCookie.NextItem.Name) : '');
			lAuto('nextItem').innerHTML = (bestItem.Type != 'invalid' ? bestItem.Name + (bestItem.CanAfford() ? '' : ' <small>(' + Helper.Numbers.GetTime(AutoCookie.NextItem.Time * 1000, 4) + (AutoCookie.GoalItem.Type != 'invalid' ? ' goal: ' + AutoCookie.GoalItem.Name : '') + ')</small>') : 'N/A');
			lAuto('nextType').innerHTML = 'Next ' + (bestItem.Type != 'invalid' ? bestItem.Type : 'item') + ' : ';
		}
		if (bestItem.Type != 'invalid') {
			if (bestItem.CanAfford()) {
				bestItem.Buy();
				//console.log('Bought: ' + bestItem.Name);
			}
		}
	}

	// Since this function always runs, check to see if reincarnation is happening and reset the seasons
	else {
		if (CalcCookie.Season.CycleComplete ||
			CalcCookie.Season.XmasUnlocked ||
			CalcCookie.Season.ValentinesUnlocked ||
			CalcCookie.Season.EasterUnlocked ||
			CalcCookie.Season.HalloweenUnlocked) {

			CalcCookie.Season = new SeasonCalculator();
		}
	}
}
/* Buys the next building. */
AutoCookie.NextBuilding = function () {
	/*var next = AutoCookie.Calc.FindBestBuilding();

	if (next.Type != 'invalid') {
		if (next.Price <= Game.cookies)
			next.Buy();
	}*/
}
/* Buys the next upgrade. */
AutoCookie.NextUpgrade = function () {
	/*var next = AutoCookie.Calc.FindBestUpgrade();

	if (next.Type != 'invalid') {
		if (next.Price <= Game.cookies)
			next.Buy();
	}*/
}
/* Buys the next research. */
AutoCookie.NextResearch = function () {
	/*var next = AutoCookie.Calc.FindBestResearch();

	if (next.Type != 'invalid') {
		if (next.Price <= Game.cookies)
			next.Buy();
	}*/
}
/* Cycles through every season to collect upgrades. */
AutoCookie.SeasonCycle = function () {
	
}
/* Automatically ascends when the heavenly chip threshold is reached. */
AutoCookie.AutoAscend = function () {
	if (!Game.AscendTimer && !Game.OnAscend && !Game.promptOn) {
		//var ascendMultiplier = 2.0;
		var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));

		//if (ascendNowToGet > Game.heavenlyChipsEarned * (ascendMultiplier - 1.0) && ascendNowToGet >= 2000) {
		AutoCookie.UpdateAscendInfo();

		if (ascendNowToGet >= AutoCookie.ChipsForAscend) {
			AutoCookie.ShowAscendPrompt();
		}
	}
	else if (Game.OnAscend && !AutoCookie.ManualAscend) {

		var hchipsCookies = Game.heavenlyChips * (AutoCookie.ChipsForCookies / 100.0);
		var hchipsUpgrades = Game.heavenlyChips * (1.0 - AutoCookie.ChipsForCookies / 100.0);

		//======== Buy Upgrades ========

		// Prices are only there for reference. They're not actually used
		var upgradeOrder = [
			{ name: 'Heavenly luck', price: 7, slot: false },
			{ name: 'Season switcher', price: 50, slot: false },
			{ name: 'Box of british tea biscuits', price: 10, slot: false },
			{ name: 'Box of macarons', price: 10, slot: false },
			{ name: 'Box of brand biscuits', price: 10, slot: false },
			{ name: 'Starter kit', price: 50, slot: false },
			{ name: 'Lasting fortune', price: 77, slot: false },

			{ name: 'Permanent upgrade slot I', price: 100, slot: true },
			{ name: 'Divine discount', price: 100, slot: false },
			{ name: 'Divine sales', price: 100, slot: false },
			{ name: 'Divine bakeries', price: 100, slot: false },

			{ name: 'Permanent upgrade slot II', price: 1000, slot: true },
			{ name: 'Decisive fate', price: 777, slot: false },
			{ name: 'Starter kitchen', price: 5000, slot: false },
			{ name: 'Unholy bait', price: 9000, slot: false },

			{ name: 'Angels', price: 1, slot: false },
			{ name: 'Archangels', price: 10, slot: false },
			{ name: 'Virtues', price: 100, slot: false },
			{ name: 'Dominions', price: 1000, slot: false },
			{ name: 'Kitten angels', price: 50000, slot: false },

			{ name: 'Halo gloves', price: 50000, slot: false },
			
			{ name: 'Starspawn', price: 10000, slot: false },
			{ name: 'Starsnow', price: 10000, slot: false },
			{ name: 'Starterror', price: 10000, slot: false },
			{ name: 'Starlove', price: 10000, slot: false },
			{ name: 'Startrade', price: 10000, slot: false },
			
			{ name: 'Permanent upgrade slot III', price: 100000, slot: true },

			{ name: 'Sacrilegious corruption', price: 900000, slot: false },

			{ name: 'Permanent upgrade slot IV', price: 10000000, slot: true },
			{ name: 'Permanent upgrade slot V', price: 1000000000, slot: true },

			{ name: 'Cherubim', price: 10000, slot: false },
			{ name: 'Seraphim', price: 100000, slot: false },
			{ name: '"god"', price: 1000000, slot: false },
			{ name: '"devil"', price: 10000000, slot: false }
		];

		var numUpgradeSlots = 0;
		for (var i = 0; i < upgradeOrder.length; i++) {
			var info = upgradeOrder[i];
			var name = info.name;
			var upgrade = Game.Upgrades[name];

			if (!upgrade.bought) {

				if (hchipsUpgrades >= upgrade.getPrice()) {
					if (name != '"devil"' || AutoCookie.PurchaseDevil) {
						upgrade.buy(true);
						hchipsUpgrades -= upgrade.getPrice();
						Game.ClosePrompt();
						if (info.slot) {
							numUpgradeSlots++;
						}
					}
				}
				else {
					break;
				}
			}
			else if (info.slot) {
				numUpgradeSlots++;
			}
		}

		//======== Assign Permanent Upgrades ========

		var permanentUpgrades = [
			'Persistent memory',

			'Omelette',
			'Cookie egg',
			'Wrinklerspawn',
			'Golden goose egg',
			'Faberge egg',
			'Century egg',

			'Octillion fingers',
			'Septillion fingers',
			'Sextillion fingers',
			'Quintillion fingers',
			'Quadrillion fingers'
		];

		var upgradeIndex = 0;
		for (var i = 0; i < numUpgradeSlots; i++) {

			for (var j = upgradeIndex; j < permanentUpgrades.length; j++) {
				upgradeIndex++;

				var name = permanentUpgrades[j];
				var upgrade = Game.Upgrades[name];

				//console.log(name);

				if (upgrade.bought) {
					AutoCookie.AssignPermanentSlot(i, name);
					break;
				}
			}
		}

		//======== Bake Heavenly Cookies ========

		// Buy as many heavenly cookies as possible
		var amount = (hchipsCookies - hchipsCookies % 10) / 10;
		Game.heavenlyCookies += amount;
		Game.heavenlyChips -= amount * 10;
		Game.heavenlyChipsSpent += amount * 10;

		Game.Notify('Bake Heavenly Chips', 'Baked ' + Beautify(amount) + ' heavenly cookies.', [20, 7])

		//======== Reincarnate ========

		Game.Reincarnate(true);


		AutoCookie.ManualAscend = true;
		// Reset the season
		//AutoCookie.Season = new Seasons();
	}
}

AutoCookie.AssignPermanentSlot = function (slot, upgrade) {
	Game.permanentUpgrades[slot] = Game.Upgrades[upgrade].id;
}

AutoCookie.SellChocolateEgg = function () {
	if (Game.AscendTimer != 0) {
		if (Game.HasUnlocked('Chocolate egg') && !Game.Has('Chocolate egg')) {
			for (var i in Game.Objects) {
				var building = Game.Objects[i];

				building.sell(-1, true);
			}
			Game.Upgrades['Chocolate egg'].buy(true);
		}
	}
}

AutoCookie.ShowAscendPrompt = function () {
	AutoCookie.AutoAscendStartTime = new Date().getTime();
	AutoCookie.AutoAscendTimer = 60;

	var str = '<h3>Legacy</h3>';
	str += '<div class="block" id="' + iAuto('ascendPromptData') + '" style="overflow:hidden;position:relative;text-align:center;"></div>';
	Game.Prompt(str, [['Auto', 'Game.ClosePrompt(); Game.Ascend(true); AutoCookie.ManualAscend = false;'], ['Manual', 'Game.ClosePrompt(); Game.Ascend(true); AutoCookie.ManualAscend = true;'], ['Disable', 'Game.ClosePrompt(); AutoCookie.Actions["autoascend"].Disable(); AutoCookie.UpdateButtons();']], AutoCookie.UpdateAscendPrompt, 'legacyPrompt');

	//l('promptOption2').style.display = 'none';
	Game.UpdatePrompt();

	l('promptOption0').className = 'option framed large title';
	l('promptOption0').style.marginRight = '4px';

	l('promptOption1').className = 'option framed large title';
	l('promptOption1').style.marginLeft = '4px';
	l('promptOption1').style.marginRight = '4px';

	l('promptOption2').className = 'option framed large title';
	l('promptOption2').style.marginLeft = '4px';

}

AutoCookie.UpdateAscendPrompt = function () {
	if (!lAuto('ascendPromptData')) return 0;
	var date = new Date();
	date.setTime(new Date().getTime() - Game.startDate);
	var timeInSeconds = date.getTime() / 1000;
	var startDate = Game.sayTime(timeInSeconds * Game.fps, 2);

	var ascendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));
	var cookiesToNext = Math.floor(Game.HowManyCookiesReset(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) + 1) - Game.cookiesReset - Game.cookiesEarned);


	var timer = 60 - ((new Date().getTime() - AutoCookie.AutoAscendStartTime) / 1000);
	AutoCookie.AutoAscendTimer = Math.floor(Math.max(0, timer));

	lAuto('ascendPromptData').innerHTML = '' +
		'<div class="icon" style="pointer-event:none;transform:scale(2);opacity:0.25;position:absolute;right:-8px;bottom:-8px;background-position:' + (-19 * 48) + 'px ' + (-7 * 48) + 'px;"></div>' +
		'<div class="listing"><b>Run duration :</b> ' + (startDate == '' ? 'tiny' : (startDate)) + '</div>' +
		//'<div class="listing">Earned : '+Beautify(Game.cookiesEarned)+', Reset : '+Beautify(Game.cookiesReset)+'</div>'+
		'<div class="listing"><b>Heavenly chips :</b> ' + Beautify(Game.heavenlyChips) + '</div>' +
		'<div class="listing"><b>Ascending now will produce :</b> ' + Beautify(ascendNowToGet) + ' heavenly chip' + ((ascendNowToGet) == 1 ? '' : 's') + '</div>' +
		'<div class="listing"><b>Auto ascend in :</b> ' + Beautify(AutoCookie.AutoAscendTimer) + ' second' + ((AutoCookie.AutoAscendTimer) == 1 ? '' : 's') + '</div>' +
		'';
	/*l('promptOption0').className = 'option framed large title';
	l('promptOption0').style.marginRight = '4px';
	//l('promptOption0').style.display = 'none';
	l('promptOption1').className = 'option framed large title';
	l('promptOption1').style.marginLeft = '4px';
	l('promptOption1').style.marginRight = '4px';
	//l('promptOption1').style.display = 'none';
	l('promptOption2').className = 'option framed large title';
	l('promptOption2').style.marginLeft = '4px';*/

	if (timer < 0) {
		//console.log(timer);
		Game.ClosePrompt();
		Game.Ascend(true);
		AutoCookie.ManualAscend = false;
	}
	//if (ascendNowToGet >= 1) l('promptOption0').style.display = 'inline-block'; else l('promptOption0').style.display = 'none';
}

AutoCookie.ToggleAllowDevil = function () {
	AutoCookie.PurchaseDevil = AutoCookie.Actions['allowdevil'].Enabled;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE BUYOUT ITEM
=======================================================================================*/

/*=====================================================================================
AUTO-COOKIE ACTION
=======================================================================================*/
//#region Actions

/* Writes the action button. */
AutoCookie.WriteButton = function (name) {
	var action = AutoCookie.Actions[name];
	var button = iAuto(name + 'Button');

	if (action.Type == 'toggle') {
		var on = action.ButtonName + ' ON'.fontcolor('green');
		var off = action.ButtonName + ' OFF'.fontcolor('red');
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="AutoCookie.Toggle(\'' + name + '\',\'' + button + '\');">' + (action.Enabled ? on : off) + '</a>';
	}
	else if (action.Type == 'basic') {
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="AutoCookie.Actions[\'' + name + '\'].Action();">' + action.ButtonName + '</a>';
	}
}
/* Toggles the action button function. */
AutoCookie.Toggle = function (name, button) {
	AutoCookie.Actions[name].Action();
	var action = AutoCookie.Actions[name];
	if (action.Enabled) {
		lAuto(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
		lAuto(button).className = 'option enabled';
	}
	else {
		lAuto(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
		lAuto(button).className = 'option';
	}
}
/* Toggles the action button function. */
AutoCookie.SetButtonVisual = function (name) {
	var action = AutoCookie.Actions[name];
	var button = iAuto(name + 'Button');
	if (lAuto(button) != null) {
		if (action.Type == 'toggle') {
			if (action.Enabled) {
				lAuto(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
				lAuto(button).className = 'option enabled';
			}
			else {
				lAuto(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
				lAuto(button).className = 'option';
			}
		}
	}
}

/* The Auto-Cookie Action object. */
function AutoCookieAction(name, buttonName, icon, type, enabled, delay, func, showNotify, notifyTitle, notifyDescOn, notifyDescOff, on, off) {
	this.Name		= name;
	this.ButtonName = (buttonName == null ? name : buttonName);
	this.Icon		= icon;
	this.Type		= type;
	this.Enabled	= enabled;
	this.Delay		= delay;
	this.Func		= func;
	this.ShowNotify = showNotify;
	this.OnFunc		= on;
	this.OffFunc	= off;
	this.ID			= 0;

	this.NotifyTitle	= notifyTitle || name;
	this.NotifyDescOn	= notifyDescOn || ('Mode ' + 'Activated'.fontcolor('green'));
	this.NotifyDescOff	= notifyDescOff || ('Mode ' + 'Deactivated'.fontcolor('red'));

	if (enabled) {
		this.Enable(false);
	}
}
/* Calls the action. */
AutoCookieAction.prototype.Action = function (notify) {
	if (this.Type == 'toggle') {
		this.Enabled = !this.Enabled;
		if (this.Enabled && this.OnFunc)
			this.OnFunc();
		if (this.Delay)
			this.ID = this.ID ? clearInterval(this.ID) : setInterval(this.Func, this.Delay);
		else
			this.Func();
		if (!this.Enabled && this.OffFunc)
			this.OffFunc();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, (this.Enabled ? this.NotifyDescOn : this.NotifyDescOff), this.Icon);
	}
	else if (this.Type == 'basic') {
		this.Func();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, this.NotifyDescOn, this.Icon);
	}
}
/* Enables the action. */
AutoCookieAction.prototype.Enable = function (notify) {
	if (this.Type == 'toggle' && !this.Enabled) {
		this.Enabled = true;
		if (this.Delay && !this.ID)
			this.ID = setInterval(this.Func, this.Delay);
		else
			this.Func();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, this.NotifyDescOn, this.Icon);
	}
}
/* Disables the action. */
AutoCookieAction.prototype.Disable = function (notify) {
	if (this.Type == 'toggle' && this.Enabled) {
		this.Enabled = false;
		if (this.Delay && this.ID)
			this.ID = clearInterval(this.ID);
		else
			this.Func();
		if ((typeof notify !== 'undefined' ? notify : true) && this.ShowNotify)
			Game.Notify(this.NotifyTitle, this.NotifyDescOff, this.Icon);
	}
}

//#endregion
/*=====================================================================================
AUTO-COOKIE ACTIONS
=======================================================================================*/

/* The list of actions. */
AutoCookie.Actions = {
	all: new AutoCookieAction('Enable All', null, [22, 7], 'basic', false, 0, AutoCookie.EnabledAll, true,
									'Enabled All', 'All Modes ' + 'Activated'.fontcolor('green')),
	none: new AutoCookieAction('Disable All', null, [22, 7], 'basic', false, 0, AutoCookie.DisableAll, true,
									'Disable All', 'All Modes ' + 'Deactivated'.fontcolor('red')),

	allclick: new AutoCookieAction('Enable All', null, [12, 0], 'basic', false, 0, AutoCookie.EnabledAllClick, true,
									'Enabled All', 'All Click Modes ' + 'Activated'.fontcolor('green')),
	noneclick: new AutoCookieAction('Disable All', null, [12, 0], 'basic', false, 0, AutoCookie.DisableAllClick, true,
									'Disable All', 'All Click Modes ' + 'Deactivated'.fontcolor('red')),

	allbuy: new AutoCookieAction('Enable All', null, [15, 0], 'basic', false, 0, AutoCookie.EnabledAllBuy, true,
									'Enabled All', 'All Buy Modes ' + 'Activated'.fontcolor('green')),
	nonebuy: new AutoCookieAction('Disable All', null, [15, 0], 'basic', false, 0, AutoCookie.DisableAllBuy, true,
									'Disable All', 'All Buy Modes ' + 'Deactivated'.fontcolor('red')),

	checkascendinputs: new AutoCookieAction('Check Ascend Inputs', null, [12, 0], 'toggle', false, 400, AutoCookie.CheckAscendInputs, false),
	checkautoclick: new AutoCookieAction('Check Auto Click', null, [12, 0], 'toggle', false, 400, AutoCookie.CheckAutoClick, false),
	updateclickrate: new AutoCookieAction('Update Click Rate', null, [12, 0], 'toggle', false, 500, AutoCookie.UpdateClickRate, false),

	autoclick: new AutoCookieAction('Auto Click', null, [12, 0], 'toggle', false, 4, AutoCookie.AutoClick, true, null, null, null,
		function () { AutoCookie.Actions['instantclick'].Disable(false); AutoCookie.SetButtonVisual('instantclick'); }),
	instantclick: new AutoCookieAction('Instant Click', null, [12, 0], 'toggle', false, 500, AutoCookie.InstantClick, true, null, null, null,
		function () { AutoCookie.Actions['autoclick'].Disable(false); AutoCookie.SetButtonVisual('autoclick'); }),

	slow: new AutoCookieAction('Slow Click', null, [11, 0], 'toggle', false, 300, AutoCookie.AutoClick, true),
	rapid: new AutoCookieAction('Rapid Click', null, [12, 0], 'toggle', false, 5, AutoCookie.AutoClick, true),

	gold: new AutoCookieAction('Click Golden Cookies', 'Golden Click', [11, 14], 'toggle', false, 1000, AutoCookie.ClickGoldenCookies, true),
	wrath: new AutoCookieAction('Allow Wrath Cookies', 'Allow Wrath', [15, 5], 'toggle', false, 0, function () {}, true),
	gnotify: new AutoCookieAction('Golden Cookie Alert', 'Golden Alert', [8, 0], 'toggle', false, 1000, AutoCookie.GoldenCookieAlert, true),

	wrinkler: new AutoCookieAction('Pop Wrinklers', null, [19, 8], 'toggle', false, 2000, AutoCookie.PopWrinklers, true),
	reindeer: new AutoCookieAction('Click Reindeer', null, [12, 9], 'toggle', false, 2000, AutoCookie.ClickReindeer, true),

	autobuy: new AutoCookieAction('Autobuy', null, [15, 0], 'toggle', false, 50, AutoCookie.Autobuy, false),
	autobuildings: new AutoCookieAction('Autobuy Buildings', null, [15, 0], 'toggle', false, 0, function () {}, true),
	autoupgrades: new AutoCookieAction('Autobuy Upgrades', null, [9, 0], 'toggle', false, 0, function () {}, true),
	autoresearch: new AutoCookieAction('Autobuy Reasearch', null, [11, 9], 'toggle', false, 0, function () {}, true),
	autoseason: new AutoCookieAction('Season Cycle', null, [16, 6], 'toggle', false, 0, function () { }, true),

	maintainseason: new AutoCookieAction('Maintain Season', null, [16, 6], 'toggle', false, 0, function () { }, true),
	maintainpledge: new AutoCookieAction('Maintain Pledge', null, [9, 9], 'toggle', false, 0, function () { }, true),
	maintainelder: new AutoCookieAction('Apply Elder Covenant', null, [8, 9], 'toggle', false, 0, function () { }, true),

	autoascend: new AutoCookieAction('Auto Ascend', null, [19, 7], 'toggle', false, 5000, AutoCookie.AutoAscend, true),
	allowdevil: new AutoCookieAction('Allow "devil" Upgrade', null, [7, 11], 'toggle', false, 0, AutoCookie.ToggleAllowDevil, true),


	chocegg: new AutoCookieAction('Sell Chocolate Egg on Ascend', null, [18, 12], 'toggle', false, 200, AutoCookie.SellChocolateEgg, true)
};

/*=====================================================================================
AUTO-COOKIE VARIABLES
=======================================================================================*/

/* The next item to buy with autobuy. */
AutoCookie.NextItem = null;
AutoCookie.GoalItem = null;

AutoCookie.AutoClickRate = 250;


AutoCookie.AscendMinChips = 20000; // 20,000
AutoCookie.AscendMinMultiplier = 1000;

AutoCookie.AscendMaxChips = 1000000000000; // 1 trillion
AutoCookie.AscendMaxMultiplier = 2;

AutoCookie.ChipsForCookies = 80;

AutoCookie.ManualAscend = true;

AutoCookie.AutoAscendTimer = 0;
AutoCookie.AutoAscendStartTime = 0;

AutoCookie.ChipsForAscend = 0;

AutoCookie.PurchaseDevil = false;

AutoCookie.MaintainSeason = 'christmas';
AutoCookie.GrandmapocalypseLevel = 3;

/* The notify sound for golden cookies. Source: http://www.soundjay.com/button/beep-30b.mp3 */
AutoCookie.NotifySound = new Audio("https://gist.github.com/pernatiy/38bc231506b06fd85473/raw/beep-30.mp3");

/*=====================================================================================
LAUNCH AUTO-COOKIE
=======================================================================================*/

// Launch Auto-Cookie
AutoCookie.Init();

