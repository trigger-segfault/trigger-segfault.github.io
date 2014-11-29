/*=====================================================================================
HOTFIX COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/HotfixCookie.js

// Based off "Cookieclicker Bots".
// Link: https://gist.githubusercontent.com/pernatiy/38bc231506b06fd85473/raw/cc.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'HotfixCookie';
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

/* Returns the element used in mod. */
function lHotfix(name) {
	if (name.indexOf('HotfixCookie') != 0)
		return l('HotfixCookie' + name);
	return l(name);
}
/* Returns the element with the name used in mod. */
function iHotfix(name) {
	if (name.indexOf('HotfixCookie') != 0)
		return 'HotfixCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
HOTFIX COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the Hotfix Cookie mod. */
HotfixCookie = {};
/* The static class that manages Game backups. */
HotfixCookie.Backup = {};
/* True if the mod has been loaded. */
HotfixCookie.Loaded = false;
/* True if the mod is enabled. */
HotfixCookie.Enabled = false;

//#endregion
/*=====================================================================================
HOTFIX COOKIE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Hotfix Cookie. */
HotfixCookie.Init = function () {
	LoadTriggerCookies();

	IntervalUntilLoaded(function () {
		TriggerCookies.AddMod('Hotfix Cookie', 'HotfixCookie', [10, 22], HotfixCookie.Enable, HotfixCookie.Disable, HotfixCookie.Load, HotfixCookie.Save, HotfixCookie.WriteMenu, HotfixCookie.UpateMenu, true);
		TriggerCookies.AddTab('Enhancements', 200);

		// Hey guess what!? This is a mod you're using! So why not receive the plugin shadow achievement?
		Game.Win('Third-party');

		HotfixCookie.Loaded = true;
	});
}

/* Loads Hotfix Cookie. */
HotfixCookie.Enable = function (firstTime) {

	if (firstTime) {

		if (Game.season == 'christmas')
			Game.Lock('Festive biscuit');
		if (Game.season == 'halloween')
			Game.Lock('Ghostly biscuit');
		if (Game.season == 'valentines')
			Game.Lock('Lovesick biscuit');
		if (Game.season == 'easter')
			Game.Lock('Bunny biscuit');
		if (Game.season == 'fools')
			Game.Lock('Fool\'s biscuit');
	}

	HotfixCookie.Enabled = true;
}
/* Unloads Hotfix Cookie. */
HotfixCookie.Disable = function () {

	HotfixCookie.DisableAll();

	HotfixCookie.Enabled = false;
}
/* Loads the mod settings. */
HotfixCookie.Load = function (data) {
	function isValid(varname, name, value) { return (name == varname && !isNaN(value)); }
	function readAction(action, name, value) {
		if (action == name) {
			if (value && !HotfixCookie.Actions[action].Enabled)
				HotfixCookie.Actions[action].Enable(false);
			else if (!value && HotfixCookie.Actions[action].Enabled)
				HotfixCookie.Actions[action].Disable(false);
		}
	}

	var lines = data.split('|');
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.indexOf('=') != -1) {
			var line = line.split('=');
			var name = line[0], valueStr = line[1], value = parseInt(valueStr), valuef = parseFloat(valueStr);

			readAction('fixbank', name, value);
			readAction('fixup', name, value);
			readAction('fixachiev', name, value);

			readAction('fixhcookies', name, value);
		}
	}
}
/* Saves the mod settings. */
HotfixCookie.Save = function () {
	function write(name, value) { return name + '=' + value.toString() + '|'; }
	function writeAction(name) { return name + '=' + (HotfixCookie.Actions[name].Enabled ? 1 : 0).toString() + '|'; }
	var str = '';

	str +=
	writeAction('fixbank') +
	writeAction('fixup') +
	writeAction('fixachiev') +

	writeAction('fixhcookies') +

	'';
	return str;
}

//#endregion
/*=====================================================================================
HOTFIX COOKIE MENU
=======================================================================================*/

