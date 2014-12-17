/*=====================================================================================
CALC COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/trigger-death.github.io/tree/master/TriggerCookies/
// Raw File:     http://trigger-death.github.io/TriggerCookies/Scripts/CalcCookies.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

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

/* Returns the element used in this mod. */
function lCalc(name) {
	if (name.indexOf('CalcCookie') != 0)
		return l('CalcCookie' + name);
	return l(name);
}
/* Returns the element with the name used in this mod. */
function iCalc(name) {
	if (name.indexOf('CalcCookie') != 0)
		return 'CalcCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
CALC COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the Bci Cookie mod. */
CalcCookie = {};
/* True if the mod has been loaded. */
CalcCookie.Loaded = false;
/* True if the mod is enabled. */
CalcCookie.Enabled = false;

//#endregion
/*=====================================================================================
CALC COOKIE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Bci Cookie. */
CalcCookie.Init = function () {
	IntervalUntilLoaded(function () {
		// Calc Cookie is a background mod that other mods reference
		// Thus this mod should not be loaded normally or seen
		CalcCookie.Enable(true);

		CalcCookie.Loaded = true;
	});
}
/* Loads Bci Cookie. */
CalcCookie.Enable = function (firstTime) {

	if (firstTime) {
		function AddUpgrade(name, value) { CalcCookie.ValuedUpgrades[name] = value||50; }

		// These upgrades should always be next to buy, lowest price is bought first

		// Golden Cookie Upgrades
		AddUpgrade('Lucky day', 100);
		AddUpgrade('Serendipity', 100);
		AddUpgrade('Get lucky', 100);

		// Research Upgrades
		AddUpgrade('Bingo center/Research facility', 100);
		AddUpgrade('Persistent memory', 50);
		AddUpgrade('Sacrificial rolling pins', 50);
		
		// Easter Upgrades
		AddUpgrade('Golden goose egg', 50);
		AddUpgrade('Faberge egg', 50);
		AddUpgrade('Wrinklerspawn', 50);
		AddUpgrade('Omelette', 50);
		AddUpgrade('Chocolate egg', 0);

		// Christmas Upgrades
		AddUpgrade('A festive hat', 50);
		AddUpgrade('Reindeer baking grounds', 50);
		AddUpgrade('Weighted sleighs', 50);
		AddUpgrade('Ho ho ho-flavored frosting', 50);
		AddUpgrade('Season savings', 50);
		AddUpgrade('Toy workshop', 50);
		AddUpgrade('Santa\'s bottomless bag', 50);
		AddUpgrade('Santa\'s helpers', 50);
		AddUpgrade('Santa\'s milk and cookies', 50);

		// Default Settings
		//CalcCookie.Actions['buildingbci'].Enable(false);
		//CalcCookie.Actions['upgradebci'].Enable(false);
		CalcCookie.Actions['clickrate'].Enable(false);

		// Overwrite building tooltips
		for (var i = 0; i < Game.ObjectsN; i++) {
			Overrides.OverrideFunction('Game.ObjectsById[' + i + '].tooltip', 'CalcCookie.BuildingTooltipBCI', 'CalcCookie');
		}
		// Overwrite store rebuilding
		Overrides.OverrideFunction('Game.RebuildUpgrades', 'CalcCookie.RebuildUpgrades', 'CalcCookie');

		// Rebuild Upgrades
		Game.RebuildUpgrades();
	}


	CalcCookie.Enabled = true;
}

//#endregion
/*=====================================================================================
CALC COOKIE FUNCTIONS
=======================================================================================*/
//#region Functions
//-------------------------------------------------------------------------------------
//#region BCI

/* Updates both building and upgrade visual BCIs. */
CalcCookie.UpdateBCI = function () {
	CalcCookie.UpdateBuildingBCI();
	CalcCookie.UpdateUpgradeBCI();
}
/* Updates both building visual BCIs. */
CalcCookie.UpdateBuildingBCI = function () {
	CalcCookie.Price.FindBuildingBCIs();

	var colors = ['#6F6', '#FF6', '#FB5', '#F95', '#F55', /*Valued color*/'#5FF', /*Invalid color*/'#EEF'];
	var baseInfo = CalcCookie.BuildingBCIs;
	var values = CalcCookie.BuildingBCIs.values;

	for (var i = 0; i < values.length; i++) {
		var priceID = l('productPrice' + i);
		var info = values[i];
		var bci = values[i].bci;
		var bci2 = (values[i].bci - baseInfo.bestBCI) / (baseInfo.worstBCI - baseInfo.bestBCI);

		var colorIndex = 0;
		if (!isFinite(bci) || isNaN(bci)) {
			colorIndex = 6; // Invalid
			bci = NaN;
		}
		else if (bci == baseInfo.bestBCI)
			colorIndex = 0;
		else if (bci == baseInfo.worstBCI)
			colorIndex = 4;
		else if (bci == 0)
			colorIndex = 5; // Valued
		else if (bci2 > 0) {
			if (bci2 <= 0.2)
				colorIndex = 1;
			else if (bci2 <= 0.5)
				colorIndex = 2;
			else
				colorIndex = 3;
		}

		priceID.style.color = colors[colorIndex];

		Game.ObjectsById[i].bci = bci;
		Game.ObjectsById[i].income = info.income;
		Game.ObjectsById[i].timeLeft = info.time;
		Game.ObjectsById[i].bciColor = colors[colorIndex];
	}
}
/* Updates both upgrade visual BCIs. */
CalcCookie.UpdateUpgradeBCI = function () {
	CalcCookie.Price.FindUpgradeBCIs();

	var colors = ['#6F6', '#FF6', '#FB5', '#F95', '#F55', /*Valued color*/'#5FF', /*Invalid color*/'#EEF'];
	var baseInfo = CalcCookie.UpgradeBCIs;
	var values = CalcCookie.UpgradeBCIs.values;

	for (var i in Game.UpgradesInStore) {
		var triangleID = l('upgradeBCI' + i);
		var upgrade = Game.UpgradesInStore[i];
		var info = values[i];
		var bci = values[i].bci;
		var bci2 = (values[i].bci - baseInfo.bestBCI) / (baseInfo.worstBCI - baseInfo.bestBCI);

		var colorIndex = 0;
		if (!isFinite(bci) || isNaN(bci)) {
			colorIndex = 6; // Invalid
			bci = NaN;
			if (info.valued)
				colorIndex = 5; // Valued
		}
		else if (info.valued)
			colorIndex = 5; // Valued
		else if (bci == baseInfo.bestBCI)
			colorIndex = 0;
		else if (bci == baseInfo.worstBCI)
			colorIndex = 4;
		else if (bci == 0)
			colorIndex = 5; // Valued
		else if (bci2 > 0) {
			if (bci2 <= 0.2)
				colorIndex = 1;
			else if (bci2 <= 0.5)
				colorIndex = 2;
			else
				colorIndex = 3;
		}

		upgrade.bci = bci;
		upgrade.bciColor = colors[colorIndex];
		upgrade.income = info.income;
		upgrade.timeLeft = info.time;
		if (triangleID != null)
			triangleID.style.borderColor = colors[colorIndex] + ' transparent transparent';
	}
}

//#endregion
//-------------------------------------------------------------------------------------
//#region Tooltips

/* Sets up the building BCI tooltips. */
CalcCookie.BuildingTooltipBCI = function () {
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

	return '<div style="min-width:300px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.price)) + '</span></div><div class="name">' + name + '</div>' + '<small>[owned : ' + me.amount + '</small>]' +
	'<div class="description">' + desc + '</div>' +
	(CalcCookie.Actions['buildingbci'].Enabled ? 
		'<div class="data" ' + (me.totalCookies > 0 ? 'style="padding-bottom: 0px;"' : '') + '>' +
		('&bull; ' + ('BCI:'.fontcolor(me.bciColor) + ' <b>' + Beautify(me.bci).fontcolor(me.bciColor) + '</b><br>')) +
		('&bull; ' + ('Income:' + ' <b>' + Beautify(me.income) + '</b><br>')) +
		(me.timeLeft > 0 ? '&bull; ' + ('Time Left:' + ' <b>' + Helper.Numbers.GetTime(me.timeLeft * 1000, 4) + '</b><br>') : '') : '') +
	(me.totalCookies > 0 ? (
		'</div><div class="data">' +
		(me.amount > 0 ? '&bull; each ' + me.single + ' produces <b>' + Beautify((me.storedTotalCps / me.amount) * Game.globalCpsMult, 1) + '</b> ' + ((me.storedTotalCps / me.amount) * Game.globalCpsMult == 1 ? 'cookie' : 'cookies') + ' per second<br>' : '') +
		'&bull; ' + me.amount + ' ' + (me.amount == 1 ? me.single : me.plural) + ' producing <b>' + Beautify(me.storedTotalCps * Game.globalCpsMult, 1) + '</b> ' + (me.storedTotalCps * Game.globalCpsMult == 1 ? 'cookie' : 'cookies') + ' per second (<b>' + Beautify((me.amount > 0 ? ((me.storedTotalCps * Game.globalCpsMult) / Game.cookiesPs) : 0) * 100, 1) + '%</b> of total)<br>' +
		'&bull; <b>' + Beautify(me.totalCookies) + '</b> ' + (Math.floor(me.totalCookies) == 1 ? 'cookie' : 'cookies') + ' ' + me.actionName + ' so far</div>'
	) : '') +
	'</div>';
}
/* Sets up the upgrade BCI tooltips. */
CalcCookie.UpgradeTooltipBCI = function () {
	var me = this;
	return '<div style="min-width:200px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.getPrice())) + '</span></div><small>' + (me.pool == 'toggle' ? '[Togglable]' : '[Upgrade]') + '</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div>' +
		'<div class="data">' +
		'&bull; ' + ('BCI:'.fontcolor(me.bciColor) + ' <b>' + ((isFinite(me.bci) && !isNaN(me.bci)) ? Beautify(me.bci) : 'N/A').fontcolor(me.bciColor) + '</b><br>') +
		'&bull; ' + ('Income:' + ' <b>' + ((isFinite(me.income) && !isNaN(me.income)) ? Beautify(me.income) : 'N/A') + '</b><br>') +
		(me.timeLeft > 0 ? ('&bull; ' + ('Time Left:' + ' <b>' + Helper.Numbers.GetTime(me.timeLeft * 1000, 4) + '</b><br>')) : '') +
		'</div></div>';
}
/* Rebuildings the upgrades and sets up the upgrade BCI. */
CalcCookie.RebuildUpgrades = function () {
	Game.upgradesToRebuild = 0;
	var list = [];
	for (var i in Game.Upgrades) {
		var me = Game.Upgrades[i];
		if (!me.bought && me.pool != 'debug' && me.pool != 'prestige' && me.pool != 'prestigeDecor') {
			if (me.unlocked) list.push(me);
		}
	}

	var sortMap = function (a, b) {
		if (a.basePrice > b.basePrice) return 1;
		else if (a.basePrice < b.basePrice) return -1;
		else return 0;
	}
	list.sort(sortMap);

	Game.UpgradesInStore = [];
	for (var i in list) {
		Game.UpgradesInStore.push(list[i]);
	}

	CalcCookie.UpdateUpgradeBCI();

	var storeStr = '';
	var toggleStr = '';
	for (var i in Game.UpgradesInStore) {
		//if (!Game.UpgradesInStore[i]) break;
		var me = Game.UpgradesInStore[i];
		var str = '';
		if (me.pool == 'toggle' || !CalcCookie.Actions['upgradebci'].Enabled) {
			str = '<div class="crate upgrade" ' +
			Game.getTooltip('<div style="min-width:200px;"><div style="float:right;"><span class="price">' + Beautify(Math.round(me.getPrice())) + '</span></div><small>' + (me.pool == 'toggle' ? '[Togglable]' : '[Upgrade]') + '</small><div class="name">' + me.name + '</div><div class="description">' + me.desc + '</div></div>', 'store') + ' ' +
			Game.clickStr + '="Game.UpgradesById[' + me.id + '].buy();" id="upgrade' + i + '" style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48) + 'px ' + (-me.icon[1] * 48) + 'px;">' +
			'</div>';
			if (me.pool == 'toggle') toggleStr += str; else storeStr += str;
		}
		else {
			str = '<div class="crate upgrade" ' + Game.getDynamicTooltip('CalcCookie.UpgradeTooltipBCI.bind(Game.UpgradesById[' + me.id + '])', 'store') + ' ' +
			Game.clickStr + '="Game.UpgradesById[' + me.id + '].buy();" id="upgrade' + i + '" style="' + (me.icon[2] ? 'background-image:url(' + me.icon[2] + ');' : '') + 'background-position:' + (-me.icon[0] * 48) + 'px ' + (-me.icon[1] * 48) + 'px;">' +
			'<div id="upgradeBCI' + i + '" style="width: 0; height: 0; border-style: solid; border-width: 10px 10px 0 0; border-color: ' + me.bciColor + ' transparent transparent"></div>' +
			'</div>';
			storeStr += str;
		}
		//if (me.pool == 'toggle') toggleStr += str; else storeStr += str;
	}
	l('upgrades').innerHTML = storeStr;
	l('toggleUpgrades').innerHTML = toggleStr;
	if (toggleStr == '') l('toggleUpgrades').style.display = 'none'; else l('toggleUpgrades').style.display = 'block';
}
CalcCookie.BuildingBCIOff = function () {

	for (var i = 0; i < Game.ObjectsN; i++) {
		var textID = l('productPrice' + i);
		var building = Game.ObjectsById[i];

		if (building.getPrice() <= Game.cookies)
			textID.style.color = '#6F6';
		else
			textID.style.color = '#F66';
	}
}
CalcCookie.UpgradeBCIOff = function () {

	CalcCookie.RebuildUpgrades();
}

//#endregion
//-------------------------------------------------------------------------------------
//#region Click Rate

/* Gets the click rate of the big cookie. */
CalcCookie.UpdateClickRate = function () {
	CalcCookie.Clicks[0].clicks = Math.max(0, Game.cookieClicks - CalcCookie.CookieClicksLast);
	CalcCookie.Clicks[0].time = new Date().getTime() - CalcCookie.Clicks[0].time;
	var totalClicks = CalcCookie.Clicks[0].clicks;
	var totalTime = CalcCookie.Clicks[0].time;
	for (var i = CalcCookie.Clicks.length - 1; i >= 1; i--) {
		//str += i + ',';
		totalClicks += CalcCookie.Clicks[i].clicks;
		totalTime += CalcCookie.Clicks[i].time;
		CalcCookie.Clicks[i].clicks = CalcCookie.Clicks[i - 1].clicks;
		CalcCookie.Clicks[i].time = CalcCookie.Clicks[i - 1].time;
	}
	CalcCookie.Clicks[0].time = new Date().getTime();
	CalcCookie.ClicksPerSecond = totalClicks / totalTime * 1000;

	CalcCookie.CookieClicksLast = Game.cookieClicks;
}

//#endregion
//-------------------------------------------------------------------------------------
//#endregion
/*=====================================================================================
CALC COOKIE BUYOUT ITEM
=======================================================================================*/
//#region Buyout Item

function BuyoutItem(name, type, priority, price, bci, income, time) {
	this.Name = name || '';
	this.Type = type || 'invalid';
	this.Priority = priority || 0;
	this.Price = price || 0;
	this.BCI = (typeof bci === 'undefined' ? NaN : bci);
	this.Time = time || 0;
}
BuyoutItem.prototype.Buy = function () {
	if (this.Type == 'building')
		Game.Objects[this.Name].buy();
	else if (this.Type == 'upgrade')
		Game.Upgrades[this.Name].buy(true);
}
BuyoutItem.prototype.CanAfford = function () {
	return this.Price <= Game.cookies;
}

//#endregion
/*=====================================================================================
CALC COOKIE SEASONS
=======================================================================================*/
//#region Seasons

function SeasonCalculator() {
	this.Seasons = ['christmas', 'valentines', 'easter', 'halloween', 'fools'];
	this.SeasonTriggers = {
		christmas: 'Festive biscuit',
		valentines: 'Lovesick biscuit',
		easter: 'Bunny biscuit',
		halloween: 'Ghostly biscuit',
		fools: 'Fool\'s biscuit'
	};

	this.NewSeason = '';
	this.BestItem = new BuyoutItem();

	this.CycleComplete = false;
	this.ChristmasComplete = false;
	this.ValentinesComplete = false;
	this.EasterComplete = false;
	this.HalloweenComplete = false;

	this.SantaLevel = 0;
	this.SantaDrops = 0;
	this.ChristmasCookies = 0;
	this.SpookyCookies = 0
	this.HeartCookies = 0;
	this.EasterEggs = 0;
	this.RareEggs = 0;

	this.Lists = {};
	this.Lists.SantaLevels = ['Festive test tube', 'Festive ornament', 'Festive wreath', 'Festive tree', 'Festive present', 'Festive elf fetus', 'Elf toddler', 'Elfling', 'Young elf', 'Bulky elf', 'Nick', 'Santa Claus', 'Elder Santa', 'True Santa', 'Final Claus'];
	this.Lists.SantaDrops = ['A festive hat', 'An itchy sweater', 'Increased merriness', 'Improved jolliness', 'A lump of coal', 'An itchy sweater', 'Reindeer baking grounds', 'Weighted sleighs', 'Ho ho ho-flavored frosting', 'Season savings', 'Toy workshop', 'Naughty list', 'Santa\'s bottomless bag', 'Santa\'s helpers', 'Santa\'s legacy', 'Santa\'s milk and cookies'];
	this.Lists.ChristmasCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
	this.Lists.SpookyCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
	this.Lists.HeartCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];
	this.Lists.EasterEggs = ['Chicken egg', 'Duck egg', 'Turkey egg', 'Quail egg', 'Robin egg', 'Ostrich egg', 'Cassowary egg', 'Salmon roe', 'Frogspawn', 'Shark egg', 'Turtle egg', 'Ant larva', 'Golden goose egg', 'Faberge egg', 'Wrinklerspawn', 'Cookie egg', 'Omelette', 'Chocolate egg', 'Century egg', '"egg"'];
	this.Lists.RareEggs = ['Golden goose egg', 'Faberge egg', 'Wrinklerspawn', 'Cookie egg', 'Omelette', 'Chocolate egg', 'Century egg', '"egg"'];
}
SeasonCalculator.prototype.FindBestUpgrade = function (autoSeason, maintainSeason) {

	this.BestItem = new BuyoutItem();

	if (autoSeason) {
		this.Update();

		// Upgrade the jolly old man so he can deliver to more and more little kiddies
		if (Game.santaLevel < 14) {
			this.UpgradeSanta();
		}

		if (this.NewSeason != '') {
			if (Game.Has('Season switcher')) {
				var name = this.SeasonTriggers[this.NewSeason];
				var info = CalcCookie.Price.CalculateUpgradeBCI(Game.Upgrades[name]);
				this.BestItem = new BuyoutItem(name, 'upgrade', 13, info.price, info.bci, info.income, info.time);
			}
			this.NewSeason = '';
		}
	}

	if (!this.CycleComplete && autoSeason) {
		if (!this.ChristmasComplete && this.BestItem.Priority < 12) {
			// Buy Santa drops
			for (var i = 0; i < this.Lists.SantaDrops.length; i++) {
				var name = this.Lists.SantaDrops[i];

				if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestItem.Price || this.BestItem.Type == 'invalid')) {
					var info = CalcCookie.Price.CalculateUpgradeBCI(Game.Upgrades[name]);
					this.BestItem = new BuyoutItem(name, 'upgrade', 11, info.price, info.bci, info.income, info.time);
				}
			}
			// Buy xmas cookies
			for (var i = 0; i < this.Lists.ChristmasCookies.length; i++) {
				var name = this.Lists.ChristmasCookies[i];

				if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestItem.Price || this.BestItem.Type == 'invalid')) {
					var info = CalcCookie.Price.CalculateUpgradeBCI(Game.Upgrades[name]);
					this.BestItem = new BuyoutItem(name, 'upgrade', 11, info.price, info.bci, info.income, info.time);
				}
			}
		}
		if (!this.ValentinesComplete && this.BestItem.Priority < 12) {
			for (var i = 0; i < this.HeartCookies.length; i++) {
				var name = this.HeartCookies[i];

				if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestItem.Price || this.BestItem.Type == 'invalid')) {
					var info = CalcCookie.Price.CalculateUpgradeBCI(Game.Upgrades[name]);
					this.BestItem = new BuyoutItem(name, 'upgrade', 11, info.price, info.bci, info.income, info.time);
				}
			}
		}
		if (!this.EasterComplete && this.BestItem.Priority < 12) {
			for (var i = 0; i < this.EasterEggs.length; i++) {
				var name = this.EasterEggs[i];

				if (name != 'Chocolate egg' && Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestItem.Price || this.BestItem.Type == 'invalid')) {
					var info = CalcCookie.Price.CalculateUpgradeBCI(Game.Upgrades[name]);
					this.BestItem = new BuyoutItem(name, 'upgrade', 11, info.price, info.bci, info.income, info.time);
				}
			}
		}
		if (!this.HalloweenComplete && this.BestItem.Priority < 12) {
			for (var i = 0; i < this.SpookyCookies.length; i++) {
				var name = this.SpookyCookies[i];

				if (Game.HasUnlocked(name) && !Game.Has(name) && (Game.Upgrades[name].getPrice() < this.BestItem.Price || this.BestItem.Type == 'invalid')) {
					var info = CalcCookie.Price.CalculateUpgradeBCI(Game.Upgrades[name]);
					this.BestItem = new BuyoutItem(name, 'upgrade', 11, info.price, info.bci, info.income, info.time);
				}
			}
		}
	}
	else {
		if (maintainSeason != '' && Game.season != maintainSeason) {
			this.NewSeason = maintainSeason;
			if (Game.Has('Season switcher')) {
				var name = this.SeasonTriggers[this.NewSeason];
				var info = CalcCookie.Price.CalculateUpgradeBCI(Game.Upgrades[name]);
				this.BestItem = new BuyoutItem(name, 'upgrade', 13, info.price, info.bci, info.income, info.time);
			}
			this.NewSeason = '';
		}
	}

	CalcCookie.BestSeasonItem = this.BestItem;
}
SeasonCalculator.prototype.UpgradeSanta = function () {
	if (Game.Has('A festive hat')) {

		// This is the in game code for upgrading santa.
		var moni = Math.pow(Game.santaLevel + 1, Game.santaLevel + 1);
		if (Game.cookies > moni && Game.santaLevel < 14) {
			Game.Spend(moni);
			Game.santaLevel = (Game.santaLevel + 1) % 15;
			if (Game.santaLevel == 14) {
				Game.Unlock('Santa\'s dominion');
				if (Game.prefs.popups)
					Game.Popup('You are granted<br>Santa\'s dominion.');
				else
					Game.Notify('You are granted Santa\'s dominion.', '', Game.Upgrades['Santa\'s dominion'].icon);
			}
			Game.santaTransition = 1;
			var drops = [];
			for (var i in Game.santaDrops) {
				if (!Game.HasUnlocked(Game.santaDrops[i]))
					drops.push(Game.santaDrops[i]);
			}
			var drop = choose(drops);
			if (drop) {
				Game.Unlock(drop);
				if (Game.prefs.popups)
					Game.Popup('You find a present which contains...<br>' + drop + '!');
				else
					Game.Notify('Found a present!', 'You find a present which contains...<br><b>' + drop + '</b>!', Game.Upgrades[drop].icon);
			}

			if (Game.santaLevel >= 6)
				Game.Win('Coming to town');
			if (Game.santaLevel >= 14)
				Game.Win('All hail Santa');
		}
		if (Game.santaTransition > 0) {
			Game.santaTransition++;
			if (Game.santaTransition >= Game.fps / 2) Game.santaTransition = 0;
		}
	}
}
SeasonCalculator.prototype.Update = function () {

	//======== CHRISTMAS ========

	// Check Santa level
	this.SantaLevel = (Game.Has('A festive hat') ? Game.santaLevel + 1 : 0);

	// Check Santa drops
	this.ChristmasComplete = true;
	this.SantaDrops = 0;
	for (var i = 0; i < this.Lists.SantaDrops.length; i++) {
		var name = this.Lists.SantaDrops[i];
		if (Game.Has(name)) this.SantaDrops++;
		else this.ChristmasComplete = false;
	}
	// Check Christmas cookies
	this.ChristmasCookies = 0;
	for (var i = 0; i < this.Lists.ChristmasCookies.length; i++) {
		var name = this.Lists.ChristmasCookies[i];
		if (Game.Has(name)) this.ChristmasCookies++;
		else this.ChristmasComplete = false;
	}

	//======== HALLOWEEN ========

	// Check spooky cookies
	this.HalloweenComplete = true;
	this.SpookyCookies = 0;
	for (var i = 0; i < this.Lists.SpookyCookies.length; i++) {
		var name = this.Lists.SpookyCookies[i];
		if (Game.Has(name)) this.SpookyCookies++;
		else this.HalloweenComplete = false;
	}

	//======== VALENTINES DAY ========

	// Check heart cookies
	this.ValentinesComplete = true;
	this.HeartCookies = 0;
	for (var i = 0; i < this.Lists.HeartCookies.length; i++) {
		var name = this.Lists.HeartCookies[i];
		if (Game.Has(name)) this.HeartCookies++;
		else this.ValentinesComplete = false;
	}

	//======== EASTER ========

	// Check easter eggs
	this.EasterComplete = true;
	this.EasterEggs = 0;
	for (var i = 0; i < this.Lists.EasterEggs.length; i++) {
		var name = this.Lists.EasterEggs[i];
		if (Game.Has(name) || (name == 'Chocolate egg' && Game.HasUnlocked('Chocolate egg'))) this.EasterEggs++;
		else this.EasterComplete = false;
	}
	// Check rare eggs
	this.RareEggs = 0;
	for (var i = 0; i < this.Lists.RareEggs.length; i++) {
		var name = this.Lists.RareEggs[i];
		if (Game.Has(name) || (name == 'Chocolate egg' && Game.HasUnlocked('Chocolate egg'))) this.RareEggs++;
	}

	//======== ALL SEASONS ========

	if (Game.season == 'christmas') {
		if (this.ChristmasComplete) {

			if (!this.ValentinesComplete)
				this.NewSeason = 'valentines';
			else if (!this.EasterComplete)
				this.NewSeason = 'easter';
			else if (!this.HalloweenComplete)
				this.NewSeason = 'halloween';
		}
	}
	else if (Game.season == 'valentines') {
		if (this.ValentinesComplete) {

			if (!this.ChristmasComplete)
				this.NewSeason = 'christmas';
			else if (!this.EasterComplete)
				this.NewSeason = 'easter';
			else if (!this.HalloweenComplete)
				this.NewSeason = 'halloween';
		}
	}
	else if (Game.season == 'easter') {
		if (this.EasterComplete) {

			if (!this.ChristmasComplete)
				this.NewSeason = 'christmas';
			else if (!this.ValentinesComplete)
				this.NewSeason = 'valentines';
			else if (!this.HalloweenComplete)
				this.NewSeason = 'halloween';
		}
	}
	else if (Game.season == 'halloween') {
		if (this.HalloweenComplete) {

			if (!this.ChristmasComplete)
				this.NewSeason = 'christmas';
			else if (!this.ValentinesComplete)
				this.NewSeason = 'valentines';
			else if (!this.EasterComplete)
				this.NewSeason = 'easter';
		}
	}
	else {
		if (!this.ChristmasComplete)
			this.NewSeason = 'christmas';
		else if (!this.ValentinesComplete)
			this.NewSeason = 'valentines';
		else if (!this.EasterComplete)
			this.NewSeason = 'easter';
		else if (!this.HalloweenComplete)
			this.NewSeason = 'halloween';
	}

	if (!Game.Has('Season switcher')) {
		this.NewSeason = '';
	}

	if (this.ChristmasComplete && this.ValentinesComplete && this.EasterComplete && this.HalloweenComplete) {
		this.CycleComplete = true;
	}
}

