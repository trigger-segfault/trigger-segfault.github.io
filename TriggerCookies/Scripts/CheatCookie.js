/*=====================================================================================
CHEAT COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/CheatCookie.js

// Based off "Cookieclicker Bots".
// Link: https://gist.githubusercontent.com/pernatiy/38bc231506b06fd85473/raw/cc.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'CheatCookie';
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

/* Returns the element used in Cheat Cookie. */
function lCheat(name) {
	if (name.indexOf('CheatCookie') != 0)
		return l('CheatCookie' + name);
	return l(name);
}
/* Returns the element with the name used in Cheat Cookie. */
function iCheat(name) {
	if (name.indexOf('CheatCookie') != 0)
		return 'CheatCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
CHEAT COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the Cheat Cookie mod. */
CheatCookie = {};
/* True if the mod is loaded. */
CheatCookie.Loaded = false;
/* True if the mod is enabled. */
CheatCookie.Enabled = true;

//#endregion
/*=====================================================================================
CHEAT COOKIE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes the mod. */
CheatCookie.Init = function () {
	LoadTriggerCookies();

	// Add the mod to the manager if it exists.
	IntervalUntilLoaded(function () {
		TriggerCookies.AddMod('Cheat Cookie', 'CheatCookie', [10, 6], CheatCookie.Enable, CheatCookie.Disable, null, null, CheatCookie.WriteMenu, CheatCookie.UpdateMenu, true);
		TriggerCookies.AddTab('Cheating', 400);

		CheatCookie.Loaded = true;
	});
}
/* Enables the mod */
CheatCookie.Enable = function (firstTime) {

	CheatCookie.Enabled = true;
}
/* Disables the mod. */
CheatCookie.Disable = function () {

	CheatCookie.DisableAll();

	CheatCookie.Enabled = false;
}

CheatCookie.WrinklersExist = function () {
	for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];
		if (me.phase != 0)
			return true;
	}
	return false;
}
CheatCookie.PopAllWrinklers = function () {
	Game.CollectWrinklers();
	lCheat('popAllWrinklers').style.display = 'none';
	/*for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];
		if (me.phase == 0 && Game.elderWrath > 0) {
			me.phase = 1;
			me.hp = Game.wrinklerHP;
			spawned = true;
			break;
		}
	}*/
}

//#endregion
/*=====================================================================================
CHEAT COOKIE MENU
=======================================================================================*/
//#region Menu

/*CheatCookie.WriteSectionHead = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';

	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';

	return str;
}

CheatCookie.WriteSectionMiddle = function () {

	//var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 6px 0px 6px 14px;"></div>';
	var str = '<div style="width: 100%; margin: 12px 0px;"></div>';
	return str;
}
CheatCookie.WriteSectionEnd = function () {

	var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
	return str;
}

CheatCookie.WriteSpacing = function (pixels) {
	if (!pixels)
		pixels = 8;
	var str = '<div style="margin-left: ' + pixels.toString() + 'px; display: inline;"></div>';
	return str;
}*/