/*HotfixCookie.WriteSectionHead = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';

	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';

	return str;
}
HotfixCookie.WriteSectionMiddle = function () {

	var str = '<div style="width: 100%; margin: 12px 0px;"></div>';
	return str;
}
HotfixCookie.WriteSectionEnd = function () {

	var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
	return str;
}
HotfixCookie.WriteSpacing = function (pixels) {
	if (!pixels)
		pixels = 8;
	var str = '<div style="margin-left: ' + pixels.toString() + 'px; display: inline;"></div>';
	return str;
}*/

/* Writes the Hotfix Cookie buttons. */
HotfixCookie.WriteMenu = function (tab) {
	var str = '';

	if (tab == 'Enhancements') {
		str += Helper.Menu.WriteSectionHeader('Hotfixes', [10, 22]);
		str += '<div class="listing">' +
			HotfixCookie.WriteButton('fixbank') +
			HotfixCookie.WriteButton('fixup') +
			HotfixCookie.WriteButton('fixachiev') +
			HotfixCookie.WriteButton('fixhcookies') +
			'</div>';
		str += Helper.Menu.WriteSectionEnd();
	}

	return str;
}
/* Writes the Hotfix Cookie buttons. */
HotfixCookie.UpateMenu = function () {

}

//============ MODES ============

/* Enables all important modes. */
HotfixCookie.EnabledAll = function () {

	HotfixCookie.Actions['fixup'].Enable(false);
	HotfixCookie.Actions['fixachiev'].Enable(false);

	Game.UpdateMenu();
}
/* Disables all modes. */
HotfixCookie.DisableAll = function () {

	HotfixCookie.Actions['fixup'].Disable(false);
	HotfixCookie.Actions['fixachiev'].Disable(false);

	Game.UpdateMenu();
}
/* Fixes broken upgrades. */
HotfixCookie.FixUpgrades = function () {
	/*if (Game.Objects['Bank'].amount >= 10)
		Game.Unlock('Acid-proof vault');*/

	if (Game.season == 'valentines' && Game.cookies >= 50000)
		Game.Unlock('Pure heart biscuits');
}
/* Fixes broken achievements. */
HotfixCookie.FixAchievements = function () {
	if (Game.cookiesEarned >= 1000000 && Game.cookieClicks <= 15)
		Game.Win('Neverclick');
	if (Game.cookiesEarned >= 1000000 && Game.cookieClicks <= 0)
		Game.Win('True Neverclick');

	var timePlayed = new Date();
	timePlayed.setTime(new Date().getTime() - Game.startDate);
	if (Game.cookiesEarned >= 1000000 && !Game.Has('Heavenly chip secret')) {
		if (timePlayed <= 1000 * 60 * 35) Game.Win('Speed baking I');
		if (timePlayed <= 1000 * 60 * 25) Game.Win('Speed baking II');
		if (timePlayed <= 1000 * 60 * 15) Game.Win('Speed baking III');
	}

	var eggs = 0;
	for (var i in Game.easterEggs) {
		if (Game.HasUnlocked(Game.easterEggs[i])) eggs++;
	}
	if (eggs >= 1) Game.Win('The hunt is on');
	if (eggs >= 7) Game.Win('Egging on');
	if (eggs >= 14) Game.Win('Mass Easteria');
	if (eggs >= Game.easterEggs.length) Game.Win('Hide & seek champion');
}

HotfixCookie.FixHCookies = function () {
	if (HotfixCookie.Actions['fixhcookies'].Enabled) {
		Overrides.OverrideFunction('Game.CalculateGains', 'HotfixCookie.CalculateGains', 'HotfixCookie');
	}
	else {
		Overrides.RestoreFunction('Game.CalculateGains', 'HotfixCookie');
	}
	Game.CalculateGains();
}
HotfixCookie.FixBank = function () {
	var upgrade = Game.Upgrades['Acid-proof vault'];
	if (upgrade && HotfixCookie.Actions['fixbank'].Enabled) {
		upgrade.name = 'Acid-proof vaults';
		Game.Upgrades['Acid-proof vaults'] = upgrade;
		delete Game.Upgrades['Acid-proof vault'];
	}
	else if (!upgrade && !HotfixCookie.Actions['fixbank'].Enabled) {
		upgrade = Game.Upgrades['Acid-proof vaults'];
		if (upgrade) {
			upgrade.name = 'Acid-proof vault';
			Game.Upgrades['Acid-proof vault'] = upgrade;
			delete Game.Upgrades['Acid-proof vaults'];
		}
	}
}