//#endregion
/*=====================================================================================
CALC COOKIE CALCULATOR
=======================================================================================*/
//#region Calculator

function PriceCalculator() {
	this.Research = {
		'Specialized chocolate chips': 0,
		'Designer cocoa beans': 1,
		'Ritual rolling pins': 2,
		'Underworld ovens': 3,
		'One mind': 4,
		'Exotic nuts': 5,
		'Communal brainsweep': 6,
		'Arcane sugar': 7,
		'Elder Pact': 8
	};
	this.GLevel = 0;
	this.GLevels = { 'One mind': 1, 'Communal brainsweep': 2, 'Elder Pact': 3 };
}
PriceCalculator.prototype.EstimatedCPS = function () {
	return Game.cookiesPs * (1 - Game.cpsSucked) + (CalcCookie.ClicksPerSecond * Game.computedMouseCps);
}
PriceCalculator.prototype.CalculateBuildingBCI = function (building) {
	// Prevent achievements from testing building CPS
	var GameWinBackup = Game.Win;
	Game.Win = function () { };

	var oldCPS = this.EstimatedCPS();

	var price = Math.round(building.getPrice());
	building.amount++; Game.CalculateGains();
	var newCPS = this.EstimatedCPS();
	building.amount--; Game.CalculateGains();

	// Restore achievements function
	Game.Win = GameWinBackup;

	return {
		bci: price / (newCPS - oldCPS),
		income: Math.round(newCPS - oldCPS),
		cps: newCPS,
		price: price,
		afford: (price <= Game.cookies),
		time: ((price <= Game.cookies) ? 0 : (price - Game.cookies) / oldCPS)
	};
}
PriceCalculator.prototype.CalculateUpgradeBCI = function (upgrade) {
	// Prevent achievements from testing building CPS
	var GameWinBackup = Game.Win;
	Game.Win = function () { };

	var oldCPS = this.EstimatedCPS();

	var price = Math.round(upgrade.getPrice());
	upgrade.bought = 1; Game.CalculateGains();
	var newCPS = this.EstimatedCPS();
	upgrade.bought = 0; Game.CalculateGains();

	// Restore achievements function
	Game.Win = GameWinBackup;

	return {
		bci: price / (newCPS - oldCPS),
		income: newCPS - oldCPS,
		cps: newCPS,
		price: price,
		afford: (price <= Game.cookies),
		time: ((price <= Game.cookies) ? 0 : (price - Game.cookies) / oldCPS)
	};
}
PriceCalculator.prototype.FindBuildingBCIs = function (force) {
	var buildingBCIs = [];
	var bestItem = null, bestName = null;
	var timeItem = new BuyoutItem();
	var bestBCI = -1, worstBCI = -1;
	var index = 0, endIndex = 0;

	for (var i in Game.Objects) {
		var building = Game.Objects[i];

		if (building.locked)
			break;
		endIndex++;

		var info = this.CalculateBuildingBCI(building);
		//buildingBCIs.push(info.bci);
		buildingBCIs.push({ bci: info.bci, income: info.income, time: info.time, valued: false });
		if (bestBCI == -1 || info.bci < bestBCI) {
			bestBCI = info.bci;
			bestItem = info;
			bestName = building.name;
		}
		if (worstBCI == -1 || info.bci > worstBCI) {
			worstBCI = info.bci;
		}

		index++;
	}
	if (bestItem != null) {
		bestItem = new BuyoutItem(bestName, 'building', 1, bestItem.price, bestItem.bci, bestItem.income, bestItem.time);

		if (!bestItem.CanAfford()) {
			timeItem	= new BuyoutItem();
			var timeBonus	= -1;

			// Loop through every building to find the best fit
			for (var i in Game.Objects) {
				var building	= Game.Objects[i];
				var info		= this.CalculateBuildingBCI(building);

				if (building.locked)
					continue;

				// If this building can be afforded
				if (info.afford) {
					// Get the new time till the building can be bought if this building is purchased.
					var newTime = (bestItem.Price - (Game.cookies - info.price)) / info.cps;
					if (newTime < bestItem.Time && (timeBonus == -1 || newTime < timeBonus)) {
						timeItem	= new BuyoutItem(building.name, 'building', 1, info.price, bestItem.BCI, info.income, info.time);
						timeBonus	= newTime;
					}
				}
			}
		}
	}
	else {
		bestItem = new BuyoutItem();
	}


	CalcCookie.BuildingBCIs	= { bestItem: bestItem, timeItem: timeItem, bestBCI: bestBCI, worstBCI: worstBCI, values: buildingBCIs };
}
PriceCalculator.prototype.FindUpgradeBCIs = function (force, allowbuildings) {
	var upgradeBCIs = [];
	var bestItem = null, bestName = null;
	var bestNonResearchItem = null, bestNonResearchName = null;
	var timeItem = new BuyoutItem();
	var bestBCI = -1, worstBCI = -1;
	var bestNonResearchBCI = -1;
	var bestValued = false;

	for (var i in Game.UpgradesInStore) {
		var upgrade = Game.UpgradesInStore[i];

		if (upgrade.pool == 'toggle') {
			upgradeBCIs.push(NaN);
			continue;
		}

		var info = this.CalculateUpgradeBCI(upgrade);
		info.valued = false;
		if (upgrade.name in CalcCookie.ValuedUpgrades) {
			//info.bci = 0;
			//upgradeBCIs.push(info.bci);
			upgradeBCIs.push({ bci: info.bci, income: info.income, time: info.time, valued: true });
			//if (info.afford && !bestValued && upgrade.name != 'Chocolate egg') {
			if (Game.cookies * CalcCookie.ValuedUpgrades[upgrade.name] >= info.price && !bestValued && upgrade.name != 'Chocolate egg') {
				info.valued = true;
				bestItem = info;
				bestName = upgrade.name;
				bestValued = true;
			}
			continue;
		}
		//upgradeBCIs.push(info.bci);
		upgradeBCIs.push({ bci: info.bci, income: info.income, time: info.time, valued: false });
		if (isFinite(info.bci) && !isNaN(info.bci)) {
			if ((bestNonResearchBCI == -1 || info.bci * 1.0000001 < bestNonResearchBCI) && !(upgrade.name in this.Research)) {
				bestNonResearchBCI = info.bci;
				if (!bestValued) {
					bestItem = info;
					bestName = upgrade.name;
				}
				bestNonResearchItem = info;
				bestNonResearchName = upgrade.name;
			}
			if (bestBCI == -1 || info.bci * 1.0000001 < bestBCI) {
				bestBCI = info.bci;
			}
			if (worstBCI == -1 || info.bci > worstBCI) {
				worstBCI = info.bci;
			}
		}
	}
	if (bestItem != null) {
		bestItem = new BuyoutItem(bestName, 'upgrade', bestItem.valued ? 4 : 1, bestItem.price, bestItem.bci, bestItem.income, bestItem.time);

		if (!bestItem.CanAfford()) {
			timeItem = new BuyoutItem();
			var timeBonus = -1;

			// Loop through every building to find the best fit
			if (allowbuildings) {
				for (var i in Game.Objects) {
					var building = Game.Objects[i];
					var info = this.CalculateBuildingBCI(building);

					if (building.locked)
						continue;

					// If this building can be afforded
					var newTime = info.time + (bestItem.Price - (info.time > 0 ? 0 : (Game.cookies - info.price))) / info.cps;
					if (newTime < bestItem.Time && (timeBonus == -1 || newTime < timeBonus)) {
						timeItem = new BuyoutItem(building.name, 'building', 1, info.price, bestItem.BCI, info.income, info.time);
						timeBonus = newTime;
					}
				}
			}
			// Check if the real best upgrade will speed things up
			if (bestNonResearchItem != null) {
				//console.log(bestNonResearchName);
				var upgrade = Game.Upgrades[bestNonResearchName];
				var info = bestNonResearchItem;

				// If this building can be afforded
				var newTime = info.time + (bestItem.Price - (info.time > 0 ? 0 : (Game.cookies - info.price))) / info.cps;
				//console.log(timeBonus + ', ' + newTime + ', ' + timeItem.Time);
				if (newTime < bestItem.Time && (timeBonus == -1 || newTime < timeBonus)) {
					timeItem = new BuyoutItem(upgrade.name, 'upgrade', bestItem.Priority, info.price, bestItem.BCI, info.income, info.time);
					timeBonus = newTime;
				}
			}
		}
	}
	else {
		bestItem = new BuyoutItem();
	}

	CalcCookie.UpgradeBCIs = { bestItem: bestItem, timeItem: timeItem, bestBCI: bestBCI, worstBCI: worstBCI, values: upgradeBCIs };
}
PriceCalculator.prototype.FindBestResearch = function (grandmapocalypseLevel) {
	var bestItem = new BuyoutItem();

	for (var i in this.Research) {
		var name = i;
		var upgrade = Game.Upgrades[name];

		if (upgrade.unlocked && !upgrade.bought) {
			//console.log(name);
			if (!(name in this.GLevels) || this.GLevels[name] <= grandmapocalypseLevel) {
				var info = this.CalculateUpgradeBCI(upgrade);
				//console.log(name);
				bestItem = new BuyoutItem(name, 'upgrade', 15, info.price, info.bci, info.income, info.time);
				break;
			}
		}
	}

	CalcCookie.BestResearchItem = bestItem;
}
PriceCalculator.prototype.FindBestItem = function () {
	CalcCookie.Price.FindBuildingBCIs();
	CalcCookie.Price.FindUpgradeBCIs(true, true);

	var bestBuildingGoal = CalcCookie.BuildingBCIs.bestItem;
	var bestBuilding = CalcCookie.BuildingBCIs.bestItem;
	if (CalcCookie.BuildingBCIs.timeItem.Type != 'invalid') {
		bestBuilding = CalcCookie.BuildingBCIs.timeItem;
	}
	var bestUpgradeGoal = CalcCookie.UpgradeBCIs.bestItem;
	var bestUpgrade = CalcCookie.UpgradeBCIs.bestItem;
	if (CalcCookie.UpgradeBCIs.timeItem.Type != 'invalid') {
		bestUpgrade = CalcCookie.UpgradeBCIs.timeItem;
	}

	var bestItemGoal = bestBuildingGoal;
	if (((bestUpgradeGoal.BCI < bestBuildingGoal.BCI && bestUpgradeGoal.Priority == bestBuildingGoal.Priority) || bestUpgradeGoal.Priority > bestBuildingGoal.Priority) && bestUpgradeGoal.Type != 'invalid') {
		bestItemGoal = bestUpgradeGoal;
	}
	var bestItem = bestBuilding;
	//console.log(bestUpgrade.BCI + ', ' + bestBuilding.BCI);
	if (((bestUpgrade.BCI < bestBuilding.BCI && bestUpgrade.Priority == bestBuilding.Priority) || bestUpgrade.Priority > bestBuilding.Priority) && bestUpgrade.Type != 'invalid') {
		bestItem = bestUpgrade;
	}

	CalcCookie.BestOverallGoal = (bestItem.Name != bestItemGoal.Name ? bestItemGoal : new BuyoutItem());
	CalcCookie.BestOverallItem = bestItem;
	/*if (bestItem.Type != 'invalid') {
		if (bestItem.CanAfford()) {
			bestItem.Buy();
			//CalcCookie.Price.FindBuildingBCIs();
			CalcCookie.Price.FindBuildingBCIs();
			CalcCookie.Price.FindUpgradeBCIs();
		}
		else {
			console.log('Cant afford ' + bestItem.Name);
		}
	}*/
}

