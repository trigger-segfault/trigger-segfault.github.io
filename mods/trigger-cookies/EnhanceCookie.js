/*=====================================================================================
ENHANCE COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-segfault/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-segfault/CookieMods/master/EnhanceCookie.js


// Based All function by /u/jakerman999 on Reddit.
// Link: http://www.reddit.com/r/CookieClicker/comments/2gb4gw/i_made_a_bake_all_button/

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'EnhanceCookie';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace(name + '.js', '');
	return url;
}
/* Returns true if the specified mod is loaded. */
function IsModLoaded(name) {
	return (document.getElementById('modscript_' + name) != null);
}
/* Loads the Trigger Cookies Mod Manager. */
function LoadTriggerCookies() {
	if (!IsModLoaded('TriggerCookies')) {
		Game.LoadMod(GetModURL() + 'TriggerCookies.js');
	}
}
/* Loads the specified Trigger Cookies Mod. */
function LoadMod(name) {
	if (!IsModLoaded(name)) {
		Game.LoadMod(GetModURL() + name + '.js');
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

/* Returns the element used in Enhance Cookie. */
function lEnhance(name) {
	if (name.indexOf('EnhanceCookie') != 0)
		return l('EnhanceCookie' + name);
	return l(name);
}
/* Returns the element with the name used in Enhance Cookie. */
function iEnhance(name) {
	if (name.indexOf('EnhanceCookie') != 0)
		return 'EnhanceCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
ENHANCE COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the Enhance Cookie mod. */
EnhanceCookie = {};
/* True if the mod has been loaded. */
EnhanceCookie.Loaded = false;
/* True if the mod is enabled. */
EnhanceCookie.Enabled = false;

//#endregion
/*=====================================================================================
ENHANCE COOKIE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Enhance Cookie. */
EnhanceCookie.Init = function () {
	LoadTriggerCookies();
	LoadMod('CalcCookie');

	IntervalUntilAllLoaded(['CalcCookie'], function () {
		TriggerCookies.AddMod('Enhance Cookie', 'EnhanceCookie', [4, 28], EnhanceCookie.Enable, EnhanceCookie.Disable, EnhanceCookie.Load, EnhanceCookie.Save, EnhanceCookie.WriteMenu, EnhanceCookie.UpdateMenu, true);
		TriggerCookies.AddTab('Enhancements', 200);

		EnhanceCookie.Loaded = true;
	});
}
/* Loads Enhance Cookie. */
EnhanceCookie.Enable = function (firstTime) {

	if (firstTime) {
		var button = document.createElement('a');
		button.id = iEnhance('popAllWrinklers');
		button.className = 'tc option large wrinkler on';
		button.innerHTML = 'Pop Wrinklers';

		if (Game.touchEvents)
			button.ontouched = EnhanceCookie.PopAllWrinklers;
		else
			button.onclick = EnhanceCookie.PopAllWrinklers;

		l('cookieAnchor').appendChild(button);

		AddEvent(l('sectionLeft'), 'mouseover', function () {
			if (EnhanceCookie.WrinklersExist()) {
				lEnhance('popAllWrinklers').style.display = 'inline-block';
			}
		});
		AddEvent(l('sectionLeft'), 'mouseout', function () {
			lEnhance('popAllWrinklers').style.display = 'none';
		});

		Game.addClass('disablePopWrinklers');

		// Append the function that prevents the cookies from jumping up a line for a split second. (It's really annoying)
		Overrides.AppendFunction('Game.Draw', 'EnhanceCookie.DrawCookies', false, 'EnhanceCookie');

		// Create the Parting of seasons toggle upgrade
		var upgrade = new Game.Upgrade(EnhanceCookie.EndSeasonName, 'Ends the current season.<q>You have the power to start them, now you finally have the power to stop them!</q>', Game.seasonTriggerBasePrice, [16, 6], function () {
			Game.seasonUses += 1;
			Game.seasonT = 0;
			Game.computeSeasonPrices();
			this.basePrice = Game.seasonTriggerBasePrice * Math.pow(2, Game.seasonUses) * 0.9999;
			Game.Lock(this.name);
		});
		upgrade.order = 24000;
		// Set the price to always be season price - 1 so that it's just before seasons
		upgrade.basePrice = Game.seasonTriggerBasePrice * Math.pow(2, Game.seasonUses) * 0.9999;
		Game.last.pool = 'toggle';

		// Append to the season buy functions to unlock the Parting of seasons upgrade
		Overrides.AppendFunction('Game.Upgrades["Festive biscuit"].buyFunction', 'EnhanceCookie.SeasonBuyFunction', 'this', 'EnhanceCookie');
		Overrides.AppendFunction('Game.Upgrades["Lovesick biscuit"].buyFunction', 'EnhanceCookie.SeasonBuyFunction', 'this', 'EnhanceCookie');
		Overrides.AppendFunction('Game.Upgrades["Bunny biscuit"].buyFunction', 'EnhanceCookie.SeasonBuyFunction', 'this', 'EnhanceCookie');
		Overrides.AppendFunction('Game.Upgrades["Ghostly biscuit"].buyFunction', 'EnhanceCookie.SeasonBuyFunction', 'this', 'EnhanceCookie');

		// Use the id for fool's biscuit because the ' messes it up
		Overrides.AppendFunction('Game.UpgradesById[185].buyFunction', 'EnhanceCookie.SeasonBuyFunction', 'this', 'EnhanceCookie');
	}

	// Default Settings
	EnhanceCookie.Actions['removetopbar'].Enable(false);
	EnhanceCookie.Actions['improvescroll'].Enable(false);
	EnhanceCookie.Actions['tickerbackground'].Enable(false);
	EnhanceCookie.Actions['bakeall'].Enable(false);
	EnhanceCookie.Actions['popwrinklers'].Enable(false);

	EnhanceCookie.Actions['buildingbci'].Enable(false);
	EnhanceCookie.Actions['upgradebci'].Enable(false);

	EnhanceCookie.Enabled = true;
}
/* Unloads Enhance Cookie. */
EnhanceCookie.Disable = function () {

	EnhanceCookie.Actions['removetopbar'].Disable(false);
	EnhanceCookie.Actions['improvescroll'].Disable(false);
	EnhanceCookie.Actions['tickerbackground'].Disable(false);
	EnhanceCookie.Actions['bakeall'].Disable(false);
	EnhanceCookie.Actions['popwrinklers'].Disable(false);
	EnhanceCookie.Actions['cancelseason'].Disable(false);

	EnhanceCookie.Actions['buildingbci'].Disable(false);
	EnhanceCookie.Actions['upgradebci'].Disable(false);
	EnhanceCookie.Actions['shortnum'].Disable(false);

	EnhanceCookie.Enabled = false;
}
/* Loads the mod settings. */
EnhanceCookie.Load = function (data) {
	function isValid(varname, name, value) { return (name == varname && !isNaN(value)); }
	function readAction(action, name, value) {
		if (action == name) {
			if (value && !EnhanceCookie.Actions[action].Enabled)
				EnhanceCookie.Actions[action].Enable(false);
			else if (!value && EnhanceCookie.Actions[action].Enabled)
				EnhanceCookie.Actions[action].Disable(false);
		}
	}

	var lines = data.split('|');
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.indexOf('=') != -1) {
			var line = line.split('=');
			var name = line[0], valueStr = line[1], value = parseInt(valueStr), valuef = parseFloat(valueStr);

			readAction('bakeall', name, value);
			readAction('popwrinklers', name, value);
			readAction('cancelseason', name, value);

			readAction('removetopbar', name, value);
			readAction('improvescroll', name, value);
			readAction('tickerbackground', name, value);
			readAction('buildingbci', name, value);
			readAction('upgradebci', name, value);

			readAction('shortnum', name, value);
		}
	}
}
/* Saves the mod settings. */
EnhanceCookie.Save = function () {
	function write(name, value) { return name + '=' + value.toString() + '|'; }
	function writeAction(name) { return name + '=' + (EnhanceCookie.Actions[name].Enabled ? 1 : 0).toString() + '|'; }
	var str = '';

	str +=
	writeAction('bakeall') +
	writeAction('popwrinklers') +
	writeAction('cancelseason') +

	writeAction('removetopbar') +
	writeAction('improvescroll') +
	writeAction('tickerbackground') +
	writeAction('buildingbci') +
	writeAction('upgradebci') +

	writeAction('shortnum') +

	'';
	return str;
}

//#endregion
/*=====================================================================================
LAYOUT COOKIE MENU
=======================================================================================*/
//#region Menu

/* Writes the Enhance Cookie buttons. */
EnhanceCookie.WriteMenu = function (tab) {
	var str = '';
	
	if (tab == 'Enhancements') {
		str += Helper.Menu.WriteSectionHeader('Buttons', [4, 28]);

		str += '<div class="listing">' +
				EnhanceCookie.WriteButton('bakeall') +
				EnhanceCookie.WriteButton('popwrinklers') +
				EnhanceCookie.WriteButton('cancelseason') +
				'</div>';

		str += Helper.Menu.WriteSectionEnd();

		str += Helper.Menu.WriteSectionHeader('Layout', [3, 29]);

		str += '<div class="listing">' +
				EnhanceCookie.WriteButton('removetopbar') +
				EnhanceCookie.WriteButton('improvescroll') +
				EnhanceCookie.WriteButton('tickerbackground') +
				'</div>';

		str += '<div class="listing">' +
				EnhanceCookie.WriteButton('buildingbci') +
				EnhanceCookie.WriteButton('upgradebci') +
				EnhanceCookie.WriteButton('shortnum') +
				'</div>';

		str += Helper.Menu.WriteSectionEnd();
	}
	return str;
}
/* Writes the Enhance Cookie buttons. */
EnhanceCookie.UpdateMenu = function () {
	// Nothing in the menu to update
}

//#endregion
/*=====================================================================================
LAYOUT COOKIE FUNCTIONS
=======================================================================================*/
//#region Functions

EnhanceCookie.SeasonBuyFunction = function () {
	if (EnhanceCookie.Actions['cancelseason'].Enabled) {
		Game.Unlock(EnhanceCookie.EndSeasonName);
		Game.Upgrades[EnhanceCookie.EndSeasonName].basePrice = Game.seasonTriggerBasePrice * Math.pow(2, Game.seasonUses) * 0.9999;
	}
}

EnhanceCookie.BakeAllButton = function () {
	if (EnhanceCookie.Actions['bakeall'].Enabled) {
		Overrides.OverrideFunction('Game.BakeHeavenlyCookies', 'EnhanceCookie.BakeHeavenlyCookies', 'EnhanceCookie');
	}
	else {
		Overrides.RestoreFunction('Game.BakeHeavenlyCookies', 'EnhanceCookie');
	}
}
EnhanceCookie.PopWrinklersButton = function () {
	if (EnhanceCookie.Actions['popwrinklers'].Enabled) {
		Game.removeClass('disablePopWrinklers');
	}
	else {
		Game.addClass('disablePopWrinklers');
	}
}

EnhanceCookie.ParseNumber = function (text) {
	var numNames = [
		' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion',
		' nonillion', ' decillion', ' undecillion', ' duodecillion', ' tredecillion', ' quattuordecillion', ' quindecillion'
	];
	var numNames2 = [' M', ' B', ' T', ' Qa', ' Qi', ' Sx', ' Sp', ' Oc', ' No', ' Dc', ' UnD', ' DoD', ' TrD', ' QaD', ' QiD'];

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
EnhanceCookie.BakeHeavenlyCookies = function (amount) {
	amount = Math.max(amount, 0);
	var notEnough = 0;
	if (amount > 0) {
		if (amount * 10 > Game.heavenlyChips)
			notEnough = 1;
		else
			Game.heavenlyCookies += amount; Game.heavenlyChips -= amount * 10; Game.heavenlyChipsSpent += amount * 10;
	}
	Game.Prompt('<h3>Bake heavenly chips into heavenly cookies</h3>' +
		'<div class="icon" style="pointer-event:none;transform:scale(2);opacity:0.25;position:absolute;right:-8px;bottom:-8px;background-position:' + (-19 * 48) + 'px ' + (-7 * 48) + 'px;"></div>' +
		'<div class="icon" style="pointer-event:none;transform:scale(2);opacity:0.25;position:absolute;left:-8px;top:-8px;background-position:' + (-20 * 48) + 'px ' + (-7 * 48) + 'px;"></div>' +
		((!notEnough && amount > 0) ? ('<div style="text-align:center;margin-bottom:-6px;margin-top:6px;">You bake ' + Beautify(amount) + ' heavenly cookie' + (amount == 0 ? '' : 's') + ', using up ' + Beautify(amount * 10) + ' heavenly chips.</div>') : '') +
		(notEnough ? ('<div style="text-align:center;margin-bottom:-6px;margin-top:6px;" class="warning">You need at least ' + Beautify(amount * 10) + ' heavenly chips to bake ' + Beautify(amount) + ' cookie' + (amount == 0 ? '' : 's') + '!</div>') : '') +
		'<div style="text-align:center;font-size:16px;padding:12px;" class="title">Heavenly cookies : ' + Beautify(Game.heavenlyCookies) + '</div>' +
		'<div class="block"><p>You may bake some of your heavenly chips into <b>heavenly cookies</b>. It takes <b>10 chips</b> to make one cookie, but each cookie will grant you a permanent <b>+1% CpS</b>.</p></div>' +
		'<div class="block" style="text-align:center;"><div style="font-weight:bold;margin-bottom:8px;">How many cookies will you bake?</div><input type="text" id="valuePrompt" style="text-align:center;width:50%;padding:16px 8px;"/></div>'
		, [['Bake', 'var n=Math.floor(EnhanceCookie.ParseNumber(l(\'valuePrompt\').value.replace(/,/g,\'\')));Game.ClosePrompt();if(!isNaN(n)) Game.BakeHeavenlyCookies(n);'], ['Bake All', 'var n=(Game.heavenlyChips-Game.heavenlyChips%10)/10;Game.ClosePrompt();Game.BakeHeavenlyCookies(n);'], 'Close'], 0, 'widePrompt');
	//['Bake', 'var n=parseInt(l(\'valuePrompt\').value.replace(/,/g,\'\'));Game.ClosePrompt();Game.BakeHeavenlyCookies(n);']
	l('valuePrompt').focus();
}

EnhanceCookie.WrinklersExist = function () {
	for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];
		if (me.phase != 0)
			return true;
	}
	return false;
}
EnhanceCookie.PopAllWrinklers = function () {
	if (EnhanceCookie.Actions['popwrinklers'].Enabled) {
		Game.CollectWrinklers();
		lEnhance('popAllWrinklers').style.display = 'none';
	}
}
EnhanceCookie.RemoveTopBar = function () {
	if (EnhanceCookie.Actions['removetopbar'].Enabled) {

		// Remove the top bar because it's stupid and no one will ever love it.
		/*EnhanceCookie.TopBar.parentNode.removeChild(EnhanceCookie.TopBar);
		*/

		l('topBar').style.display = 'none';
		var gameDiv = document.getElementById('game');
		gameDiv.style.top = '0px';
		var canvasDiv = document.getElementById('backgroundLeftCanvas');
		canvasDiv.height += 32;
		var canvasDiv2 = document.getElementById('backgroundCanvas');
		canvasDiv2.height += 32;
	}
	else {

		// Re-add the top bar because apparently someone actually likes it.
		l('topBar').style.display = 'initial';
		var gameDiv = document.getElementById('game');
		//gameDiv.parentNode.insertBefore(EnhanceCookie.TopBar, gameDiv);
		gameDiv.style.top = '32px';
		var canvasDiv = document.getElementById('backgroundLeftCanvas');
		canvasDiv.height -= 32;
		var canvasDiv2 = document.getElementById('backgroundCanvas');
		canvasDiv2.height -= 32;
	}
}
EnhanceCookie.ImproveScrollBars = function () {
	if (EnhanceCookie.Actions['improvescroll'].Enabled) {
		l('sectionMiddle').style.overflow = 'inherit';
		l('menu').style.overflowX = 'hidden';
		l('menu').style.overflowY = 'scroll';

		l('rows').style.overflowX = 'hidden';
		l('rows').style.overflowY = 'scroll';
		l('rows').style.display = 'block';
		l('rows').style.position = 'absolute';
		l('rows').style.left = '16px';
		l('rows').style.right = '0px';
		l('rows').style.top = '112px';
		l('rows').style.bottom = '0px';

		l('modMenu').style.overflowX = 'hidden';
		l('modMenu').style.overflowY = 'scroll';
	}
	else {
		l('sectionMiddle').style.overflowX = 'hidden';
		l('sectionMiddle').style.overflowY = 'scroll';
		l('menu').style.overflow = 'initial';

		l('rows').style.overflow = 'initial';
		l('rows').style.display = 'initial';
		l('rows').style.position = 'initial';
		l('rows').style.left = '0px';
		l('rows').style.right = '0px';
		l('rows').style.top = '0px';
		l('rows').style.bottom = '0px';
		
		l('modMenu').style.overflow = 'initial';
	}
}

