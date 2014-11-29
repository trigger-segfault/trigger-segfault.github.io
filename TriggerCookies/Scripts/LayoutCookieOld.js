/*=====================================================================================
LAYOUT COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/LayoutCookie.js


// Based All function by /u/jakerman999 on Reddit.
// Link: http://www.reddit.com/r/CookieClicker/comments/2gb4gw/i_made_a_bake_all_button/

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'LayoutCookie';
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

/* Returns the element used in Layout Cookie. */
function lLayout(name) {
	if (name.indexOf('LayoutCookie') != 0)
		return l('LayoutCookie' + name);
	return l(name);
}
/* Returns the element with the name used in Layout Cookie. */
function iLayout(name) {
	if (name.indexOf('LayoutCookie') != 0)
		return 'LayoutCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
LAYOUT COOKIE INITIALIZATION
=======================================================================================*/

/* The static class that manages the Layout Cookie mod. */
LayoutCookie = {};
/* True if the mod has been loaded. */
LayoutCookie.Loaded = false;
/* True if the mod is enabled. */
LayoutCookie.Enabled = false;

/*=====================================================================================
LAYOUT COOKIE FUNCTIONS
=======================================================================================*/

/* Initializes Layout Cookie. */
LayoutCookie.Init = function () {
	LoadTriggerCookies();

	IntervalUntilLoaded(function () {
		TriggerCookies.AddMod('Layout Cookie', 'LayoutCookie', [3, 29], LayoutCookie.Enable, LayoutCookie.Disable, LayoutCookie.Load, LayoutCookie.Save, LayoutCookie.WriteMenu, LayoutCookie.UpdateMenu, true);
		TriggerCookies.AddTab('Functionality', 200);

		LayoutCookie.Loaded = true;
	});
}
/* Loads Layout Cookie. */
LayoutCookie.Enable = function (firstTime) {

	if (firstTime) {
		var button = document.createElement('a');
		button.id = iLayout('popAllWrinklers');
		button.className = 'tc option large wrinkler on';
		button.innerHTML = 'Pop Wrinklers';

		if (Game.touchEvents)
			button.ontouched = LayoutCookie.PopAllWrinklers;
		else
			button.onclick = LayoutCookie.PopAllWrinklers;

		l('cookieAnchor').appendChild(button);

		AddEvent(l('sectionLeft'), 'mouseover', function () {
			if (LayoutCookie.WrinklersExist()) {
				lLayout('popAllWrinklers').style.display = 'inline-block';
			}
		});
		AddEvent(l('sectionLeft'), 'mouseout', function () {
			lLayout('popAllWrinklers').style.display = 'none';
		});

		Game.addClass('disablePopWrinklers');

		Overrides.AppendFunction('Game.Draw', 'LayoutCookie.DrawCookies', false, 'LayoutCookie');

		//LayoutCookie.Actions['removetopbar'].Enabled = true;
		//LayoutCookie.Actions['improvescroll'].Enabled = true;

		//var upgrade = new Game.Upgrade(LayoutCookie.EndSeasonName, '', Game.seasonTriggerBasePrice, [16, 6], function () {
		var upgrade = new Game.Upgrade(LayoutCookie.EndSeasonName, 'Ends the current season.<q>You have the power to start them, now you finally have the power to stop them!</q>', Game.seasonTriggerBasePrice, [16, 6], function () {
			Game.seasonUses += 1;
			Game.seasonT = 0;
			Game.computeSeasonPrices();
			this.basePrice = Game.seasonTriggerBasePrice * Math.pow(2, Game.seasonUses) - 1;
			Game.Lock(this.name);
		});
		upgrade.order = 24000;
		upgrade.basePrice = Game.seasonTriggerBasePrice * Math.pow(2, Game.seasonUses) - 1;;
		//upgrade.order = Game.Upgrades['Festive biscuit'].order - 1;
		//Game.last.season = '';
		Game.last.pool = 'toggle';


		Overrides.AppendFunction('Game.Upgrades["Festive biscuit"].buyFunction', 'LayoutCookie.SeasonBuyFunction', 'this', 'LayoutCookie');
		Overrides.AppendFunction('Game.Upgrades["Lovesick biscuit"].buyFunction', 'LayoutCookie.SeasonBuyFunction', 'this', 'LayoutCookie');
		Overrides.AppendFunction('Game.Upgrades["Bunny biscuit"].buyFunction', 'LayoutCookie.SeasonBuyFunction', 'this', 'LayoutCookie');
		Overrides.AppendFunction('Game.Upgrades["Ghostly biscuit"].buyFunction', 'LayoutCookie.SeasonBuyFunction', 'this', 'LayoutCookie');

		// Use the id for fool's biscuit because the ' messes it up
		Overrides.AppendFunction('Game.UpgradesById[185].buyFunction', 'LayoutCookie.SeasonBuyFunction', 'this', 'LayoutCookie');

		for (var i = 0; i < Game.ObjectsN; i++) {
			Overrides.OverrideFunction('Game.ObjectsById[' + i + '].tooltip', 'LayoutCookie.BCITooltip', 'LayoutCookie');
		}

		Overrides.AppendFunction('Game.RebuildUpgrades', 'LayoutCookie.RebuildUpgrades', null, 'LayoutCookie');
	}


	LayoutCookie.Actions['removetopbar'].Enable(false);
	LayoutCookie.Actions['improvescroll'].Enable(false);
	LayoutCookie.Actions['tickerbackground'].Enable(false);
	LayoutCookie.Actions['bakeall'].Enable(false);
	LayoutCookie.Actions['popwrinklers'].Enable(false);
	LayoutCookie.Actions['buildingprice'].Enable(false);

	LayoutCookie.Enabled = true;
}
/* Unloads Layout Cookie. */
LayoutCookie.Disable = function () {

	LayoutCookie.Actions['removetopbar'].Disable(false);
	LayoutCookie.Actions['improvescroll'].Disable(false);
	LayoutCookie.Actions['tickerbackground'].Disable(false);
	LayoutCookie.Actions['bakeall'].Disable(false);
	LayoutCookie.Actions['popwrinklers'].Disable(false);
	// Just to let you know the mod is unloaded.
	//LayoutCookie.Notify('Mod Unloaded', '<div class="title" style="font-size:18px;">' + 'Layout Cookie'.fontcolor('red') + '</div>', [3, 29]);

	LayoutCookie.Enabled = false;
}
/* Loads the mod settings. */
LayoutCookie.Load = function (data) {
	function isValid(varname, name, value) { return (name == varname && !isNaN(value)); }
	function readAction(action, name, value) {
		if (action == name) {
			if (value && !LayoutCookie.Actions[action].Enabled)
				LayoutCookie.Actions[action].Enable(false);
			else if (!value && LayoutCookie.Actions[action].Enabled)
				LayoutCookie.Actions[action].Disable(false);
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
			readAction('buildingprice', name, value);
		}
	}
}
/* Saves the mod settings. */
LayoutCookie.Save = function () {
	function write(name, value) { return name + '=' + value.toString() + '|'; }
	function writeAction(name) { return name + '=' + (LayoutCookie.Actions[name].Enabled ? 1 : 0).toString() + '|'; }
	var str = '';

	str +=
	writeAction('bakeall') +
	writeAction('popwrinklers') +
	writeAction('cancelseason') +

	writeAction('removetopbar') +
	writeAction('improvescroll') +
	writeAction('tickerbackground') +
	writeAction('buildingprice') +

	'';
	return str;
}

LayoutCookie.SeasonBuyFunction = function () {
	if (LayoutCookie.Actions['cancelseason'].Enabled) {
		Game.Unlock(LayoutCookie.EndSeasonName);
		Game.Upgrades[LayoutCookie.EndSeasonName].basePrice = Game.seasonTriggerBasePrice * Math.pow(2, Game.seasonUses) - 1;
	}
}

/*=====================================================================================
LAYOUT COOKIE MENU
=======================================================================================*/
//#region Menu

LayoutCookie.WriteSectionHead = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';

	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';

	return str;
}
LayoutCookie.WriteSectionMiddle = function () {

	var str = '<div style="width: 100%; margin: 12px 0px;"></div>';
	return str;
}
LayoutCookie.WriteSectionEnd = function () {

	var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
	return str;
}
LayoutCookie.WriteSpacing = function (pixels) {
	if (!pixels)
		pixels = 8;
	var str = '<div style="margin-left: ' + pixels.toString() + 'px; display: inline;"></div>';
	return str;
}