//#endregion
/*=====================================================================================
CALC COOKIE ACTION
=======================================================================================*/
//#region Action

/* The Bci-Cookie Action object. */
function CalcCookieAction(name, type, delay, func, onFunc, offFunc) {
	this.Name = name;
	this.Type = type;
	this.Enabled = false;
	this.Delay = delay;
	this.Func = func;
	this.OnFunc = onFunc;
	this.OffFunc = offFunc;
	this.ID = 0;
}
/* Calls the action. */
CalcCookieAction.prototype.Action = function (notify) {
	if (this.Type == 'toggle') {
		this.Enabled = !this.Enabled;
		if (this.Delay)
			this.ID = this.ID ? clearInterval(this.ID) : setInterval(this.Func, this.Delay);
		else
			this.Func();
		if (!this.Enabled && this.OffFunc)
			this.OffFunc();
		else if (this.Enabled && this.OnFunc)
			this.OnFunc();
	}
	else if (this.Type == 'basic') {
		this.Func();
	}
}
/* Enables the action. */
CalcCookieAction.prototype.Enable = function (notify) {
	if (this.Type == 'toggle' && !this.Enabled) {
		this.Enabled = true;
		if (this.Delay && !this.ID)
			this.ID = setInterval(this.Func, this.Delay);
		else
			this.Func();
		if (this.OnFunc)
			this.OnFunc();
	}
}
/* Disables the action. */
CalcCookieAction.prototype.Disable = function (notify) {
	if (this.Type == 'toggle' && this.Enabled) {
		this.Enabled = false;
		if (this.Delay && this.ID)
			this.ID = clearInterval(this.ID);
		else
			this.Func();
		if (this.OffFunc)
			this.OffFunc();
	}
}