EnhanceCookie.CancelSeasonButton = function () {
	if (EnhanceCookie.Actions['cancelseason'].Enabled && Game.season != '' && !Game.Upgrades[EnhanceCookie.EndSeasonName].unlocked) {
		Game.Unlock(EnhanceCookie.EndSeasonName);
	}
	else if (Game.Upgrades[EnhanceCookie.EndSeasonName].unlocked) {
		Game.Lock(EnhanceCookie.EndSeasonName);
	}
}
EnhanceCookie.ChangeTickerBackground = function () {
	if (EnhanceCookie.Actions['tickerbackground'].Enabled) {

		l('comments').style.backgroundImage = "url('img/darkNoise.jpg')";
	}
	else {

		l('comments').style.backgroundImage = "none";
	}
}
EnhanceCookie.BuildingBCI = function () {

	if (EnhanceCookie.Actions['buildingbci'].Enabled)
		CalcCookie.Actions['buildingbci'].Enable();
	else
		CalcCookie.Actions['buildingbci'].Disable();
}
EnhanceCookie.UpgradeBCI = function () {

	if (EnhanceCookie.Actions['upgradebci'].Enabled)
		CalcCookie.Actions['upgradebci'].Enable();
	else
		CalcCookie.Actions['upgradebci'].Disable();
}