HotfixCookie.CalculateGains = function () {
	Game.cookiesPs = 0;
	var mult = 1;

	var heavenlyMult = 0;
	if (Game.Has('Heavenly chip secret')) heavenlyMult += 0.05;
	if (Game.Has('Heavenly cookie stand')) heavenlyMult += 0.20;
	if (Game.Has('Heavenly bakery')) heavenlyMult += 0.25;
	if (Game.Has('Heavenly confectionery')) heavenlyMult += 0.25;
	if (Game.Has('Heavenly key')) heavenlyMult += 0.25;
	mult += parseFloat(Game.heavenlyCookies) * 0.01 * heavenlyMult;

	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		if (me.bought > 0) {
			if (me.pool == 'cookie' && Game.Has(me.name)) mult *= (1 + (typeof (me.power) == 'function' ? me.power(me) : me.power) * 0.01);
		}
	}
	if (Game.Has('Specialized chocolate chips')) mult *= 1.01;
	if (Game.Has('Designer cocoa beans')) mult *= 1.02;
	if (Game.Has('Underworld ovens')) mult *= 1.03;
	if (Game.Has('Exotic nuts')) mult *= 1.04;
	if (Game.Has('Arcane sugar')) mult *= 1.05;

	if (Game.Has('Increased merriness')) mult *= 1.15;
	if (Game.Has('Improved jolliness')) mult *= 1.15;
	if (Game.Has('A lump of coal')) mult *= 1.01;
	if (Game.Has('An itchy sweater')) mult *= 1.01;
	if (Game.Has('Santa\'s dominion')) mult *= 1.2;

	if (Game.Has('Santa\'s legacy')) mult *= (Game.santaLevel + 1) * 0.05;

	for (var i in Game.Objects) {
		var me = Game.Objects[i];
		me.storedCps = (typeof (me.cps) == 'function' ? me.cps(me) : me.cps);
		me.storedTotalCps = me.amount * me.storedCps;
		Game.cookiesPs += me.storedTotalCps;
	}

	if (Game.Has('"egg"')) Game.cookiesPs += 9;//"egg"
	if (Game.Has('"god"')) Game.cookiesPs += 9;//"god"

	for (var i in Game.customCps) { mult += Game.customCps[i](); }

	var milkMult = Game.Has('Santa\'s milk and cookies') ? 1.05 : 1;
	if (Game.Has('Kitten helpers')) mult *= (1 + Game.milkProgress * 0.05 * milkMult);
	if (Game.Has('Kitten workers')) mult *= (1 + Game.milkProgress * 0.1 * milkMult);
	if (Game.Has('Kitten engineers')) mult *= (1 + Game.milkProgress * 0.2 * milkMult);
	if (Game.Has('Kitten overseers')) mult *= (1 + Game.milkProgress * 0.2 * milkMult);
	if (Game.Has('Kitten managers')) mult *= (1 + Game.milkProgress * 0.2 * milkMult);
	if (Game.Has('Kitten angels')) mult *= (1 + Game.milkProgress * 0.1 * milkMult);

	var eggMult = 0;
	if (Game.Has('Chicken egg')) eggMult++;
	if (Game.Has('Duck egg')) eggMult++;
	if (Game.Has('Turkey egg')) eggMult++;
	if (Game.Has('Quail egg')) eggMult++;
	if (Game.Has('Robin egg')) eggMult++;
	if (Game.Has('Ostrich egg')) eggMult++;
	if (Game.Has('Cassowary egg')) eggMult++;
	if (Game.Has('Salmon roe')) eggMult++;
	if (Game.Has('Frogspawn')) eggMult++;
	if (Game.Has('Shark egg')) eggMult++;
	if (Game.Has('Turtle egg')) eggMult++;
	if (Game.Has('Ant larva')) eggMult++;
	if (Game.Has('Century egg')) {
		//the boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day = Math.floor((new Date().getTime() - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
		day = Math.min(day, 100);
		eggMult += (1 - Math.pow(1 - day / 100, 3)) * 10;
	}
	mult *= (1 + 0.01 * eggMult);

	var rawCookiesPs = Game.cookiesPs * mult;
	for (var i = 0; i < Game.cpsAchievs.length / 2; i++) {
		if (rawCookiesPs >= Game.cpsAchievs[i * 2 + 1]) Game.Win(Game.cpsAchievs[i * 2]);
	}

	if (Game.frenzy > 0) mult *= Game.frenzyPower;

	var sucked = 1;
	for (var i in Game.wrinklers) {
		if (Game.wrinklers[i].phase == 2) sucked -= 1 / 20;
	}
	Game.cpsSucked = (1 - sucked);

	if (Game.Has('Elder Covenant')) mult *= 0.95;

	if (Game.Has('Golden switch')) mult *= 1.25;

	for (var i in Game.customCpsMult) { mult *= Game.customCpsMult[i](); }

	Game.globalCpsMult = mult;
	Game.cookiesPs *= Game.globalCpsMult;

	Game.computedMouseCps = Game.mouseCps();

	Game.recalculateGains = 0;
}