//#endregion
/*=====================================================================================
CALC COOKIE VARIABLES
=======================================================================================*/

var t = 500;
CalcCookie.Clicks = [{ clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t },
					{ clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t },
					{ clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }];
CalcCookie.Clicks[0].time = new Date().getTime();
CalcCookie.CookieClicksLast = Game.cookieClicks;

CalcCookie.Price = new PriceCalculator();
CalcCookie.Season = new SeasonCalculator();

CalcCookie.ValuedUpgrades = [];

// Important settings

CalcCookie.ClicksPerSecond = 0;
CalcCookie.BuildingBCIs	= { bestItem: new BuyoutItem(), timeItem: new BuyoutItem(), bestBCI: NaN, worstBCI: NaN, values: [] };
CalcCookie.UpgradeBCIs = { bestItem: new BuyoutItem(), timeItem: new BuyoutItem(), bestBCI: NaN, worstBCI: NaN, values: [] };
CalcCookie.BestOverallItem = new BuyoutItem();
CalcCookie.BestOverallGoal = new BuyoutItem();
CalcCookie.BestSeasonItem = new BuyoutItem();
CalcCookie.BestResearchItem = new BuyoutItem();

/*=====================================================================================
CALC COOKIE ACTIONS
=======================================================================================*/

/* The list of actions. */
CalcCookie.Actions = {
	buildingbci: new CalcCookieAction('Building BCI', 'toggle', 300, CalcCookie.UpdateBuildingBCI, CalcCookie.UpdateBuildingBCI, CalcCookie.BuildingBCIOff),
	upgradebci: new CalcCookieAction('Upgrade BCI', 'toggle', 2000, CalcCookie.UpdateUpgradeBCI, CalcCookie.UpgradeBCIOff, CalcCookie.UpgradeBCIOff),

	clickrate: new CalcCookieAction('Update Click Rate', 'toggle', 500, CalcCookie.UpdateClickRate)

};

/*=====================================================================================
LAUNCH CALC COOKIE
=======================================================================================*/

CalcCookie.Init();