/* Writes the Layout Cookie buttons. */
LayoutCookie.WriteMenu = function (tab) {
	var str = '';
	
	if (tab == 'Functionality') {
		str += LayoutCookie.WriteSectionHead('Buttons', [4, 28]);

		str += '<div class="listing">' +
				LayoutCookie.WriteButton('bakeall') +
				LayoutCookie.WriteButton('popwrinklers') +
				LayoutCookie.WriteButton('cancelseason') +
				'</div>';

		str += LayoutCookie.WriteSectionEnd();

		str += LayoutCookie.WriteSectionHead('Layout', [3, 28]);

		str += '<div class="listing">' +
				LayoutCookie.WriteButton('removetopbar') +
				LayoutCookie.WriteButton('improvescroll') +
				LayoutCookie.WriteButton('tickerbackground') +
				LayoutCookie.WriteButton('buildingprice') +
				'</div>';

		str += LayoutCookie.WriteSectionEnd();
	}
	return str;
}
/* Writes the Layout Cookie buttons. */
LayoutCookie.UpdateMenu = function () {
	
}

//#endregion
/*=====================================================================================
LAYOUT COOKIE FUNCTIONS
=======================================================================================*/
//#region Functions

LayoutCookie.BakeAllButton = function () {
	if (LayoutCookie.Actions['bakeall'].Enabled) {
		Overrides.OverrideFunction('Game.BakeHeavenlyCookies', 'LayoutCookie.BakeHeavenlyCookies', 'LayoutCookie');
	}
	else {
		Overrides.RestoreFunction('Game.BakeHeavenlyCookies', 'LayoutCookie');
	}
}
LayoutCookie.PopWrinklersButton = function () {
	if (LayoutCookie.Actions['popwrinklers'].Enabled) {
		Game.removeClass('disablePopWrinklers');
	}
	else {
		Game.addClass('disablePopWrinklers');
	}
}