/* Writes the Cheat Cookie buttons. */
CheatCookie.WriteMenu = function (tab) {

	var str = '';
	if (tab == 'Cheating') {

		str += Helper.Menu.WriteSectionHeader('Cookies', [3, 5]);

		str += '<div class="listing"><b>Cookies in bank : </b> <div id="' + iCheat('cookies') + '" class="price plain">' + Beautify(Game.cookies) + '</div></div>';

		str += '<div class="listing">' +
				CheatCookie.WriteButton('addcookies') +
				CheatCookie.WriteButton('x2cookies') +
				CheatCookie.WriteButton('x10cookies') +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('losecookies') +
				CheatCookie.WriteButton('d2cookies') +
				CheatCookie.WriteButton('d10cookies') +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('frenzy') +
				CheatCookie.WriteButton('elder') +
				CheatCookie.WriteButton('click') +
				'</div>';

		str += '<div class="listing">' +
				'Custom Amount: ' +
				'<input id="' + iCheat('cookiesInput') + '" type="text" value="1000" style="width: 200px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('addcustomcookies') +
				CheatCookie.WriteButton('setcustomcookies') +
				'</div>';

		str += Helper.Menu.WriteSectionEnd();



		str += Helper.Menu.WriteSectionHeader('Heavenly Chips', [19, 7]);
		
		str += '<div class="listing"><b>Heavenly Chips in bank : </b> <div id="' + iCheat('hchips') + '" class="price plain heavenly">' + Beautify(Game.heavenlyChips) + '</div></div>';

		str += '<div class="listing">' +
				CheatCookie.WriteButton('addhchips') +
				CheatCookie.WriteButton('x2hchips') +
				CheatCookie.WriteButton('x10hchips') +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('losehchips') +
				CheatCookie.WriteButton('d2hchips') +
				CheatCookie.WriteButton('d10hchips') +
				'</div>';

		str += '<div class="listing">' +
				'Custom Amount: ' +
				'<input id="' + iCheat('hchipsInput') + '" type="text" value="1000" style="width: 200px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('addcustomhchips') +
				CheatCookie.WriteButton('setcustomhchips') +
				'</div>';

		str += Helper.Menu.WriteSectionEnd();



		str += Helper.Menu.WriteSectionHeader('Heavenly Cookies', [20, 7]);

		str += '<div class="listing"><b>Heavenly Cookies in bank : </b> <div id="' + iCheat('hcookies') + '" class="priceoff">' + Beautify(Game.heavenlyCookies) + '</div></div>';

		str += '<div class="listing">' +
				CheatCookie.WriteButton('addhcookies') +
				CheatCookie.WriteButton('x2hcookies') +
				CheatCookie.WriteButton('x10hcookies') +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('losehcookies') +
				CheatCookie.WriteButton('d2hcookies') +
				CheatCookie.WriteButton('d10hcookies') +
				'</div>';

		str += '<div class="listing">' +
				'Custom Amount: ' +
				'<input id="' + iCheat('hcookiesInput') + '" type="text" value="1000" style="width: 200px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('addcustomhcookies') +
				CheatCookie.WriteButton('setcustomhcookies') +
				'</div>';

		str += Helper.Menu.WriteSectionEnd();

		str += Helper.Menu.WriteSectionHeader('Upgrades', [11, 9]);

		var basicUpgrades = 0, basicUpgradesTotal = 0;
		var cookieUpgrades = 0, cookieUpgradesTotal = 0;
		var prestigeUpgrades = 0, prestigeUpgradesTotal = 0;
		var debugUpgrades = 0, debugUpgradesTotal = 0;
		for (var i in Game.Upgrades) {
			var upgrade = Game.Upgrades[i];
			if (upgrade.pool == 'cookie') { cookieUpgradesTotal++; if (upgrade.bought) cookieUpgrades++; }
			else if (upgrade.pool == 'prestige') { prestigeUpgradesTotal++; if (upgrade.bought) prestigeUpgrades++; }
			else if (upgrade.pool == 'debug') { debugUpgradesTotal++; if (upgrade.bought) debugUpgrades++; }
			else if (upgrade.pool != 'toggle') { basicUpgradesTotal++; if (upgrade.bought) basicUpgrades++; }
		}

		var spacing = 14;

		str += '<div class="listing"><b>Upgrades owned : </b> ' +
			Helper.Menu.WriteSpacing(8) +
			'basic: <div id="' + iCheat('basicupgradesowned') + '" class="priceoff">' + basicUpgrades + '/' + basicUpgradesTotal + '</div>' +
			Helper.Menu.WriteSpacing(spacing) +
			'cookies: <div id="' + iCheat('cookieupgradesowned') + '" class="priceoff">' + cookieUpgrades + '/' + cookieUpgradesTotal + '</div>' +
			Helper.Menu.WriteSpacing(spacing) +
			'prestige: <div id="' + iCheat('prestigeupgradesowned') + '" class="priceoff">' + prestigeUpgrades + '/' + prestigeUpgradesTotal + '</div>' +
			Helper.Menu.WriteSpacing(spacing) +
			'debug: <div id="' + iCheat('debugupgradesowned') + '" class="priceoff">' + debugUpgrades + '/' + debugUpgradesTotal + '</div>' +
			'</div></div>';

		str += '<div class="listing">' +
				CheatCookie.WriteButton('buyallupgrades') +
				CheatCookie.WriteButton('sellallupgrades') +
				CheatCookie.WriteButton('buydebugupgrades') +
				'</div>';

		str += '<div class="listing">' +
				'Upgrade Name: ' +
				'<input id="' + iCheat('upgradeInput') + '" type="text" value="" style="width: 240px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('buyupgrade') +
				CheatCookie.WriteButton('sellupgrade') +
				CheatCookie.WriteButton('unlockupgrade') +
				CheatCookie.WriteButton('lockupgrade') +
				CheatCookie.WriteButton('getupgradeid') +
				'</div>';

		str += '<div class="listing"><b>Upgrade ID : </b> <div id="' + iCheat('upgradeID') + '" class="priceoff">' + '' + '</div></div>';

		str += Helper.Menu.WriteSectionEnd();

		str += Helper.Menu.WriteSectionHeader('Achievements', [12, 5]);

		var achievements = 0, achievementsTotal = 0;
		var shadow = 0, shadowTotal = 0;
		for (var i in Game.Achievements) {
			var achiev = Game.Achievements[i];
			if (achiev.hide == 3) { shadowTotal++; if (achiev.won) shadow++; }
			else { achievementsTotal++; if (achiev.won) achievements++; }
		}

		var spacing = 14;

		str += '<div class="listing"><b>Achievements won : </b> ' +
			Helper.Menu.WriteSpacing(8) +
			'basic: <div id="' + iCheat('achievwon') + '" class="priceoff">' + achievements + '/' + achievementsTotal + '</div>' +
			Helper.Menu.WriteSpacing(spacing) +
			'shadow: <div id="' + iCheat('shadowwon') + '" class="priceoff">' + shadow + '/' + shadowTotal + '</div>' +
			'</div></div>';


		str += '<div class="listing">' +
				CheatCookie.WriteButton('winallachiev') +
				CheatCookie.WriteButton('loseallachiev') +
				CheatCookie.WriteButton('removehack') +
				'</div>';

		str += '<div class="listing">' +
				'Achievement Name: ' +
				'<input id="' + iCheat('achievInput') + '" type="text" value="" style="width: 240px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
				Helper.Menu.WriteSpacing() +
				CheatCookie.WriteButton('winachiev') +
				CheatCookie.WriteButton('loseachiev') +
				CheatCookie.WriteButton('getachievid') +
				'</div>';

		str += '<div class="listing"><b>Achievement ID : </b> <div id="' + iCheat('achievID') + '" class="priceoff">' + '' + '</div></div>';

		str += Helper.Menu.WriteSectionEnd();



		str += Helper.Menu.WriteSectionHeader('Spawning', [19, 8]);

		str += '<div class="listing">' +
				CheatCookie.WriteButton('spawnwrinkler') +
				CheatCookie.WriteButton('spawnseason') +
				CheatCookie.WriteButton('spawngolden') +
				CheatCookie.WriteButton('spawnwrath') +
				'</div>';

		str += Helper.Menu.WriteSectionEnd();
	}

	return str;
}
/* Writes the Cheat Cookie buttons. */
CheatCookie.UpdateMenu = function () {

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);

	var basicUpgrades = 0, basicUpgradesTotal = 0;
	var cookieUpgrades = 0, cookieUpgradesTotal = 0;
	var prestigeUpgrades = 0, prestigeUpgradesTotal = 0;
	var debugUpgrades = 0, debugUpgradesTotal = 0;

	for (var i in Game.Upgrades) {
		var upgrade = Game.Upgrades[i];
		if (upgrade.pool == 'cookie') { cookieUpgradesTotal++; if (upgrade.bought) cookieUpgrades++; }
		else if (upgrade.pool == 'prestige') { prestigeUpgradesTotal++; if (upgrade.bought) prestigeUpgrades++; }
		else if (upgrade.pool == 'debug') { debugUpgradesTotal++; if (upgrade.bought) debugUpgrades++; }
		else if (upgrade.pool != 'toggle') { basicUpgradesTotal++; if (upgrade.bought) basicUpgrades++; }
	}
	
	lCheat('basicupgradesowned').innerHTML = basicUpgrades + '/' + basicUpgradesTotal;
	lCheat('cookieupgradesowned').innerHTML = cookieUpgrades + '/' + cookieUpgradesTotal;
	lCheat('prestigeupgradesowned').innerHTML = prestigeUpgrades + '/' + prestigeUpgradesTotal;
	lCheat('debugupgradesowned').innerHTML = debugUpgrades + '/' + debugUpgradesTotal;

	var achievements = 0, achievementsTotal = 0;
	var shadow = 0, shadowTotal = 0;
	for (var i in Game.Achievements) {
		var achiev = Game.Achievements[i];
		if (achiev.hide == 3) { shadowTotal++; if (achiev.won) shadow++; }
		else { achievementsTotal++; if (achiev.won) achievements++; }
	}

	lCheat('achievwon').innerHTML = achievements + '/' + achievementsTotal;
	lCheat('shadowwon').innerHTML = shadow + '/' + shadowTotal;
}

//#endregion
//============ MODES ============

/* Enables all important modes. */
CheatCookie.EnabledAll = function () {

	Game.UpdateMenu();
}
/* Disables all modes. */
CheatCookie.DisableAll = function () {

	Game.UpdateMenu();
}
CheatCookie.GetNumber = function (inputID) {
	var numNames = [
		' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion',
		' nonillion', ' decillion', ' undecillion', ' duodecillion', ' tredecillion', ' quattuordecillion', ' quindecillion'
	];
	var numNames2 = [' M', ' B', ' T', ' Qa', ' Qi', ' Sx', ' Sp', ' Oc', ' No', ' Dc', ' UnD', ' DoD', ' TrD', ' QaD', ' QiD'];

	var text = lCheat(inputID).value;
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
		Math.floor(value);
	}

	return value;
}