EnhanceCookie.DrawCookies = function () {
	//var unit = (Math.round(Game.cookiesd) == 1 ? '<br>cookie' : '<br>cookies');
	var unit = (Math.round(Game.cookiesd) == 1 ? ' cookie' : ' cookies');
	if (Game.cookiesd >= 1000000 && !Game.mobile)
		unit = '<br>cookies';
	var str = Beautify(Math.round(Game.cookiesd));
	var str = str + unit + '<div style="font-size:50%;"' + (Game.cpsSucked > 0 ? ' class="warning"' : '') + '>per second : ' + Beautify(Game.cookiesPs * (1 - Game.cpsSucked), 1) + '</div>';//display cookie amount
	l('cookies').innerHTML = str;
	l('compactCookies').innerHTML = str;
}

EnhanceCookie.ShortNumbers = function () {
	EnhanceCookie.ShortNumbers = EnhanceCookie.Actions['shortnum'].Enabled;
	if (EnhanceCookie.Actions['shortnum'].Enabled)
		Overrides.OverrideFunction('Beautify', 'EnhanceCookie.Beautify', 'EnhanceCookie');
	else
		Overrides.RestoreFunction('Beautify', 'EnhanceCookie');
	BeautifyAll();
	Game.RefreshStore();
	Game.upgradesToRebuild = 1;
}