LayoutCookie.ParseNumber = function (text) {
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
LayoutCookie.BakeHeavenlyCookies = function (amount) {
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
		, [['Bake', 'var n=Math.floor(LayoutCookie.ParseNumber(l(\'valuePrompt\').value.replace(/,/g,\'\')));Game.ClosePrompt();if(!isNaN(n)) Game.BakeHeavenlyCookies(n);'], ['Bake All', 'var n=(Game.heavenlyChips-Game.heavenlyChips%10)/10;Game.ClosePrompt();Game.BakeHeavenlyCookies(n);'], 'Close'], 0, 'widePrompt');
	//['Bake', 'var n=parseInt(l(\'valuePrompt\').value.replace(/,/g,\'\'));Game.ClosePrompt();Game.BakeHeavenlyCookies(n);']
	l('valuePrompt').focus();
}

LayoutCookie.WrinklersExist = function () {
	for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];
		if (me.phase != 0)
			return true;
	}
	return false;
}
LayoutCookie.PopAllWrinklers = function () {
	if (LayoutCookie.Actions['popwrinklers'].Enabled) {
		Game.CollectWrinklers();
		lLayout('popAllWrinklers').style.display = 'none';
	}
}
LayoutCookie.RemoveTopBar = function () {
	if (LayoutCookie.Actions['removetopbar'].Enabled) {

		// Remove the top bar because it's stupid and no one will ever love it.
		/*LayoutCookie.TopBar.parentNode.removeChild(LayoutCookie.TopBar);
		*/

		l('topBar').style.display = 'none';
		var gameDiv = document.getElementById('game');
		gameDiv.style.top = '0px';
		var canvasDiv = document.getElementById('backgroundLeftCanvas');
		canvasDiv.height += 32;
	}
	else {

		// Re-add the top bar because apparently someone actually likes it.
		l('topBar').style.display = 'initial';
		var gameDiv = document.getElementById('game');
		//gameDiv.parentNode.insertBefore(LayoutCookie.TopBar, gameDiv);
		gameDiv.style.top = '32px';
		var canvasDiv = document.getElementById('backgroundLeftCanvas');
		canvasDiv.height -= 32;
	}
}
LayoutCookie.ImproveScrollBars = function () {
	if (LayoutCookie.Actions['improvescroll'].Enabled) {
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

LayoutCookie.CancelSeasonButton = function () {
	if (LayoutCookie.Actions['cancelseason'].Enabled && Game.season != '' && !Game.Upgrades[LayoutCookie.EndSeasonName].unlocked) {
		Game.Unlock(LayoutCookie.EndSeasonName);
	}
	else if (Game.Upgrades[LayoutCookie.EndSeasonName].unlocked) {
		Game.Lock(LayoutCookie.EndSeasonName);
	}
}
LayoutCookie.ChangeTickerBackground = function () {
	if (LayoutCookie.Actions['tickerbackground'].Enabled) {

		l('comments').style.backgroundImage = "url('img/darkNoise.jpg')";
	}
	else {

		l('comments').style.backgroundImage = "none";
	}
}

LayoutCookie.BuildingEfficiency = function () {

	var info = LayoutCookie.Calc.FindBuildingEfficiencies();
	var values = info.values;
	//var colors = ['#6F6', '#FF6', '#F95', '#F55'];
	var colors = ['#6F6', '#FF6', '#FB5', '#F95', '#F55'];
	var colorNone = '#AAB';

	for (var i = 0; i < values.length; i++) {
		var textID = l('productPrice' + i);
		var bci = values[i].bci;
		var bci2 = (values[i].bci - info.bestBCI) / (info.worstBCI - info.bestBCI);

		if (bci2 > 0) {
			if (bci == info.worstBCI)
				valueIndex = colors.length - 1;
			else if (bci2 <= 0.2)
				valueIndex = 1;
			else if (bci2 <= 0.5)
				valueIndex = 2;
			else
				valueIndex = 3;
		}

		textID.style.color = colors[valueIndex];

		Game.ObjectsById[i].bci = bci;
		Game.ObjectsById[i].bciColor = colors[valueIndex];
	}

	LayoutCookie.UpgradeEfficiency();
}
LayoutCookie.UpgradeEfficiency = function () {

	var colors = ['#6F6', '#FF6', '#FB5', '#F95', '#F55'];
	var colorNone = '#AAB';
	var info = LayoutCookie.Calc.FindUpgradeEfficiencies();
	var values = info.values;
	var index = 0;

	for (var i in Game.UpgradesInStore) {
		var uID = l('upgrade' + index);
		var upgrade = Game.UpgradesInStore[i];
		var bci = values[i].bci;
		var bci2 = (values[i].bci - info.bestBCI) / (info.worstBCI - info.bestBCI);

		var valueIndex = 0;
		if (bci2 > 0) {
			if (bci == info.worstBCI)
				valueIndex = colors.length - 1;
			else if (bci2 <= 0.2)
				valueIndex = 1;
			else if (bci2 <= 0.5)
				valueIndex = 2;
			else
				valueIndex = 3;
		}

		upgrade.bci = bci;
		upgrade.bciColor = (!isFinite(bci) ? colorNone : colors[valueIndex]);
		index++;
	}
}

/*LayoutCookie.BCIUpgradeTooltip = function () {
	var me = this;
	var desc = me.desc;
	var name = me.name;
	if (Game.season == 'fools') {
		if (!Game.foolIcons[me.name]) {
			name = Game.foolNames['Unknown'];
			desc = Game.foolDescs['Unknown'];
		}
		else {
			name = Game.foolNames[me.name];
			desc = Game.foolDescs[me.name];
		}
	}
	if (me.locked) {
		name = '???';
		desc = '';
	}
	//if (l('rowInfo'+me.id) && Game.drawT%10==0) l('rowInfoContent'+me.id).innerHTML='&bull; '+me.amount+' '+(me.amount==1?me.single:me.plural)+'<br>&bull; producing '+Beautify(me.storedTotalCps,1)+' '+(me.storedTotalCps==1?'cookie':'cookies')+' per second<br>&bull; total : '+Beautify(me.totalCookies)+' '+(Math.floor(me.totalCookies)==1?'cookie':'cookies')+' '+me.actionName;

	return '<div style="min-width:300px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.price)) + '</span></div><div class="name">' + name + '</div>' + '<small>[owned : ' + me.amount + '</small>]' +
	'<div class="description">' + desc + '</div>' +
	(me.totalCookies > 0 ? (
		'<div class="data">' +
		(LayoutCookie.Actions['buildingprice'].Enabled ? '&bull; ' + ('BCI:'.fontcolor(me.bciColor) + ' <b>' + Beautify(me.bci).fontcolor(me.bciColor) + '</b><br>') : '') +
		(me.amount > 0 ? '&bull; each ' + me.single + ' produces <b>' + Beautify((me.storedTotalCps / me.amount) * Game.globalCpsMult, 1) + '</b> ' + ((me.storedTotalCps / me.amount) * Game.globalCpsMult == 1 ? 'cookie' : 'cookies') + ' per second<br>' : '') +
		'&bull; ' + me.amount + ' ' + (me.amount == 1 ? me.single : me.plural) + ' producing <b>' + Beautify(me.storedTotalCps * Game.globalCpsMult, 1) + '</b> ' + (me.storedTotalCps * Game.globalCpsMult == 1 ? 'cookie' : 'cookies') + ' per second (<b>' + Beautify((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100, 1) + '%</b> of total)<br>' +
		'&bull; <b>' + Beautify(me.totalCookies) + '</b> ' + (Math.floor(me.totalCookies) == 1 ? 'cookie' : 'cookies') + ' ' + me.actionName + ' so far</div>'
	) : '') +
	'</div>';
}*/
LayoutCookie.BCITooltip = function () {
	var me = this;
	var desc = me.desc;
	var name = me.name;
	if (Game.season == 'fools') {
		if (!Game.foolIcons[me.name]) {
			name = Game.foolNames['Unknown'];
			desc = Game.foolDescs['Unknown'];
		}
		else {
			name = Game.foolNames[me.name];
			desc = Game.foolDescs[me.name];
		}
	}
	if (me.locked) {
		name = '???';
		desc = '';
	}
	//if (l('rowInfo'+me.id) && Game.drawT%10==0) l('rowInfoContent'+me.id).innerHTML='&bull; '+me.amount+' '+(me.amount==1?me.single:me.plural)+'<br>&bull; producing '+Beautify(me.storedTotalCps,1)+' '+(me.storedTotalCps==1?'cookie':'cookies')+' per second<br>&bull; total : '+Beautify(me.totalCookies)+' '+(Math.floor(me.totalCookies)==1?'cookie':'cookies')+' '+me.actionName;

	return '<div style="min-width:300px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.price)) + '</span></div><div class="name">' + name + '</div>' + '<small>[owned : ' + me.amount + '</small>]' +
	'<div class="description">' + desc + '</div>' +
	(me.totalCookies > 0 ? (
		'<div class="data">' +
		(LayoutCookie.Actions['buildingprice'].Enabled ? '&bull; ' + ('BCI:'.fontcolor(me.bciColor) + ' <b>' + Beautify(me.bci).fontcolor(me.bciColor) + '</b><br>') : '') +
		(me.amount > 0 ? '&bull; each ' + me.single + ' produces <b>' + Beautify((me.storedTotalCps / me.amount) * Game.globalCpsMult, 1) + '</b> ' + ((me.storedTotalCps / me.amount) * Game.globalCpsMult == 1 ? 'cookie' : 'cookies') + ' per second<br>' : '') +
		'&bull; ' + me.amount + ' ' + (me.amount == 1 ? me.single : me.plural) + ' producing <b>' + Beautify(me.storedTotalCps * Game.globalCpsMult, 1) + '</b> ' + (me.storedTotalCps * Game.globalCpsMult == 1 ? 'cookie' : 'cookies') + ' per second (<b>' + Beautify((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100, 1) + '%</b> of total)<br>' +
		'&bull; <b>' + Beautify(me.totalCookies) + '</b> ' + (Math.floor(me.totalCookies) == 1 ? 'cookie' : 'cookies') + ' ' + me.actionName + ' so far</div>'
	) : '') +
	'</div>';
}

LayoutCookie.BuildingEfficiencyOff = function () {

	for (var i = 0; i < Game.ObjectsN; i++) {
		var textID = l('productPrice' + i);
		var building = Game.ObjectsById[i];

		if (building.getPrice() <= Game.cookies)
			textID.style.color = '#6F6';
		else
			textID.style.color = '#F66';
	}
}

LayoutCookie.DrawCookies = function () {
	//var unit = (Math.round(Game.cookiesd) == 1 ? '<br>cookie' : '<br>cookies');
	var unit = (Math.round(Game.cookiesd) == 1 ? ' cookie' : ' cookies');
	if (Game.cookiesd >= 1000000 && !Game.mobile)
		unit = '<br>cookies';
	var str = Beautify(Math.round(Game.cookiesd));
	var str = str + unit + '<div style="font-size:50%;"' + (Game.cpsSucked > 0 ? ' class="warning"' : '') + '>per second : ' + Beautify(Game.cookiesPs * (1 - Game.cpsSucked), 1) + '</div>';//display cookie amount
	l('cookies').innerHTML = str;
	l('compactCookies').innerHTML = str;
}

LayoutCookie.RebuildUpgrades = function () {
	LayoutCookie.UpgradeEfficiency();

	var index = 0;

	for (var i in Game.UpgradesInStore) {
		var u = l('upgrade' + index);
		var me = Game.UpgradesInStore[i];

		if (LayoutCookie.Actions['buildingprice'].Enabled) {
			var data = document.createElement('div');
			data.className = 'data';

			var str = '&bull; ' + ('BCI:'.fontcolor(me.bciColor) + ' <b>' + Beautify(me.bci).fontcolor(me.bciColor) + '</b><br>');
			u.appendChild(data);
			data.innerHTML = str;
		}

		index++;
	}
}

//#endregion
/*=====================================================================================
LAYOUT-COOKIE CALCULATOR
=======================================================================================*/
//#region Calculator

function PriceCalculator() {

}
PriceCalculator.prototype.EstimatedCPS = function () {
	return Game.cookiesPs * (1 - Game.cpsSucked);
}
PriceCalculator.prototype.CalculateCPSPrice = function (oldCPS, newCPS, price) {
	// Yes, the bonus returned is smaller if it's better
	return price / (newCPS - oldCPS);
}
PriceCalculator.prototype.CalculateBonus = function (building) {
	// Prevent achievements from testing building CPS
	var GameWinBackup = Game.Win;
	Game.Win = function () { };

	var oldCPS = this.EstimatedCPS();

	var price = Math.round(building.price);
	building.amount++; Game.CalculateGains();
	var newCPS = this.EstimatedCPS();
	building.amount--; Game.CalculateGains();
	var time = (price - Game.cookies) / oldCPS;
	var afford = (price <= Game.cookies);

	// Restore achievements function
	Game.Win = GameWinBackup;

	return {
		bonus: this.CalculateCPSPrice(oldCPS, newCPS, price),
		cps: newCPS,
		income: newCPS - oldCPS,
		bci: price / (newCPS - oldCPS),
		price: price,
		time: time,
		afford: afford
	};
}
PriceCalculator.prototype.CalculateUpgradeBonus = function (upgrade) {
	// Prevent achievements from testing building CPS
	var GameWinBackup = Game.Win;
	Game.Win = function () { };

	var oldCPS = this.EstimatedCPS();

	var price = Math.round(upgrade.getPrice());
	upgrade.bought = true; Game.CalculateGains();
	var newCPS = this.EstimatedCPS();
	upgrade.bought = false; Game.CalculateGains();
	var time = (price - Game.cookies) / oldCPS;
	var afford = (price <= Game.cookies);

	// Restore achievements function
	Game.Win = GameWinBackup;

	return {
		bonus: this.CalculateCPSPrice(oldCPS, newCPS, price),
		cps: newCPS,
		income: newCPS - oldCPS,
		bci: price / (newCPS - oldCPS),
		price: price,
		time: time,
		afford: afford
	};
}
PriceCalculator.prototype.FindBuildingEfficiencies = function () {
	var buildingNames = ['Cursor', 'Grandma', 'Farm', 'Mine', 'Factory', 'Bank', 'Temple', 'Wizard tower', 'Shipment', 'Alchemy lab', 'Portal', 'Time machine', 'Antimatter condenser', 'Prism'];

	var buildingBCIs = [];

	for (var i = 0; i < buildingNames.length; i++) {
		buildingBCIs.push(-1);
	}

	// Find the best building to buy for the greatest CPS-to-Price increase
	var bestItem = new BuyoutItem();

	var bestBCI = -1;
	var worstBCI = -1;

	var endIndex = 0;

	for (var i = 0; i < buildingNames.length; i++) {
		var name = buildingNames[i];
		var building = Game.Objects[name];
		var info = this.CalculateBonus(building);

		if (building.locked)
			break;

		endIndex++;
		buildingBCIs[i] = info.bci;

		if (bestBCI == -1 || info.bci < bestBCI) {
			bestBCI = info.bci;
		}
		if (worstBCI == -1 || info.bci > worstBCI) {
			worstBCI = info.bci;
		}
		// If no building has been found yet or its bonus is better than the current best
		if (bestBCI == -1 || info.bci <= bestBonus) {
			bestItem = new BuyoutItem(name, 'building', 1, info.Price, info.time);
			bestBCI = info.bci;
		}
	}

	var values = [];

	for (var i = 0; i < endIndex; i++) {
		var bci = buildingBCIs[i];
		values.push({ bci: bci });
	}

	return { bestBCI: bestBCI, worstBCI: worstBCI, values: values };
}
PriceCalculator.prototype.FindUpgradeEfficiencies = function () {

	var upgradeBCIs = [];

	for (var i = 0; i < buildingNames.length; i++) {
		upgradeBCIs.push(-1);
	}

	// Find the best building to buy for the greatest CPS-to-Price increase
	var bestItem = new BuyoutItem();

	var bestBCI = -1;
	var worstBCI = -1;
	
	for (var i in Game.UpgradesInStore) {
		var upgrade = Game.Upgrades[i];
		var name = upgrade.name;
		var info = this.CalculateUpgradeBonus(upgrade);

		upgradeBCIs[i] = info.bci;

		if (isFinite(info.bci)) {
			if (bestBCI == -1 || info.bci < bestBCI) {
				bestBCI = info.bci;
			}
			if (worstBCI == -1 || info.bci > worstBCI) {
				worstBCI = info.bci;
			}
		}
		// If no building has been found yet or its bonus is better than the current best
		if (bestBCI == -1 || info.bci <= bestBonus) {
			bestItem = new BuyoutItem(name, 'upgrade', 1, info.Price, info.time);
			bestBCI = info.bci;
		}
	}

	var values = [];

	for (var i = 0; i < endIndex; i++) {
		var bci = buildingBCIs[i];
		values.push({ bci: bci });
	}

	return { bestBCI: bestBCI, worstBCI: worstBCI, values: values };
}

//#endregion
/*=====================================================================================
LAYOUT COOKIE ACTION
=======================================================================================*/
//#region Action

/* Writes the action button. */
LayoutCookie.WriteButton = function (name) {
	var action = LayoutCookie.Actions[name];
	var button = iLayout(name + 'Button');

	if (action.Type == 'toggle') {
		var on = action.ButtonName + ' ON'.fontcolor('green');
		var off = action.ButtonName + ' OFF'.fontcolor('red');
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="LayoutCookie.Toggle(\'' + name + '\',\'' + button + '\');">' + (action.Enabled ? on : off) + '</a>';
	}
	else if (action.Type == 'basic') {
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="LayoutCookie.Actions[\'' + name + '\'].Action();">' + action.ButtonName + '</a>';
	}
}
/* Toggles the action button function. */
LayoutCookie.Toggle = function (name, button) {
	LayoutCookie.Actions[name].Action();
	var action = LayoutCookie.Actions[name];
	if (action.Enabled) {
		lLayout(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
		lLayout(button).className = 'option enabled';
	}
	else {
		lLayout(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
		lLayout(button).className = 'option';
	}
}

/* The Layout-Cookie Action object. */
function LayoutCookieAction(name, buttonName, icon, type, enabled, delay, func, offFunc, showNotify, notifyTitle, notifyDescOn, notifyDescOff) {
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
LayoutCookieAction.prototype.Action = function (notify) {
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
LayoutCookieAction.prototype.Enable = function (notify) {
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
LayoutCookieAction.prototype.Disable = function (notify) {
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
LayoutCookie.Actions = {
	bakeall: new LayoutCookieAction('Bake All Button', null, [20, 7], 'toggle', false, 0, LayoutCookie.BakeAllButton, null, true),
	popwrinklers: new LayoutCookieAction('Pop Wrinklers Button', null, [19, 8], 'toggle', false, 0, LayoutCookie.PopWrinklersButton, null, true),
	cancelseason: new LayoutCookieAction('Cancel Season Button', null, [16, 6], 'toggle', false, 0, LayoutCookie.CancelSeasonButton, null, true),
	removetopbar: new LayoutCookieAction('Remove Top Bar', null, [3, 29], 'toggle', false, 0, LayoutCookie.RemoveTopBar, null, true),
	improvescroll: new LayoutCookieAction('Improved Scroll Bars', null, [3, 29], 'toggle', false, 0, LayoutCookie.ImproveScrollBars, null, true),
	tickerbackground: new LayoutCookieAction('News Ticker Background', null, [3, 29], 'toggle', false, 0, LayoutCookie.ChangeTickerBackground, null, true),
	buildingprice: new LayoutCookieAction('Color Building Efficiency', null, [6, 6], 'toggle', false, 300, LayoutCookie.BuildingEfficiency, LayoutCookie.BuildingEfficiencyOff, true)
	
};

/*=====================================================================================
LAYOUT COOKIE VARIABLES
=======================================================================================*/

LayoutCookie.EndSeasonName = 'Parting of seasons';

LayoutCookie.Calc = new PriceCalculator();

/* The saved top bar so it can be re-added. */
LayoutCookie.TopBar = document.getElementById('topBar');

/*=====================================================================================
LAUNCH LAYOUT COOKIE
=======================================================================================*/

LayoutCookie.Init();