//#region Cookies

/* Adds a custom amount of cookies. */
CheatCookie.AddCustomCookies = function () {
	var moni = CheatCookie.GetNumber('cookiesInput');
	if (isNaN(moni)) {
		lCheat('cookiesInput').style.color = '#F00';
		CheatCookie.Actions['addcustomcookies'].ShowNotify = false;
	}
	else {
		CheatCookie.Actions['addcustomcookies'].ShowNotify = true;
		if (moni < 0) {
			moni *= -1;
			moni = Math.min(Game.cookies, moni);
			Game.Spend(moni);
			CheatCookie.Actions['addcustomcookies'].NotifyTitle = 'Lost Cookies!';
			CheatCookie.Actions['addcustomcookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> cookies!';
		}
		else {
			Game.Earn(moni);
			CheatCookie.Actions['addcustomcookies'].NotifyTitle = 'Added Cookies!';
			CheatCookie.Actions['addcustomcookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> cookies!';
		}
		lCheat('cookiesInput').style.color = '#FFF';
		Game.Win('Cheated cookies taste awful');
	}

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}
/* Sets a custom amount of cookies. */
CheatCookie.SetCustomCookies = function () {
	var moni = CheatCookie.GetNumber('cookiesInput');
	if (isNaN(moni)) {
		CheatCookie.Actions['setcustomcookies'].ShowNotify = false;
		lCheat('cookiesInput').style.color = '#F00';
	}
	else {
		if (moni < 0) {
			moni = 0;
			lCheat('cookiesInput').value = '0';
		}
		CheatCookie.Actions['setcustomcookies'].ShowNotify = true;
		if (moni > Game.cookies) {
			Game.Earn(moni - Game.cookies);
		}
		else if (moni < Game.cookies) {
			Game.Spend(Game.cookies - moni);
		}
		CheatCookie.Actions['setcustomcookies'].NotifyDescOn = 'Set bank to <b>' + Beautify(moni) + '</b> cookies!';
		lCheat('cookiesInput').style.color = '#FFF';
		Game.Win('Cheated cookies taste awful');
	}

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}

/* Adds 1/10 cookies. */
CheatCookie.AddCookies = function () {
	var moni = Game.cookies * 0.1;//add 10% to cookies owned (+13)
	moni = Math.max(10, moni);
	Game.Earn(moni);
	CheatCookie.Actions['addcookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}
/* Doubles your cookies. */
CheatCookie.CookiesX2 = function () {
	var moni = Game.cookies * 1.0;
	moni = Math.max(20, moni);
	Game.Earn(moni);
	CheatCookie.Actions['x2cookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}
/* x10 your cookies. */
CheatCookie.CookiesX10 = function () {
	var moni = Game.cookies * 9.0;
	moni = Math.max(100, moni);
	Game.Earn(moni);
	CheatCookie.Actions['x10cookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}
/* Loses 1/10 cookies. */
CheatCookie.LoseCookies = function () {
	var moni = Game.cookies * (1.0 / 10.0);
	Game.Spend(moni);
	CheatCookie.Actions['losecookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}
/* Halves your cookies. */
CheatCookie.CookiesD2 = function () {
	var moni = Game.cookies * (1.0 / 2.0);
	Game.Spend(moni);
	CheatCookie.Actions['d2cookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}
/* 1/10 your cookies. */
CheatCookie.CookiesD10 = function () {
	var moni = Game.cookies * (9.0 / 10.0);
	Game.Spend(moni);
	CheatCookie.Actions['d10cookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('cookies').innerHTML = Beautify(Game.cookies);
}

/* Induces Frenzy. */
CheatCookie.Frenzy = function () {
	var time = Math.ceil(77 * Game.goldenCookie.getEffectDurMod());
	Game.frenzy = Game.fps * time;
	Game.frenzyPower = 7;
	Game.frenzyMax = Game.frenzy;
	Game.recalculateGains = 1;
	CheatCookie.Actions['frenzy'].NotifyDescOn = 'Cookie production <b>x7</b> for <b>' + time + '</b> seconds!';
	Game.Win('Cheated cookies taste awful');
}
/* Induces Elder Frenzy. */
CheatCookie.ElderFrenzy = function () {
	var time = Math.ceil(6 * Game.goldenCookie.getEffectDurMod());
	Game.frenzy = Game.fps * time;//*2;//we shouldn't need *2 but I keep getting reports of it lasting only 3 seconds
	Game.frenzyPower = 666;
	Game.frenzyMax = Game.frenzy;
	Game.recalculateGains = 1;
	CheatCookie.Actions['elder'].NotifyDescOn = 'Cookie production <b>x666</b> for <b>' + time + '</b> seconds!';
	Game.Win('Cheated cookies taste awful');
}
/* Induces Click Frenzy. */
CheatCookie.ClickFrenzy = function () {
	var time = Math.ceil(13 * Game.goldenCookie.getEffectDurMod());
	Game.clickFrenzy = Game.fps * time;
	Game.clickFrenzyMax = Game.clickFrenzy;
	Game.recalculateGains = 1;
	CheatCookie.Actions['click'].NotifyDescOn = 'Clicking power <b>x777</b> for <b>' + time + '</b> seconds!';
	Game.Win('Cheated cookies taste awful');
}

//#endregion
//#region Heavenly Chips

/* Adds a custom amount of heavenly chips. */
CheatCookie.AddCustomHChips = function () {
	var moni = CheatCookie.GetNumber('hchipsInput');
	if (isNaN(moni)) {
		lCheat('hchipsInput').style.color = '#F00';
		CheatCookie.Actions['addcustomhchips'].ShowNotify = false;
	}
	else {
		CheatCookie.Actions['addcustomhchips'].ShowNotify = true;
		if (moni < 0) {
			moni *= -1;
			moni = Math.min(Game.heavenlyChips, moni);
			Game.heavenlyChips -= moni;
			Game.heavenlyChipsSpent += moni;
			CheatCookie.Actions['addcustomhchips'].NotifyTitle = 'Lost Heavenly Chips!';
			CheatCookie.Actions['addcustomhchips'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly chips!';
		}
		else {
			Game.heavenlyChips += moni;
			Game.heavenlyChipsEarned += moni;
			CheatCookie.Actions['addcustomhchips'].NotifyTitle = 'Added Heavenly Chips!';
			CheatCookie.Actions['addcustomhchips'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly chips!';
		}
		lCheat('hchipsInput').style.color = '#FFF';
		Game.Win('Cheated cookies taste awful');
	}

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}
/* Sets a custom amount of heavenly chips. */
CheatCookie.SetCustomHChips = function () {
	var moni = CheatCookie.GetNumber('hchipsInput');
	if (isNaN(moni)) {
		CheatCookie.Actions['setcustomhchips'].ShowNotify = false;
		lCheat('hchipsInput').style.color = '#F00';
	}
	else {
		if (moni < 0) {
			moni = 0;
			lCheat('hchipsInput').value = '0';
		}
		CheatCookie.Actions['setcustomhchips'].ShowNotify = true;
		if (moni > Game.heavenlyChips) {
			Game.heavenlyChips += moni - Game.heavenlyChips;
			Game.heavenlyChipsEarned += moni - Game.heavenlyChips;
		}
		else if (moni < Game.heavenlyChips) {
			Game.heavenlyChips -= Game.heavenlyChips - moni;
			Game.heavenlyChipsSpent += Game.heavenlyChips - moni;
		}
		CheatCookie.Actions['setcustomhchips'].NotifyDescOn = 'Set bank to <b>' + Beautify(moni) + '</b> heavenly chips!';
		lCheat('hchipsInput').style.color = '#FFF';
		Game.Win('Cheated cookies taste awful');
	}

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}
/* Adds 1/10 heavenly chips. */
CheatCookie.AddHChips = function () {
	var moni = Game.heavenlyChips * 0.1;
	moni = Math.max(1, moni);
	Game.heavenlyChips += moni;
	Game.heavenlyChipsEarned += moni;
	CheatCookie.Actions['addhchips'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly chips!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}
/* Doubles your heavenly chips. */
CheatCookie.HChipsX2 = function () {
	var moni = Game.heavenlyChips * 1.0;
	moni = Math.max(2, moni);
	Game.heavenlyChips += moni;
	Game.heavenlyChipsEarned += moni;
	CheatCookie.Actions['x2hchips'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly chips!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}
/* x10 your heavenly chips. */
CheatCookie.HChipsX10 = function () {
	var moni = Game.heavenlyChips * 9.0;
	moni = Math.max(10, moni);
	Game.heavenlyChips += moni;
	Game.heavenlyChipsEarned += moni;
	CheatCookie.Actions['x10hchips'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly chips!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}
/* Loses 1/10 heavenly chips. */
CheatCookie.LoseHChips = function () {
	var moni = Game.heavenlyChips * (1.0 / 10.0);
	Game.heavenlyChips -= moni;
	Game.heavenlyChipsSpent += moni;
	CheatCookie.Actions['losehchips'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly chips!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}
/* Halves heavenly chips. */
CheatCookie.HChipsD2 = function () {
	var moni = Game.heavenlyChips * (1.0 / 2.0);
	Game.heavenlyChips -= moni;
	Game.heavenlyChipsSpent += moni;
	CheatCookie.Actions['d2hchips'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly chips!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}
/* 1/10 heavenly chips. */
CheatCookie.HChipsD10 = function () {
	var moni = Game.heavenlyChips * (9.0 / 10.0);
	Game.heavenlyChips -= moni;
	Game.heavenlyChipsSpent += moni;
	CheatCookie.Actions['d10hchips'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly chips!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hchips').innerHTML = Beautify(Game.heavenlyChips);
}

//#endregion
//#region Heavenly Cookies

/* Adds a custom amount of heavenly cookies. */
CheatCookie.AddCustomHCookies = function () {
	var moni = CheatCookie.GetNumber('hcookiesInput');
	if (isNaN(moni)) {
		lCheat('hcookiesInput').style.color = '#F00';
		CheatCookie.Actions['addcustomhcookies'].ShowNotify = false;
	}
	else {
		CheatCookie.Actions['addcustomhcookies'].ShowNotify = true;
		if (moni < 0) {
			moni *= -1;
			moni = Math.min(Game.heavenlyCookies, moni);
			Game.heavenlyCookies -= moni;
			CheatCookie.Actions['addcustomhcookies'].NotifyTitle = 'Lost Heavenly Cookies!';
			CheatCookie.Actions['addcustomhcookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly chips!';
		}
		else {
			Game.heavenlyCookies += moni;
			CheatCookie.Actions['addcustomhcookies'].NotifyTitle = 'Added Heavenly Cookies!';
			CheatCookie.Actions['addcustomhcookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly chips!';
		}
		lCheat('hcookiesInput').style.color = '#FFF';
		Game.Win('Cheated cookies taste awful');
	}

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}
/* Sets a custom amount of heavenly cookies. */
CheatCookie.SetCustomHCookies = function () {
	var moni = CheatCookie.GetNumber('hcookiesInput');
	if (isNaN(moni)) {
		CheatCookie.Actions['setcustomhcookies'].ShowNotify = false;
		lCheat('hcookiesInput').style.color = '#F00';
	}
	else {
		if (moni < 0) {
			moni = 0;
			lCheat('hcookiesInput').value = '0';
		}
		CheatCookie.Actions['setcustomhcookies'].ShowNotify = true;
		if (moni > Game.heavenlyCookies) {
			Game.heavenlyCookies += moni - Game.heavenlyCookies;
		}
		else if (moni < Game.heavenlyCookies) {
			Game.heavenlyCookies -= Game.heavenlyCookies - moni;
		}
		Game.Spend(moni);
		CheatCookie.Actions['setcustomhcookies'].NotifyDescOn = 'Set bank to <b>' + Beautify(moni) + '</b> heavenly cookies!';
		lCheat('hcookiesInput').style.color = '#FFF';
		Game.Win('Cheated cookies taste awful');
	}

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}
/* Adds 1/10 heavenly cookies. */
CheatCookie.AddHCookies = function () {
	var moni = Game.heavenlyCookies * 0.1;
	moni = Math.max(1, moni);
	Game.heavenlyCookies += moni;
	CheatCookie.Actions['addhcookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}
/* Doubles your heavenly cookies. */
CheatCookie.HCookiesX2 = function () {
	var moni = Game.heavenlyCookies * 1.0;
	moni = Math.max(2, moni);
	Game.heavenlyCookies += moni;
	CheatCookie.Actions['x2hcookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}
/* x10 your heavenly cookies. */
CheatCookie.HCookiesX10 = function () {
	var moni = Game.heavenlyCookies * 9.0;
	moni = Math.max(10, moni);
	Game.heavenlyCookies += moni;
	CheatCookie.Actions['x10hcookies'].NotifyDescOn = '+<b>' + Beautify(moni) + '</b> heavenly cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}
/* Loses 1/10 heavenly cookies. */
CheatCookie.LoseHCookies = function () {
	var moni = Game.heavenlyCookies * (1.0 / 10.0);
	Game.heavenlyCookies -= moni;
	CheatCookie.Actions['losehcookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}
/* Halves heavenly cookies. */
CheatCookie.HCookiesD2 = function () {
	var moni = Game.heavenlyCookies * (1.0 / 2.0);
	Game.heavenlyCookies -= moni;
	CheatCookie.Actions['d2hcookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}
/* 1/10 heavenly cookies. */
CheatCookie.HCookiesD10 = function () {
	var moni = Game.heavenlyCookies * (9.0 / 10.0);
	Game.heavenlyCookies -= moni;
	CheatCookie.Actions['d10hcookies'].NotifyDescOn = '-<b>' + Beautify(moni) + '</b> heavenly cookies!';
	Game.Win('Cheated cookies taste awful');

	lCheat('hcookies').innerHTML = Beautify(Game.heavenlyCookies);
}

//#endregion


/* Unlocks all upgrades. */
CheatCookie.BuyAllUpgrades = function () {
	for (var i in Game.Upgrades) {
		var upgrade = Game.Upgrades[i];
		if (upgrade) {
			if (upgrade.pool != 'debug' && upgrade.pool != 'prestigeDecor' && upgrade.pool != 'toggle') {
				Game.Upgrades[i].unlocked = 1;
				if (!upgrade.bought)
					upgrade.toggle();
			}
		}
	}
	Game.RebuildUpgrades();
	Game.Win('Cheated cookies taste awful');
}
/* Sells all upgrades. */
CheatCookie.SellAllUpgrades = function () {
	for (var i in Game.Upgrades) {
		var upgrade = Game.Upgrades[i];
		if (upgrade) {
			if (upgrade.pool != 'debug' && upgrade.pool != 'prestigeDecor' && upgrade.pool != 'toggle') {
				Game.Upgrades[i].unlocked = 1;
				if (upgrade.bought)
					upgrade.toggle();
			}
		}
	}
	Game.RebuildUpgrades();
}
	
/* Unlocks all upgrades. */
CheatCookie.BuyDebugUpgrades = function () {
	for (var i in Game.Upgrades) {
		var upgrade = Game.Upgrades[i];
		if (upgrade) {
			if ((upgrade.pool == 'debug' || upgrade.pool == 'prestigeDecor') && upgrade.pool != 'toggle') {
				Game.Upgrades[i].unlocked = 1;
				if (!upgrade.bought)
					upgrade.toggle();
			}
		}
	}
	Game.RebuildUpgrades();
	Game.Win('Cheated cookies taste awful');
}

//#region Upgrades

CheatCookie.UpdateUpgrades = function () {
	var basicUpgrades = 0, basicUpgradesTotal = 0;
	var cookieUpgrades = 0, cookieUpgradesTotal = 0;
	var prestigeUpgrades = 0, prestigeUpgradesTotal = 0;
	var debugUpgrades = 0, debugUpgradesTotal = 0;
	for (var i in Game.Upgrades) {
		var upgrade = Game.Upgrades[i];
		if (upgrade.pool == 'cookie') { cookieUpgradesTotal++; if (upgrade.bought) cookieUpgrades++; }
		else if (upgrade.pool == 'prestige') { prestigeUpgradesTotal++; if (upgrade.bought) prestigeUpgrades++; }
		else if (upgrade.pool == 'debug') { debugUpgradesTotal++; if (upgrade.bought) debugUpgrades++; }
		else if (upgrade.pool != 'toggle') { basicUpgradesTotal++; if (upgrade.bought) basicUpgrades++; }
	}

	lCheat('basicupgradesowned').innerHTML = basicUpgrades + '/' + basicUpgradesTotal;
	lCheat('cookieupgradesowned').innerHTML = cookieUpgrades + '/' + cookieUpgradesTotal;
	lCheat('prestigeupgradesowned').innerHTML = prestigeUpgrades + '/' + prestigeUpgradesTotal;
	lCheat('debugupgradesowned').innerHTML = debugUpgrades + '/' + debugUpgradesTotal;
}

/* Removes the Cheated cookies taste awful achievement. */
CheatCookie.BuyUpgrade = function () {

	var text = lCheat('upgradeInput').value;

	if (text in Game.Upgrades) {
		var upgrade = Game.Upgrades[text];
		CheatCookie.Actions['buyupgrade'].ShowNotify = true;
		CheatCookie.Actions['buyupgrade'].Icon = upgrade.icon;
		CheatCookie.Actions['buyupgrade'].NotifyDescOn = 'Bought upgrade ' + text + '.';
		lCheat('upgradeInput').style.color = '#FFF';

		Game.Earn(upgrade.getPrice());
		upgrade.buy(true);

		Game.RebuildUpgrades();

		Game.Win('Cheated cookies taste awful');
	}
	else {
		CheatCookie.Actions['buyupgrade'].ShowNotify = false;
		lCheat('upgradeInput').style.color = '#F00';
	}

	CheatCookie.UpdateUpgrades();
}
/* Buys the upgrade. */
CheatCookie.BuyUpgrade = function () {
	var text = lCheat('upgradeInput').value;

	if (text in Game.Upgrades) {
		var upgrade = Game.Upgrades[text];
		CheatCookie.Actions['buyupgrade'].ShowNotify = true;
		CheatCookie.Actions['buyupgrade'].Icon = upgrade.icon;
		CheatCookie.Actions['buyupgrade'].NotifyDescOn = '<div class="title" style="font-size:18px;">' + text + '</div>';
		lCheat('upgradeInput').style.color = '#FFF';

		if (!upgrade.unlocked)
			upgrade.unlocked = true;
		if (!upgrade.bought)
			upgrade.buy(true);

		Game.RebuildUpgrades();
		Game.Win('Cheated cookies taste awful');
	}
	else {
		CheatCookie.Actions['buyupgrade'].ShowNotify = false;
		lCheat('upgradeInput').style.color = '#F00';
	}

	CheatCookie.UpdateUpgrades();
}
/* Sells the upgrade. */
CheatCookie.SellUpgrade = function () {
	var text = lCheat('upgradeInput').value;

	if (text in Game.Upgrades) {
		var upgrade = Game.Upgrades[text];
		CheatCookie.Actions['sellupgrade'].ShowNotify = true;
		CheatCookie.Actions['sellupgrade'].Icon = upgrade.icon;
		CheatCookie.Actions['sellupgrade'].NotifyDescOn = '<div class="title" style="font-size:18px;">' + text + '</div>';
		lCheat('upgradeInput').style.color = '#FFF';

		if (upgrade.bought)
			upgrade.toggle();

		Game.RebuildUpgrades();
		Game.Win('Cheated cookies taste awful');
	}
	else {
		CheatCookie.Actions['sellupgrade'].ShowNotify = false;
		lCheat('upgradeInput').style.color = '#F00';
	}

	CheatCookie.UpdateUpgrades();
}
/* Unlocks the upgrade. */
CheatCookie.UnlockUpgrade = function () {
	var text = lCheat('upgradeInput').value;

	if (text in Game.Upgrades) {
		var upgrade = Game.Upgrades[text];
		CheatCookie.Actions['unlockupgrade'].ShowNotify = true;
		CheatCookie.Actions['unlockupgrade'].Icon = upgrade.icon;
		CheatCookie.Actions['unlockupgrade'].NotifyDescOn = '<div class="title" style="font-size:18px;">' + text + '</div>';
		lCheat('upgradeInput').style.color = '#FFF';

		if (!upgrade.unlocked)
			Game.Unlock(text);

		Game.RebuildUpgrades();
		Game.Win('Cheated cookies taste awful');
	}
	else {
		CheatCookie.Actions['unlockupgrade'].ShowNotify = false;
		lCheat('upgradeInput').style.color = '#F00';
	}

	CheatCookie.UpdateUpgrades();
}
/* Locks the upgrade. */
CheatCookie.LockUpgrade = function () {
	var text = lCheat('upgradeInput').value;

	if (text in Game.Upgrades) {
		var upgrade = Game.Upgrades[text];
		CheatCookie.Actions['lockupgrade'].ShowNotify = true;
		CheatCookie.Actions['lockupgrade'].Icon = upgrade.icon;
		CheatCookie.Actions['lockupgrade'].NotifyDescOn = '<div class="title" style="font-size:18px;">' + text + '</div>';
		lCheat('upgradeInput').style.color = '#FFF';

		if (upgrade.unlocked) {
			if (upgrade.bought)
				upgrade.toggle();
			Game.Lock(text);
		}

		Game.RebuildUpgrades();
		Game.Win('Cheated cookies taste awful');
	}
	else {
		CheatCookie.Actions['lockupgrade'].ShowNotify = false;
		lCheat('upgradeInput').style.color = '#F00';
	}

	CheatCookie.UpdateUpgrades();
}
CheatCookie.GetUpgradeID = function () {
	var text = lCheat('upgradeInput').value;

	if (text in Game.Upgrades) {
		var upgrade = Game.Upgrades[text];
		lCheat('upgradeInput').style.color = '#FFF';
		lCheat('upgradeID').innerHTML = upgrade.id.toString();
	}
	else {
		lCheat('upgradeInput').style.color = '#F00';
		lCheat('upgradeID').innerHTML = '';
	}
}


//#endregion
//#region Achievements

CheatCookie.UpdateAchievements = function () {
	var achievements = 0, achievementsTotal = 0;
	var shadow = 0, shadowTotal = 0;
	for (var i in Game.Achievements) {
		var achiev = Game.Achievements[i];
		if (achiev.hide == 3) { shadowTotal++; if (achiev.won) shadow++; }
		else { achievementsTotal++; if (achiev.won) achievements++; }
	}

	lCheat('achievwon').innerHTML = achievements + '/' + achievementsTotal;
	lCheat('shadowwon').innerHTML = shadow + '/' + shadowTotal;
}
CheatCookie.WinAllAchievements = function () {

	// Supress the unlock notification
	var backupWin = Game.Win;
	Game.Win = function (what) {
		if (typeof what === 'string') {
			if (Game.Achievements[what]) {
				if (Game.Achievements[what].won == 0) {
					Game.Achievements[what].won = 1;
					//if (Game.prefs.popups) Game.Popup('Achievement unlocked :<br>' + Game.Achievements[what].name);
					//else Game.Notify('Achievement unlocked', '<div class="title" style="font-size:18px;">' + Game.Achievements[what].name + '</div>', Game.Achievements[what].icon);
					if (Game.Achievements[what].hide != 3) Game.AchievementsOwned++;
					Game.recalculateGains = 1;
				}
			}
		}
		else { for (var i in what) { Game.Win(what[i]); } }
	}

	for (var i in Game.Achievements) {
		if (!Game.Achievements[i].won)
			Game.Win(Game.Achievements[i].name);
	}

	// Restore the function
	Game.Win = backupWin;

	CheatCookie.UpdateAchievements();
}
CheatCookie.LoseAllAchievements = function () {

	for (var i in Game.Achievements) {
		if (!Game.Achievements[i].won)
			Game.Win(Game.Achievements[i].name);
		if (Game.Achievements[i].won) {
			Game.Achievements[i].won = false;
			if (Game.Achievements[i].hide != 3)
				Game.AchievementsOwned--;
		}
	}
	Game.recalculateGains = 1;

	CheatCookie.UpdateAchievements();
}
CheatCookie.WinAchievement = function () {
	var text = lCheat('achievInput').value;

	if (text in Game.Achievements) {
		var achiev = Game.Achievements[text];
		CheatCookie.Actions['winachiev'].ShowNotify = false;
		CheatCookie.Actions['winachiev'].Icon = achiev.icon;
		CheatCookie.Actions['winachiev'].NotifyDescOn = 'Unlocked upgrade ' + text + '.';
		lCheat('achievInput').style.color = '#FFF';

		if (!achiev.won) {
			Game.Win(text);
		}
		else {
			Game.Notify('Achievement unlocked', '<div class="title" style="font-size:18px;">' + achiev.name + '</div>', achiev.icon);
		}

		Game.Win('Cheated cookies taste awful');
	}
	else {
		CheatCookie.Actions['winachiev'].ShowNotify = false;
		lCheat('achievInput').style.color = '#F00';
	}

	CheatCookie.UpdateAchievements();
}
CheatCookie.LoseAchievement = function () {
	var text = lCheat('achievInput').value;

	if (text in Game.Achievements) {
		var achiev = Game.Achievements[text];
		CheatCookie.Actions['loseachiev'].ShowNotify = true;
		CheatCookie.Actions['loseachiev'].Icon = achiev.icon;
		CheatCookie.Actions['loseachiev'].NotifyDescOn = '<div class="title" style="font-size:18px;">' + achiev.name + '</div>';
		lCheat('achievInput').style.color = '#FFF';

		if (achiev.won) {
			achiev.won = false;
			if (achiev.hide != 3)
				Game.AchievementsOwned--;
			Game.recalculateGains = 1;
		}

		Game.Win('Cheated cookies taste awful');
	}
	else {
		CheatCookie.Actions['loseachiev'].ShowNotify = false;
		lCheat('achievInput').style.color = '#F00';
	}

	CheatCookie.UpdateAchievements();
}
CheatCookie.GetAchievementID = function () {
	var text = lCheat('achievInput').value;

	if (text in Game.Achievements) {
		var achiev = Game.Achievements[text];
		lCheat('achievInput').style.color = '#FFF';
		lCheat('achievID').innerHTML = achiev.id.toString();
	}
	else {
		CheatCookie.Actions['loseachiev'].ShowNotify = false;
		lCheat('achievInput').style.color = '#F00';
		lCheat('achievID').innerHTML = '';
	}
}

//#endregion

/* Removes the Cheated cookies taste awful achievement. */
CheatCookie.RemoveAchievement = function () {
	Game.Achievements['Cheated cookies taste awful'].won = 0;
}


CheatCookie.SpawnWrinkler = function () {
	var spawned = false;
	for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];
		if (me.phase == 0 && Game.elderWrath > 0) {
			me.phase = 1;
			me.hp = Game.wrinklerHP;
			spawned = true;
			break;
		}
	}
	if (spawned)
		CheatCookie.Actions['spawnwrinkler'].NotifyDescOn = 'Wrinkler spawned.';
	else
		CheatCookie.Actions['spawnwrinkler'].NotifyDescOn = '10 wrinklers already exist.';

	Game.Win('Cheated cookies taste awful');
}
CheatCookie.SpawnSeason = function () {
	var spawned = false;
	var type = 'Reindeer';
	var notAvailable = false;
	if (Game.seasonPopup.toDie == 0 && Game.seasonPopup.life <= 0) {
		if (Game.season == 'christmas') {
			Game.seasonPopup.type = 'reindeer';
			Game.seasonPopup.spawn();
			type = 'Reindeer';
			spawned = true;
		}
		else {
			notAvailable = true;
		}
	}
	else if (Game.seasonPopup.type == 'reindeer') {
		type = 'Reindeer';
	}
	if (spawned)
		CheatCookie.Actions['spawnseason'].NotifyDescOn = type + ' spawned.';
	else if (notAvailable)
		CheatCookie.Actions['spawnseason'].NotifyDescOn = 'No popup available for this season.';
	else
		CheatCookie.Actions['spawnseason'].NotifyDescOn = type + ' already exists.';

	Game.Win('Cheated cookies taste awful');
}
CheatCookie.SpawnGolden = function () {
	var spawned = false;
	var type = 'Golden';
	if (Game.goldenCookie.toDie == 0 && Game.goldenCookie.life <= 0) {
		Game.goldenCookie.spawn();

		var me = l('goldenCookie');
		if (Game.goldenCookie.wrath) {
			Game.goldenCookie.wrath = false;
			me.style.background = 'url(img/goldCookie.png)';
		}
		spawned = true;
	}
	else if (Game.goldenCookie.wrath) {
		type = 'Wrath';
	}

	if (spawned)
		CheatCookie.Actions['spawngolden'].NotifyDescOn = 'Golden cookie spawned.';
	else
		CheatCookie.Actions['spawngolden'].NotifyDescOn = type + ' cookie already exists.';

	Game.Win('Cheated cookies taste awful');
}
CheatCookie.SpawnWrath = function () {
	var spawned = false;
	var type = 'Golden';
	if (Game.goldenCookie.toDie == 0 && Game.goldenCookie.life <= 0) {
		Game.goldenCookie.spawn();

		var me = l('goldenCookie');
		if (!Game.goldenCookie.wrath) {
			Game.goldenCookie.wrath = true;
			if (Game.season == 'halloween')
				me.style.background = 'url(img/spookyCookie.png)';
			else
				me.style.background = 'url(img/wrathCookie.png)';
		}
		spawned = true;
	}
	else if (Game.goldenCookie.wrath) {
		type = 'Wrath';
	}
	if (spawned)
		CheatCookie.Actions['spawnwrath'].NotifyDescOn = 'Wrath cookie spawned.';
	else
		CheatCookie.Actions['spawnwrath'].NotifyDescOn = type + ' cookie already exists.';

	Game.Win('Cheated cookies taste awful');
}

/*=====================================================================================
CHEAT COOKIE ACTION
=======================================================================================*/

/* Writes the action button. */
CheatCookie.WriteButton = function (name) {
	var action = CheatCookie.Actions[name];
	var button = lCheat(name + 'Button');

	if (action.Type == 'toggle') {
		var on = action.ButtonName + ' ON'.fontcolor('green');
		var off = action.ButtonName + ' OFF'.fontcolor('red');
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="CheatCookie.Toggle(\'' + name + '\',\'' + button + '\');">' + (action.Enabled ? on : off) + '</a>';
	}
	else if (action.Type == 'basic') {
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="CheatCookie.Actions[\'' + name + '\'].Action();">' + action.ButtonName + '</a>';
	}
}
/* Toggles the action button function. */
CheatCookie.Toggle = function (name, button) {
	CheatCookie.Actions[name].Action();
	var action = CheatCookie.Actions[name];
	if (action.Enabled) {
		lCheat(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
		lCheat(button).className = 'option enabled';
	}
	else {
		lCheat(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
		lCheat(button).className = 'option';
	}
}

/* The Cheat Cookie Action object. */
function CheatCookieAction(name, buttonName, icon, keyName, type, enabled, delay, func, showNotify, notifyTitle, notifyDescOn, notifyDescOff) {
	this.Name = name;
	this.ButtonName = (buttonName == null ? name : buttonName);
	this.Icon = icon;
	this.KeyName = keyName;
	this.Type = type;
	this.Enabled = enabled;
	this.Delay = delay;
	this.Func = func;
	this.ShowNotify = showNotify;
	this.ID = 0;

	this.NotifyTitle = notifyTitle || name;
	this.NotifyDescOn = notifyDescOn || ('Mode ' + 'Activated'.fontcolor('green'));
	this.NotifyDescOff = notifyDescOff || ('Mode ' + 'Deactivated'.fontcolor('red'));

	if (enabled) {
		this.Enable(false);
	}
}
/* Calls the action. */
CheatCookieAction.prototype.Action = function (notify) {
	if (this.Type == 'toggle') {
		this.Enabled = !this.Enabled;
		if (this.Delay)
			this.ID = this.ID ? clearInterval(this.ID) : setInterval(this.Func, this.Delay);
		else
			this.Func();
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
CheatCookieAction.prototype.Enable = function (notify) {
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
CheatCookieAction.prototype.Disable = function (notify) {
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

/*=====================================================================================
CHEAT COOKIE VARIABLES
=======================================================================================*/

/* The list of actions. */
CheatCookie.Actions = {
	addcookies: new CheatCookieAction('Add Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.AddCookies, true, 'Added Cookies!'),
	x2cookies: new CheatCookieAction('x2 Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.CookiesX2, true, 'Doubled Cookies!'),
	x10cookies: new CheatCookieAction('x10 Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.CookiesX10, true, 'x10 Cookies!'),

	losecookies: new CheatCookieAction('Lose Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.LoseCookies, true, 'Lost Cookies!'),
	d2cookies: new CheatCookieAction('1/2 Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.CookiesD2, true, 'Halfed Cookies!'),
	d10cookies: new CheatCookieAction('1/10 Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.CookiesD10, true, '1/10 Cookies!'),

	addcustomcookies: new CheatCookieAction('Add Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.AddCustomCookies, true, 'Added Cookies!'),
	setcustomcookies: new CheatCookieAction('Set Cookies', null, [10, 6], '', 'basic', false, 0, CheatCookie.SetCustomCookies, true, 'Set Cookies!'),
	
	frenzy: new CheatCookieAction('Frenzy', null, [10, 13], '', 'basic', false, 0, CheatCookie.Frenzy, true, 'Frenzy!'),
	elder: new CheatCookieAction('Elder Frenzy', null, [1, 13], '', 'basic', false, 0, CheatCookie.ElderFrenzy, true, 'Elder Frenzy!'),
	click: new CheatCookieAction('Click Frenzy', null, [11, 13], '', 'basic', false, 0, CheatCookie.ClickFrenzy, true, 'Click Frenzy!'),



	addhchips: new CheatCookieAction('Add Heavenly Chips', 'Add H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.AddHChips, true, 'Added Heavenly Chips!'),
	x2hchips: new CheatCookieAction('x2 Heavenly Chips', 'x2 H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.HChipsX2, true, 'Doubled Heavenly Chips!'),
	x10hchips: new CheatCookieAction('x10 Heavenly Chips', 'x10 H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.HChipsX10, true, 'X10 Heavenly Chips!'),

	losehchips: new CheatCookieAction('Lose Heavenly Chips', 'Lose H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.LoseHChips, true, 'Lost Heavenly Chips!'),
	d2hchips: new CheatCookieAction('1/2 Heavenly Chips', '1/2 H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.HChipsD2, true, 'Halfed Heavenly Chips!'),
	d10hchips: new CheatCookieAction('1/10 Heavenly Chips', '1/10 H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.HChipsD10, true, '1/10 Heavenly Chips!'),

	addcustomhchips: new CheatCookieAction('Add Heavenly Chips', 'Add H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.AddCustomHChips, true, 'Added Heavenly Chips!'),
	setcustomhchips: new CheatCookieAction('Set Heavenly Chips', 'Set H.Chips', [19, 7], '', 'basic', false, 0, CheatCookie.SetCustomHChips, true, 'Set Heavenly Chips!'),



	addhcookies: new CheatCookieAction('Add Heavenly Cookies', 'Add H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.AddHCookies, true, 'Added Heavenly Cookies!'),
	x2hcookies: new CheatCookieAction('x2 Heavenly Cookies', 'x2 H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.HCookiesX2, true, 'Doubled Heavenly Cookies!'),
	x10hcookies: new CheatCookieAction('x10 Heavenly Cookies', 'x10 H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.HCookiesX10, true, 'X10 Heavenly Cookies!'),
	losehcookies: new CheatCookieAction('Lose Heavenly Cookies', 'Lose H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.LoseHCookies, true, 'Lost Heavenly Cookies!'),
	d2hcookies: new CheatCookieAction('1/2 Heavenly Cookies', '1/2 H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.HCookiesD2, true, 'Halfed Heavenly Cookies!'),
	d10hcookies: new CheatCookieAction('1/10 Heavenly Cookies', '1/10 H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.HCookiesD10, true, '1/10 Heavenly Cookies!'),

	addcustomhcookies: new CheatCookieAction('Add Heavenly Cookies', 'Add H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.AddCustomHCookies, true, 'Added Heavenly Cookies!'),
	setcustomhcookies: new CheatCookieAction('Set Heavenly Cookies', 'Set H.Cookies', [20, 7], '', 'basic', false, 0, CheatCookie.SetCustomHCookies, true, 'Set Heavenly Cookies!'),



	buyupgrade: new CheatCookieAction('Buy Upgrade', null, [11, 9], '', 'basic', false, 0, CheatCookie.BuyUpgrade, true, 'Upgrade Bought'),
	sellupgrade: new CheatCookieAction('Sell Upgrade', null, [11, 9], '', 'basic', false, 0, CheatCookie.SellUpgrade, true, 'Upgrade Sold'),
	unlockupgrade: new CheatCookieAction('Unlock Upgrade', null, [11, 9], '', 'basic', false, 0, CheatCookie.UnlockUpgrade, true, 'Upgrade Unlocked'),
	lockupgrade: new CheatCookieAction('Lock Upgrade', null, [11, 9], '', 'basic', false, 0, CheatCookie.LockUpgrade, true, 'Upgrade Locked'),
	getupgradeid: new CheatCookieAction('Get ID', null, [11, 9], '', 'basic', false, 0, CheatCookie.GetUpgradeID, false),

	winachiev: new CheatCookieAction('Win Achievement', null, [12, 5], '', 'basic', false, 0, CheatCookie.WinAchievement, true, 'Achievement unlocked'),
	loseachiev: new CheatCookieAction('Lose Achievement', null, [12, 5], '', 'basic', false, 0, CheatCookie.LoseAchievement, true, 'Achievement lost'),
	getachievid: new CheatCookieAction('Get ID', null, [12, 5], '', 'basic', false, 0, CheatCookie.GetAchievementID, false),
	
	winallachiev: new CheatCookieAction('Win All Achievements', null, [12, 5], '', 'basic', false, 0, CheatCookie.WinAllAchievements, true, 'All Achievements', 'Every achievement unlocked!'),
	loseallachiev: new CheatCookieAction('Lose All Achievements', null, [12, 5], '', 'basic', false, 0, CheatCookie.LoseAllAchievements, true, 'All Achievements', 'Every achievement locked!'),


	spawnwrinkler: new CheatCookieAction('Spawn Wrinkler', null, [19, 8], '', 'basic', false, 0, CheatCookie.SpawnWrinkler, true),
	spawnseason: new CheatCookieAction('Spawn Season Popup', null, [12, 9], '', 'basic', false, 0, CheatCookie.SpawnSeason, true),
	spawngolden: new CheatCookieAction('Spawn Golden Cookie', null, [10, 14], '', 'basic', false, 0, CheatCookie.SpawnGolden, true),
	spawnwrath: new CheatCookieAction('Spawn Wrath Cookie', null, [15, 5], '', 'basic', false, 0, CheatCookie.SpawnWrath, true),

	buyallupgrades: new CheatCookieAction('Buy All Upgrades', null, [11, 9], '', 'basic', false, 0, CheatCookie.BuyAllUpgrades, true, 'All Upgrades', 'Every upgrade bought!'),
	sellallupgrades: new CheatCookieAction('Sell All Upgrades', null, [11, 9], '', 'basic', false, 0, CheatCookie.SellAllUpgrades, true, 'Sell Upgrades', 'Every upgrade sold!'),
	buydebugupgrades: new CheatCookieAction('Buy Debug Upgrades', null, [11, 9], '', 'basic', false, 0, CheatCookie.BuyDebugUpgrades, true, 'Debug Upgrades', 'Every debug upgrade bought!'),
	removehack: new CheatCookieAction('Remove Hack Achievement', null, [10, 6], '', 'basic', false, 0, CheatCookie.RemoveAchievement, true, 'Achievement lost', '<div class="title" style="font-size:18px;">Cheated cookies taste awful</div>')
};

/*=====================================================================================
LAUNCH CHEAT COOKIE
=======================================================================================*/

// Launch Cheat Cookie
CheatCookie.Init();