/*=====================================================================================
HOTFIX COOKIE ACTION
=======================================================================================*/

/* Writes the action button. */
HotfixCookie.WriteButton = function (name) {
	var action = HotfixCookie.Actions[name];
	var button = name + 'Button';

	if (action.Type == 'toggle') {
		var on = action.ButtonName + ' ON'.fontcolor('green');
		var off = action.ButtonName + ' OFF'.fontcolor('red');
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="HotfixCookie.Toggle(\'' + name + '\',\'' + button + '\');">' + (action.Enabled ? on : off) + '</a>';
	}
	else if (action.Type == 'basic') {
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="HotfixCookie.Actions[\'' + name + '\'].Action();">' + action.ButtonName + '</a>';
	}
}
/* Toggles the action button function. */
HotfixCookie.Toggle = function (name, button) {
	HotfixCookie.Actions[name].Action();
	var action = HotfixCookie.Actions[name];
	if (action.Enabled) {
		l(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
		l(button).className = 'option enabled';
	}
	else {
		l(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
		l(button).className = 'option';
	}
}

/* The Hotfix Cookie Action object. */
function HotfixCookieAction(name, buttonName, icon, keyName, type, enabled, delay, func, showNotify, notifyTitle, notifyDescOn, notifyDescOff) {
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
HotfixCookieAction.prototype.Action = function (notify) {
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
HotfixCookieAction.prototype.Enable = function (notify) {
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
HotfixCookieAction.prototype.Disable = function (notify) {
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
HOTFIX COOKIE VARIABLES
=======================================================================================*/

/* True if the mod has been loaded. */
var HotfixCookieLoaded = false;
/* True if the Trigger_Cookies Mod Manager is being used. */
HotfixCookie.ModManager = false;
/* True if the mod is loaded. */
HotfixCookie.Loaded = false;

/* The list of actions. */
HotfixCookie.Actions = {
	fixbank: new HotfixCookieAction('Fix Acid-proof vaults', null, [15, 1], '', 'toggle', false, 0, HotfixCookie.FixBank, true, 'Fix Acid-proof vaults',
			'Acid-proof vaults now unlocks and functions properly.', 'Acid-proof vaults no longer unlocks or functions properly.'),
	fixup: new HotfixCookieAction('Fix Upgrades', null, [9, 22], '', 'toggle', false, 5000, HotfixCookie.FixUpgrades, true, 'Fix Upgrades',
			'Broken upgrades can now be unlocked normally.', 'Broken upgrades can no longer be unlocked.'),
	fixachiev: new HotfixCookieAction('Fix Achievements', null, [11, 22], '', 'toggle', false, 5000, HotfixCookie.FixAchievements, true, 'Fix Achievements',
			'Broken achievements can now be awarded normally.', 'Broken achievements can no longer be awarded.'),
	fixhcookies: new HotfixCookieAction('Fix H.Cookie Multiplier', null, [20, 7], '', 'toggle', false, 0, HotfixCookie.FixHCookies, true, 'Fix Heavenly Cookies',
			'H.Cookies now add 1% production multipler.', 'H.Cookies now add 10% production multipler.')
};

/*=====================================================================================
LAUNCH HOTFIX COOKIE
=======================================================================================*/

// Launch Hotfix Cookie
HotfixCookie.Init();

