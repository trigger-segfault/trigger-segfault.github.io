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
	return document.getElementById('modscript_' + name) != null;
}
/* Loads the mod from the same location as this mod if the mod hasn't been loaded yet. */
function LoadMod(name) {
	if (!IsModLoaded(name)) {
		var url = GetModURL() + 'Scripts/' + name + '.js';
		Game.LoadMod(url);
	}
}
/* Loads the style sheet from the same location as this mod. */
function LoadStyleSheet(name) {
	var url = GetModURL() + 'Styles/' + name + '.css';

	var link = document.createElement("link");
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = url;
	link.media = 'all';

	document.head.appendChild(link);
	console.log('Loaded the style sheet ' + url + ', ' + name + '.');
}
/* Returns true if the variable is defined and equals the value. */
function IsDefined(name, value) {
	return eval('(typeof ' + name.split('.')[0] + ' !== \'undefined\') && (typeof ' + name + ' !== \'undefined\') && (' + name + ' === ' + value + ')');
}
/* Creates an interval to wait until the specified mod is loaded */
function IntervalUntilLoaded(mod, func) {
	var checkReady = setInterval(function () {
		if (IsDefined(mod + '.Loaded', 'true')) {
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

	//HotfixCookie.UpgradesEnabled = true;
	//HotfixCookie.AchievementsEnabled = true;
	HotfixCookie.UpgradesEnabled = false;
	HotfixCookie.AchievementsEnabled = false;

	LoadMod('TriggerCookies');

	IntervalUntilLoaded('TriggerCookies', function () {
		TriggerCookies.AddMod("Hotfix Cookie", [10, 22], HotfixCookie.Enable, HotfixCookie.Disable, HotfixCookie.WriteMenu, HotfixCookie.UpateMenu, true);
		TriggerCookies.AddTab('Functionality', 200);

		// Hey guess what!? This is a mod you're using! So why not receive the plugin shadow achievement?
		Game.Win('Third-party');

		HotfixCookie.Loaded = true;
	});
}

/* Loads Hotfix Cookie. */
HotfixCookie.Enable = function () {

	if (HotfixCookie.UpgradesEnabled)
		HotfixCookie.Actions['fixup'].Enable(false);
	if (HotfixCookie.AchievementsEnabled)
		HotfixCookie.Actions['fixachiev'].Enable(false);

	HotfixCookie.Enabled = true;
}
/* Unloads Hotfix Cookie. */
HotfixCookie.Disable = function () {

	HotfixCookie.DisableAll();

	HotfixCookie.Enabled = false;
}

//#endregion
/*=====================================================================================
HOTFIX COOKIE MENU
=======================================================================================*/

HotfixCookie.WriteSectionHead = function (name, icon) {
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
}

/* Writes the Hotfix Cookie buttons. */
HotfixCookie.WriteMenu = function (tab) {
	var str = '';

	if (tab == 'Functionality') {
		str += HotfixCookie.WriteSectionHead('Hotfixes', [10, 22]);
		str += '<div class="listing">' +
			HotfixCookie.WriteButton('fixup') +
			HotfixCookie.WriteButton('fixachiev') +
			'</div>';
		str += HotfixCookie.WriteSectionEnd();
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
	if (Game.Objects['Bank'].amount >= 10)
		Game.Unlock('Acid-proof vault');

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
	fixup: new HotfixCookieAction('Fix Upgrades', null, [9, 22], '', 'toggle', false, 5000, HotfixCookie.FixUpgrades, true, 'Fix Upgrades',
			'Broken upgrades can now be unlocked normally.', 'Broken upgrades can no longer be unlocked.'),
	fixachiev: new HotfixCookieAction('Fix Achievements', null, [11, 22], '', 'toggle', false, 5000, HotfixCookie.FixAchievements, true, 'Fix Achievements',
			'Broken achievements can now be awarded normally.', 'Broken achievements can no longer be awarded.')
};

/*=====================================================================================
LAUNCH HOTFIX COOKIE
=======================================================================================*/

// Launch Hotfix Cookie
HotfixCookie.Init();

