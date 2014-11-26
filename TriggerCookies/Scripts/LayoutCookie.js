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

	LoadMod('TriggerCookies');

	IntervalUntilLoaded('TriggerCookies', function () {
		TriggerCookies.AddMod("Layout Cookie", [3, 29], LayoutCookie.Enable, LayoutCookie.Disable, LayoutCookie.WriteMenu, LayoutCookie.UpdateMenu, true);
		TriggerCookies.AddTab('Functionality', 200);

		LayoutCookie.Loaded = true;
	});
}
/* Loads Layout Cookie. */
LayoutCookie.Enable = function () {


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

	Overrides.AppendFunction('Game.Draw', 'LayoutCookie.DrawCookies', 'LayoutCookie');

	//LayoutCookie.Actions['removetopbar'].Enabled = true;
	//LayoutCookie.Actions['improvescroll'].Enabled = true;

	//var upgrade = new Game.Upgrade(LayoutCookie.EndSeasonName, '', Game.seasonTriggerBasePrice, [16, 6], function () {
	var upgrade = new Game.Upgrade(LayoutCookie.EndSeasonName, 'Ends the current season.<q>You have the power to start them, now you finally have the power to stop them!</q>', Game.seasonTriggerBasePrice, [16, 6], function () {
		Game.seasonUses += 1;
		Game.seasonT = 0;
		Game.computeSeasonPrices();
		this.basePrice = Game.seasonTriggerBasePrice * Math.pow(2, Game.seasonUses);
		Game.Lock(this.name);
	});
	//Game.last.season = '';
	Game.last.pool = 'toggle';

	Overrides.OverrideFunction('Game.Upgrades["Festive biscuit"].buyFunction', 'LayoutCookie.StartSeasonBuyFunction', 'LayoutCookie');
	Overrides.OverrideFunction('Game.Upgrades["Lovesick biscuit"].buyFunction', 'LayoutCookie.StartSeasonBuyFunction', 'LayoutCookie');
	Overrides.OverrideFunction('Game.Upgrades["Bunny biscuit"].buyFunction', 'LayoutCookie.StartSeasonBuyFunction', 'LayoutCookie');
	Overrides.OverrideFunction('Game.Upgrades["Ghostly biscuit"].buyFunction', 'LayoutCookie.StartSeasonBuyFunction', 'LayoutCookie');

	// Use the id for fool's biscuit because the ' messes it up
	Overrides.OverrideFunction('Game.UpgradesById[185].buyFunction', 'LayoutCookie.StartSeasonBuyFunction', 'LayoutCookie');


	LayoutCookie.Actions['removetopbar'].Enable(false);
	LayoutCookie.Actions['improvescroll'].Enable(false);
	LayoutCookie.Actions['tickerbackground'].Enable(false);
	LayoutCookie.Actions['bakeall'].Enable(false);
	LayoutCookie.Actions['popwrinklers'].Enable(false);

	LayoutCookie.Enabled = true;
}
/* Unloads Layout Cookie. */
LayoutCookie.Disable = function () {


	// Just to let you know the mod is unloaded.
	//LayoutCookie.Notify('Mod Unloaded', '<div class="title" style="font-size:18px;">' + 'Layout Cookie'.fontcolor('red') + '</div>', [3, 29]);

	LayoutCookie.Enabled = false;
}

LayoutCookie.StartSeasonBuyFunction = function () {
	Game.seasonUses += 1;
	Game.computeSeasonPrices();
	Game.Lock(this.name);
	for (var i in Game.seasons) {
		var me = Game.Upgrades[Game.seasons[i].trigger];
		if (me.name != this.name) Game.Unlock(me.name);
	}
	if (Game.season != '' && Game.season != this.season) {
		var str = Game.seasons[Game.season].over;
		if (Game.prefs.popups) Game.Popup(str);
		else Game.Notify(str, '', Game.seasons[Game.season].triggerUpgrade.icon, 4);
	}
	if (this.season) Game.season = this.season;
	Game.seasonT = Game.fps * 60 * 60 * 24;
	Game.seasonPopup.reset();
	Game.storeToRefresh = 1;
	Game.upgradesToRebuild = 1;
	Game.Objects['Grandma'].redraw();
	var str = Game.seasons[this.season].start;
	if (Game.prefs.popups) Game.Popup(str);
	else Game.Notify(str, '', this.icon, 4);

	if (LayoutCookie.Actions['cancelseason'].Enabled) {
		Game.Unlock(LayoutCookie.EndSeasonName);
	}
}