EnhanceCookie.Beautify = function(value, floats) {
	var negative = (value < 0);
	var decimal = '';
	if (value < 1000000 && floats > 0 && Math.floor(value.toFixed(floats)) != value.toFixed(floats)) decimal = '.' + (value.toFixed(floats).toString()).split('.')[1];
	value = Math.floor(Math.abs(value));
	var formatter = numberFormatters[Game.prefs.format ? 0 : (EnhanceCookie.ShortNumbers ? 2 : 1)];
	var output = formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return negative ? '-' + output : output + decimal;
}

//#endregion
/*=====================================================================================
LAYOUT COOKIE ACTION
=======================================================================================*/
//#region Action

/* Writes the action button. */
EnhanceCookie.WriteButton = function (name) {
	var action = EnhanceCookie.Actions[name];
	var button = iEnhance(name + 'Button');

	if (action.Type == 'toggle') {
		var on = action.ButtonName + ' ON'.fontcolor('green');
		var off = action.ButtonName + ' OFF'.fontcolor('red');
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="EnhanceCookie.Toggle(\'' + name + '\',\'' + button + '\');">' + (action.Enabled ? on : off) + '</a>';
	}
	else if (action.Type == 'basic') {
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="EnhanceCookie.Actions[\'' + name + '\'].Action();">' + action.ButtonName + '</a>';
	}
}
/* Toggles the action button function. */
EnhanceCookie.Toggle = function (name, button) {
	EnhanceCookie.Actions[name].Action();
	var action = EnhanceCookie.Actions[name];
	if (action.Enabled) {
		lEnhance(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
		lEnhance(button).className = 'option enabled';
	}
	else {
		lEnhance(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
		lEnhance(button).className = 'option';
	}
}

/* The Enhance-Cookie Action object. */
function EnhanceCookieAction(name, buttonName, icon, type, enabled, delay, func, offFunc, showNotify, notifyTitle, notifyDescOn, notifyDescOff) {
	this.Name = name;
	this.ButtonName = (buttonName == null ? name : buttonName);
	this.Icon = icon;
	this.Type = type;
	this.Enabled = enabled;
	this.Delay = delay;
	this.Func = func;
	this.OffFunc = offFunc;
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
EnhanceCookieAction.prototype.Action = function (notify) {
	if (this.Type == 'toggle') {
		this.Enabled = !this.Enabled;
		if (this.Delay)
			this.ID = this.ID ? clearInterval(this.ID) : setInterval(this.Func, this.Delay);
		else
			this.Func();

		if (!this.Enabled && this.OffFunc != null)
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
EnhanceCookieAction.prototype.Enable = function (notify) {
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
EnhanceCookieAction.prototype.Disable = function (notify) {
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
LAYOUT COOKIE ACTIONS
=======================================================================================*/

/* The list of actions. */
EnhanceCookie.Actions = {
	bakeall: new EnhanceCookieAction('Bake All Button', null, [20, 7], 'toggle', false, 0, EnhanceCookie.BakeAllButton, null, true),
	popwrinklers: new EnhanceCookieAction('Pop Wrinklers Button', null, [19, 8], 'toggle', false, 0, EnhanceCookie.PopWrinklersButton, null, true),
	cancelseason: new EnhanceCookieAction('Cancel Season Button', null, [16, 6], 'toggle', false, 0, EnhanceCookie.CancelSeasonButton, null, true),
	removetopbar: new EnhanceCookieAction('Remove Top Bar', null, [3, 29], 'toggle', false, 0, EnhanceCookie.RemoveTopBar, null, true),
	improvescroll: new EnhanceCookieAction('Improved Scroll Bars', null, [3, 29], 'toggle', false, 0, EnhanceCookie.ImproveScrollBars, null, true),
	tickerbackground: new EnhanceCookieAction('News Ticker Background', null, [3, 29], 'toggle', false, 0, EnhanceCookie.ChangeTickerBackground, null, true),
	buildingbci: new EnhanceCookieAction('Show Building Efficiency', null, [6, 6], 'toggle', false, 0, EnhanceCookie.BuildingBCI, null, true),
	upgradebci: new EnhanceCookieAction('Show Upgrade Efficiency', null, [9, 1], 'toggle', false, 0, EnhanceCookie.UpgradeBCI, null, true),
	shortnum: new EnhanceCookieAction('Short Numbers', null, [1, 10], 'toggle', false, 0, EnhanceCookie.ShortNumbers, null, true)
	
};

/*=====================================================================================
LAYOUT COOKIE VARIABLES
=======================================================================================*/

EnhanceCookie.EndSeasonName = 'Parting of seasons';

EnhanceCookie.ShortNumbers = false;

/*=====================================================================================
LAUNCH LAYOUT COOKIE
=======================================================================================*/

EnhanceCookie.Init();