/*=====================================================================================
LAYOUT COOKIE MENU
=======================================================================================*/

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

/*=====================================================================================
LAYOUT COOKIE FUNCTIONS
=======================================================================================*/

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
		LayoutCookie.TopBar.parentNode.removeChild(LayoutCookie.TopBar);
		var gameDiv = document.getElementById('game');
		gameDiv.style.top = '0px';
		var canvasDiv = document.getElementById('backgroundLeftCanvas');
		canvasDiv.height += 32;
	}
	else {

		// Re-add the top bar because apparently someone actually likes it.
		var gameDiv = document.getElementById('game');
		gameDiv.parentNode.insertBefore(LayoutCookie.TopBar, gameDiv);
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
	var colors = ['#6F6', '#FF6', '#FB5', '#F55'];

	for (var i = 0; i < values.length; i++) {
		var textID = l('productPrice' + i);
		//var efficiency = values[i].bonus;//efficiency;
		var efficiency = values[i].efficiency;
		var valueIndex = 0;
		var bci = values[i].bci;
		var bci2 = (values[i].bci - info.bestBCI) / (info.worstBCI - info.bestBCI);

		if (efficiency > 0) {
			if (efficiency < 0.15)
				valueIndex = 1;
			else if (efficiency < 0.4)
				valueIndex = 2;
			else
				valueIndex = 3;
		}

		valueIndex = 0;
		if (bci2 > 0) {
			if (bci == info.worstBCI)
				valueIndex = 3;
			else if (bci2 <= 0.5)
				valueIndex = 1;
			else if (bci2 > 0.5)
				valueIndex = 2;
		}

		textID.style.color = colors[valueIndex];
		//textID.innerHTML = efficiency.toString();
		//textID.innerHTML = Beautify(values[i].bci);
	}
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
PriceCalculator.prototype.FindBuildingEfficiencies = function () {
	var buildingNames = ['Cursor', 'Grandma', 'Farm', 'Mine', 'Factory', 'Bank', 'Temple', 'Wizard tower', 'Shipment', 'Alchemy lab', 'Portal', 'Time machine', 'Antimatter condenser', 'Prism'];


	var buildingBonuses = [];
	var buildingEfficiencies = [];
	var buildingTimeEfficiencies = [];
	var buildingBCIs = [];

	for (var i = 0; i < buildingNames.length; i++) {
		buildingBonuses.push(-1);
		//buildingEfficiencies.push(-1);
		buildingTimeEfficiencies.push(-1);
		buildingBCIs.push(-1);
	}

	// Find the best building to buy for the greatest CPS-to-Price increase
	var bestItem = new BuyoutItem();
	var bestBonus = -1;

	var best = -1;
	var worst = -1;
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
		buildingBonuses[i] = info.bonus;
		buildingBCIs[i] = info.bci;

		if (best == -1 || info.bonus < best) {
			best = info.bonus;
			bestBCI = info.bci;
		}
		if (worst == -1 || info.bonus > worst) {
			worst = info.bonus;
			worstBCI = info.bci;
		}

		// Always buy a building if none exist yet.
		/*if (building.amount == 0 && bestBonus != 0 && info.afford) {
			bestItem = new BuyoutItem(name, 'building', 1, info.Price, info.time);
			bestBonus = 0;
		}*/

			// If no building has been found yet or its bonus is better than the current best
		if (bestBonus == -1 || info.bonus <= bestBonus) {
			bestItem = new BuyoutItem(name, 'building', 1, info.Price, info.time);
			bestBonus = info.bonus;

			// If you can't afford this building, see if buying other buildings will get you to this one faster
			if (!info.afford) {
				var timeItem = new BuyoutItem();
				var timeBonus = -1;
				var timeIndex = -1;

				// Loop through every building to find the best fit
				for (var j = 0; j < buildingNames.length; j++) {
					var name2 = buildingNames[j];
					var building2 = Game.Objects[name2];
					var info2 = this.CalculateBonus(building2);

					// If this building can be afforded
					if (info2.afford) {
						// Get the new time till the building can be bought if this building is purchased.
						var newTime = (info.price - (Game.cookies - info2.price)) / info2.cps;
						if (newTime < info.time && (timeBonus == -1 || newTime < timeBonus)) {
							timeItem = new BuyoutItem(name2, 'building', 1, info2.Price, info2.time);
							timeBonus = newTime;
							timeIndex = j;
						}
					}
				}

				// If a faster way to this upgrade has been found
				if (timeItem.Type != 'invalid') {
					bestItem = timeItem;
					if (buildingTimeEfficiencies[timeIndex] == -1 || buildingBonuses[buildingTimeEfficiencies[timeIndex]] < info.bonus) {
						buildingTimeEfficiencies[timeIndex] = i;
					}
					// Don't set the bestBonus because the goal is still the main building
				}
			}
		}
	}

	var values = [];

	for (var i = 0; i < endIndex; i++) {
		//var efficiency = ((buildingBonuses[i] - best) / (worst - best));
		var efficiency = ((Math.log(buildingBonuses[i]) / Math.log(10) - Math.log(best) / Math.log(10)) / (Math.log(worst) / Math.log(10) - Math.log(best) / Math.log(10)));
		var bonus = Math.log(buildingBonuses[i]) / Math.log(10) - Math.log(best) / Math.log(10);
		var timeEfficiency = -1;
		var timeBonus = -1;
		var bci = buildingBCIs[i];
		if (buildingTimeEfficiencies[i] != -1) {
			timeEfficiency = ((buildingBonuses[buildingTimeEfficiencies[i]] - best) / (worst - best));
			timeBonus = buildingBonuses[buildingTimeEfficiencies[i]] - best;
		}
		values.push({ efficiency: efficiency, bonus: bonus, timeEfficiency: timeEfficiency, timeBonus: 1.0 / timeBonus, bci: bci });
	}

	return { best: best, worst: worst, bestBCI: bestBCI, worstBCI: worstBCI, values: values };
}
/*PriceCalculator.prototype.FindBestUpgrade = function () {
	var bestItem = new BuyoutItem();
	var bestValue = -1;

	for (var i in Game.Upgrades) {
		var upgrade = Game.Upgrades[i];

		// If this upgrade is unlocked but not bought, not togglable, and the cheapest upgrade.
		if (upgrade.unlocked && !upgrade.bought && upgrade.pool != 'toggle' && (bestValue == -1 || upgrade.getPrice() < bestValue)) {
			bestItem = new BuyoutItem(upgrade.name, 'upgrade', 1, upgrade.getPrice());
			bestValue = upgrade.getPrice();
		}
	}

	return bestItem;
}
PriceCalculator.prototype.FindBestResearch = function () {
	var researchNames = ['Specialized chocolate chips', 'Designer cocoa beans', 'Ritual rolling pins', 'Underworld ovens', 'One mind', 'Exotic nuts', 'Communal brainsweep', 'Arcane sugar', 'Elder Pact'];

	var bestItem = new BuyoutItem();
	var bestValue = -1;

	// Find the next research upgrade to buy
	for (var i = 0; i < researchNames.length; i++) {
		var name = researchNames[i];
		var upgrade = Game.Upgrades[name];

		// If the research is unlocked but not bought yet
		if (upgrade.unlocked && !upgrade.bought && bestValue == -1 && upgrade.getPrice() <= Game.cookies) {
			bestItem = new BuyoutItem(upgrade.name, 'upgrade', 2, upgrade.getPrice());
			bestValue = upgrade.getPrice();
		}
	}

	return bestItem;
}
PriceCalculator.prototype.FindBestSeason = function () {
	return LayoutCookie.Season.FindBest();
}

PriceCalculator.prototype.FindBest = function () {

	var itemList = [];

	if (LayoutCookie.Actions['autoresearch'].Enabled)
		itemList.push(this.FindBestResearch());
	if (LayoutCookie.Actions['autoupgrades'].Enabled)
		itemList.push(this.FindBestUpgrade());
	if (LayoutCookie.Actions['autobuildings'].Enabled)
		itemList.push(this.FindBestBuilding());
	if (LayoutCookie.Actions['autoseason'].Enabled)
		itemList.push(this.FindBestSeason());

	var maxItem = new BuyoutItem();

	for (var i = 0; i < itemList.length; i++) {
		var item = itemList[i];

		if (maxItem.Type == 'invalid') {
			maxItem = item;
		}
		else if (item.Priority > maxItem.Priority && item.Afford) {
			maxItem = item;
		}
		else if (item.Price < maxItem.Price && !maxItem.Afford) {
			maxItem = item;
		}
	}

	LayoutCookie.NextItem = maxItem;

	return maxItem;
}*

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
