/*=====================================================================================
AUTO-COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/StatCookie.js

// Based off "Cookieclicker Bots".
// Link: https://gist.githubusercontent.com/pernatiy/38bc231506b06fd85473/raw/cc.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'StatCookie';
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
/* Returns the element used in Stat Cookie. */
function lStat(name) {
	if (name.indexOf('StatCookie') != 0)
		return l('StatCookie' + name);
	return l(name);
}
/* Returns the element with the name used in Stat Cookie. */
function iStat(name) {
	if (name.indexOf('StatCookie') != 0)
		return 'StatCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
StatCookie = {};
/* The static class that manages Game backups. */
StatCookie.Backup = {};
/* True if the mod has been loaded. */
StatCookie.Loaded = false;
/* True if the mod is enabled. */
StatCookie.Enabled = false;

//#endregion
/*=====================================================================================
AUTO-COOKIE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Stat-Cookie. */
StatCookie.Init = function () {

	LoadMod('TriggerCookies');

	IntervalUntilLoaded('TriggerCookies', function () {
		TriggerCookies.AddMod('Stat Cookie', [0, 7], StatCookie.Enable, StatCookie.Disable, StatCookie.WriteMenu, StatCookie.UpdateMenu, true);

		// Hey guess what!? This is a mod you're using! So why not receive the plugin shadow achievement?
		Game.Win('Third-party');

		StatCookie.Loaded = true;
	});
}

/* Enables Stat-Cookie. */
StatCookie.Enable = function () {


	StatCookie.Enabled = true;
}
/* Disables Stat-Cookie. */
StatCookie.Disable = function () {

	StatCookie.Enabled = false;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE MENU
=======================================================================================*/

/* Writes the Stat-Cookie buttons. */
StatCookie.WriteMenu = function (tab) {

	var str = '';

	if (tab == 'Mod List') {
		
	}
	else if (tab == 'Statistics') {

		str += StatCookie.CookieStats.WriteStats();
		str += StatCookie.PrestigeStats.WriteStats();
		str += StatCookie.SeasonStats.WriteStats();

	}

	return str;
}
StatCookie.UpdateMenu = function () {

	if (TriggerCookies.CurrentTab == 'Mod List') {

	}
	else if (TriggerCookies.CurrentTab == 'Statistics') {

		StatCookie.CookieStats.UpdateStats();
		StatCookie.PrestigeStats.UpdateStats();
		StatCookie.SeasonStats.UpdateStats();

	}
}

/*=====================================================================================
STAT COOKIE BUYOUT ITEM
=======================================================================================*/

function BuyoutItem(name, type, priority, price, time) {
	this.Name = name || '';
	this.Type = type || 'invalid';
	this.Priority = priority || 0;
	this.Price = price || 0;
	this.Time = time || 0;
	this.Afford = price <= Game.cookies;
}

BuyoutItem.prototype.Buy = function () {
	if (this.Type == 'building')
		Game.Objects[this.Name].buy();
	else if (this.Type == 'upgrade')
		Game.Upgrades[this.Name].buy(true);
}

/*=====================================================================================
STAT COOKIE WRITING
=======================================================================================*/


StatCookie.WriteSectionHead = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';

	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';

	return str;
}

StatCookie.WriteSectionMiddle = function () {

	//var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 6px 0px 6px 14px;"></div>';
	var str = '<div style="width: 100%; margin: 12px 0px;"></div>';
	return str;
}
StatCookie.WriteSectionEnd = function () {

	var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
	return str;
}

/*=====================================================================================
STAT COOKIE COOKIES
=======================================================================================*/

function StatCookies() {

	this.BaseCPS = 0;
	this.ClickCPS = 0;
	this.ClicksPerSecond = 0;
	this.TotalCPS = 0;

	this.Clicks = [{ clicks: 0, time: 1 }, { clicks: 0, time: 1 }, { clicks: 0, time: 1 }, { clicks: 0, time: 1 }, { clicks: 0, time: 1 }];
	this.Clicks[0].time = new Date().getTime();
	this.CookieClicksLast = Game.cookieClicks;

	setInterval(this.UpdateClickRate.bind(this), 1000);
}
StatCookies.prototype.WriteStats = function () {
	this.Update();

	var str = ''

	str += StatCookie.WriteSectionHead('Cookies', [3, 5]);

	str +=
	'<div class="listing"><b>Cookies in bank :</b> <div id="' + iStat('cookiesInBank') + '" class="price plain">' + Beautify(Game.cookies) + '</div></div>' +
	'<div class="listing"><b>Cookies baked (this game) :</b> <div id="' + iStat('cookiesThisGame') + '" class="price plain">' + Beautify(Game.cookiesEarned) + '</div></div>' +
	'<div class="listing"><b>Cookies baked (all time) :</b> <div id="' + iStat('cookiesAllTime') + '" class="price plain">' + Beautify(Game.cookiesEarned + Game.cookiesReset) + '</div></div>' +
	'<div class="listing"><b>Cookies forfeited by ascending :</b> <div id="' + iStat('cookiesForfeited') + '" class="price plain">' + Beautify(Game.cookiesReset) + '</div></div>' +

	StatCookie.WriteSectionMiddle() +

	'<div class="listing"><b>Current CPS : </b> <div id="' + iStat('currentCPS') + '" class="price plain"> ' + Beautify(Game.cookiesPs, 1) + ' <small>' +
		'(multiplier : ' + Beautify(Math.round(Game.globalCpsMult * 100), 1) + '%)' +
		(Game.cpsSucked > 0 ? ' <span class="warning">(withered : ' + Beautify(Math.round(Game.cpsSucked * 100), 1) + '%)</span>' : '') +
		'</small></div></div>' +
	'<div class="listing"><b>Base CPS : </b> <div id="' + iStat('baseCPS') + '" class="price plain">' + Beautify(this.BaseCPS) + '</div></div>' +
	'<div class="listing"><b>Click CPS : </b> <div id="' + iStat('clickCPS') + '" class="price plain">' + Beautify(this.ClickCPS) + '</div></div>' +
	'<div class="listing"><b>Total CPS : </b> <div id="' + iStat('totalCPS') + '" class="price plain">' + Beautify(this.TotalCPS) + '</div></div>' +

	StatCookie.WriteSectionMiddle() +

	'<div class="listing"><b>Hand-made cookies : </b> <div id="' + iStat('handMade') + '" class="price plain"> ' + Beautify(Game.handmadeCookies) + '</div></div>' +
	'<div class="listing"><b>Cookies per click : </b> <div id="' + iStat('cookiesPerClick') + '" class="price plain"> ' + Beautify(Game.computedMouseCps, 1) + '</div></div>' +
	'<div class="listing"><b>Cookie clicks : </b> <div id="' + iStat('clicks') + '" class="priceoff">' + Beautify(Game.cookieClicks) + '</div></div>' +
	'<div class="listing"><b>Clicks per second : </b> <div id="' + iStat('clickRate') + '" class="priceoff">' + Beautify(this.ClicksPerSecond) + '</div></div>' +

	'';

	str += StatCookie.WriteSectionEnd();

	return str;
}
StatCookies.prototype.UpdateStats = function () {
	this.Update();

	lStat('cookiesInBank').innerHTML = Beautify(Game.cookies);
	lStat('cookiesThisGame').innerHTML = Beautify(Game.cookiesEarned);
	lStat('cookiesAllTime').innerHTML = Beautify(Game.cookiesEarned + Game.cookiesReset);
	lStat('cookiesForfeited').innerHTML = Beautify(Game.cookiesReset);

	lStat('currentCPS').innerHTML = Beautify(Game.cookiesPs, 1) + ' <small>' +
		'(multiplier : ' + Beautify(Math.round(Game.globalCpsMult * 100), 1) + '%)' +
		(Game.cpsSucked > 0 ? ' <span class="warning">(withered : ' + Beautify(Math.round(Game.cpsSucked * 100), 1) + '%)</span>' : '') +
		'</small>';
	lStat('baseCPS').innerHTML = Beautify(this.BaseCPS);
	lStat('clickCPS').innerHTML = Beautify(this.ClickCPS);
	lStat('totalCPS').innerHTML = Beautify(this.TotalCPS);

	lStat('handMade').innerHTML = Beautify(Game.handmadeCookies);
	lStat('cookiesPerClick').innerHTML = Beautify(Game.computedMouseCps, 1);
	lStat('clicks').innerHTML = Beautify(Game.cookieClicks);
	lStat('clickRate').innerHTML = Beautify(this.ClicksPerSecond);

}
StatCookies.prototype.Update = function () {

	var frenzyMod = (Game.frenzy > 0) ? Game.frenzyPower : 1;

	this.BaseCPS = Game.cookiesPs / frenzyMod;
	this.ClickCPS = this.ClicksPerSecond * Game.computedMouseCps;
	this.TotalCPS = Game.cookiesPs * (1 - Game.cpsSucked) + this.ClickCPS;

}
StatCookies.prototype.UpdateClickRate = function () {
	this.Clicks[0].clicks = Math.max(0, Game.cookieClicks - this.CookieClicksLast);
	this.Clicks[0].time = new Date().getTime() - this.Clicks[0].time;
	var totalClicks = this.Clicks[0].clicks;
	var totalTime = this.Clicks[0].time;
	for (var i = 0; i < this.Clicks.length - 1; i++) {
		totalClicks += this.Clicks[i + 1].clicks;
		totalTime += this.Clicks[i + 1].time;
		this.Clicks[i + 1] = this.Clicks[i];
	}
	this.Clicks[0].time = new Date().getTime();
	//this.ClicksPerSecond = totalClicks / this.Clicks.length;
	this.ClicksPerSecond = totalClicks / totalTime * 1000;

	this.CookieClicksLast = Game.cookieClicks;
}


/*=====================================================================================
STAT COOKIE PRESTIGE
=======================================================================================*/

function StatPrestige() {

	this.AscendNowToGet = 0;

	this.CookiesToNextXChips = 0;

	this.XAmount = 1;

	this.CookiesPerChip = 0;

	this.ChipsPerSecond = 0;
	this.BaseChipsPerSecond = 0;
	this.ClickChipsPerSecond = 0;
	this.TotalChipsPerSecond = 0;
}
StatPrestige.prototype.WriteStats = function () {
	this.Update();

	var str = ''

	str += StatCookie.WriteSectionHead('Prestige', [19, 7]);

	str +=
	'<div class="listing"><b>Heavenly Cookies in bank : </b> <div id="' + iStat('hcookiesBank') + '" class="priceoff">' + Beautify(Game.heavenlyCookies) + '</div></div>' +
	'<div class="listing"><b>Heavenly Chips in bank : </b> <div id="' + iStat('hchipsBank') + '" class="price plain heavenly">' + Beautify(Game.heavenlyChips) + '</div></div>' +
	'<div class="listing"><b>Heavenly Chips earned : </b> <div id="' + iStat('hchipsEarned') + '" class="price plain heavenly">' + Beautify(Game.heavenlyChipsEarned) + '</div></div>' +
	'<div class="listing"><b>Chips earned from ascend : </b> <div id="' + iStat('hchipsAscend') + '" class="price plain heavenly">' + Beautify(this.AscendNowToGet) + '</div></div>' +

	StatCookie.WriteSectionMiddle() +

	'<div class="listing"><b>Current chips per second : </b> <div id="' + iStat('currentHCPS') + '" class="price plain heavenly">' + Beautify(this.ChipsPerSecond) + '</div></div>' +
	'<div class="listing"><b>Base chips per second : </b> <div id="' + iStat('baseHCPS') + '" class="price plain heavenly">' + Beautify(this.BaseChipsPerSecond) + '</div></div>' +
	'<div class="listing"><b>Click chips per second : </b> <div id="' + iStat('clickHCPS') + '" class="price plain heavenly">' + Beautify(this.ClickChipsPerSecond) + '</div></div>' +
	'<div class="listing"><b>Total chips per second : </b> <div id="' + iStat('totalHCPS') + '" class="price plain heavenly">' + Beautify(this.TotalChipsPerSecond) + '</div></div>' +

	StatCookie.WriteSectionMiddle() +

	'<div class="listing"><b id="' + iStat('hchipNextXAmount') + '">Cookies to next ' + Beautify(this.XAmount) + ' chip' + (this.XAmount != 1 ? 's' : '') + ' : </b> <div id="' + iStat('hchipNextCookies') + '" class="price plain">' + Beautify(this.CookiesToNextXChips) + '</div></div>' +
	'<div class="listing"><b>Cookies per chip : </b> <div id="' + iStat('cookiesPerHChip') + '" class="price plain">' + Beautify(this.CookiesPerChip) + '</div></div>' +

	'';

	str += StatCookie.WriteSectionEnd();

	return str;
}
StatPrestige.prototype.UpdateStats = function () {
	this.Update();

	lStat('hcookiesBank').innerHTML = Beautify(Game.heavenlyCookies);
	lStat('hchipsBank').innerHTML = Beautify(Game.heavenlyChips);
	lStat('hchipsEarned').innerHTML = Beautify(Game.heavenlyChipsEarned);
	lStat('hchipsAscend').innerHTML = Beautify(this.AscendNowToGet);

	lStat('currentHCPS').innerHTML = Beautify(this.ChipsPerSecond);
	lStat('baseHCPS').innerHTML = Beautify(this.BaseChipsPerSecond);
	lStat('clickHCPS').innerHTML = Beautify(this.ClickChipsPerSecond);
	lStat('totalHCPS').innerHTML = Beautify(this.TotalChipsPerSecond);

	lStat('hchipNextXAmount').innerHTML = 'Cookies to next ' + Beautify(this.XAmount) + ' chip' + (this.XAmount != 1 ? 's' : '') + ' : ';
	lStat('hchipNextCookies').innerHTML = Beautify(this.CookiesToNextXChips);
	lStat('cookiesPerHChip').innerHTML = Beautify(this.CookiesPerChip);

}
StatPrestige.prototype.Update = function () {

	this.AscendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));

	var totalChips = Game.heavenlyChipsEarned + this.AscendNowToGet;
	var chipXDigits = Math.max(0, Math.floor(Math.log(this.AscendNowToGet) / Math.log(10)) - 3);

	this.CookiesPerChip = Game.HowManyCookiesReset(totalChips + 1) - Game.HowManyCookiesReset(totalChips);

	this.XAmount = Math.pow(10, chipXDigits);


	var chipsNext = Game.heavenlyChipsEarned + (this.AscendNowToGet + this.XAmount) - (this.AscendNowToGet + this.XAmount) % this.XAmount;
	this.CookiesToNextXChips = Game.HowManyCookiesReset(chipsNext) - (Game.cookiesReset + Game.cookiesEarned);

	this.ChipsPerSecond = Game.cookiesPs / this.CookiesPerChip;
	this.BaseChipsPerSecond = StatCookie.CookieStats.BaseCPS / this.CookiesPerChip;
	this.ClickChipsPerSecond = StatCookie.CookieStats.ClickCPS / this.CookiesPerChip;
	this.TotalChipsPerSecond = StatCookie.CookieStats.TotalCPS / this.CookiesPerChip;

}
StatPrestige.prototype.UpdateClickRate = function () {
	this.Clicks[0] = Math.max(0, Game.cookieClicks - this.CookieClicksLast);

	var totalClicks = this.Clicks[0];
	for (var i = 0; i < this.Clicks.length - 1; i++) {
		totalClicks += this.Clicks[i + 1];
		this.Clicks[i + 1] = this.Clicks[i];
	}
	this.ClicksPerSecond = totalClicks / this.Clicks.length;

	this.CookieClicksLast = Game.cookieClicks;
}

/*=====================================================================================
STAT COOKIE SEASONS
=======================================================================================*/

function StatSeasons() {
	this.SantaLevel = 0;
	this.SantaDrops = 0;
	this.ChristmasCookies = 0;
	this.SpookyCookies = 0
	this.HeartCookies = 0;
	this.EasterEggs = 0;
	this.RareEggs = 0;

	this.Lists = {};
	this.Lists.SantaLevels = ['Festive test tube', 'Festive ornament', 'Festive wreath', 'Festive tree', 'Festive present', 'Festive elf fetus', 'Elf toddler', 'Elfling', 'Young elf', 'Bulky elf', 'Nick', 'Santa Claus', 'Elder Santa', 'True Santa', 'Final Claus'];
	this.Lists.SantaDrops = ['A festive hat', 'Increased merriness', 'Improved jolliness', 'A lump of coal', 'An itchy sweater', 'Reindeer baking grounds', 'Weighted sleighs', 'Ho ho ho-flavored frosting', 'Season savings', 'Toy workshop', 'Naughty list', 'Santa\'s bottomless bag', 'Santa\'s helpers', 'Santa\'s legacy', 'Santa\'s milk and cookies'];
	this.Lists.ChristmasCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
	this.Lists.SpookyCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
	this.Lists.HeartCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];
	this.Lists.EasterEggs = ['Chicken egg', 'Duck egg', 'Turkey egg', 'Quail egg', 'Robin egg', 'Ostrich egg', 'Cassowary egg', 'Salmon roe', 'Frogspawn', 'Shark egg', 'Turtle egg', 'Ant larva', 'Golden goose egg', 'Faberge egg', 'Wrinklerspawn', 'Cookie egg', 'Omelette', 'Chocolate egg', 'Century egg', '"egg"'];
	this.Lists.RareEggs = ['Golden goose egg', 'Faberge egg', 'Wrinklerspawn', 'Cookie egg', 'Omelette', 'Chocolate egg', 'Century egg', '"egg"'];
}
StatSeasons.prototype.WriteStats = function () {
	this.Update();

	var str = ''

	str += StatCookie.WriteSectionHead('Season Progress', [16, 6]);

	str +=
	// Christmas
	'<div class="listing"><b>Santa Level : </b> <div id="' + iStat('santaLevel') + '" class="priceoff">' + Beautify(this.SantaLevel) + '/' + Beautify(15) + (this.SantaLevel > 0 ? ' ' + this.Lists.SantaLevels[this.SantaLevel - 1] : '') + '</div></div>' +
	'<div class="listing"><b>Santa Drops : </b> <div id="' + iStat('santaDrops') + '" class="priceoff">' + Beautify(this.SantaDrops) + '/' + Beautify(this.Lists.SantaDrops.length) + '</div></div>' +
	'<div class="listing"><b>Christmas Cookies : </b> <div id="' + iStat('xmasCookies') + '" class="priceoff">' + Beautify(this.ChristmasCookies) + '/' + Beautify(this.Lists.ChristmasCookies.length) + '</div></div>' +

	// Halloween
	'<div class="listing"><b>Spooky Cookies : </b> <div id="' + iStat('spookyCookies') + '" class="priceoff">' + Beautify(this.SpookyCookies) + '/' + Beautify(this.Lists.SpookyCookies.length) + '</div></div>' +

	// Valentines Day
	'<div class="listing"><b>Heart Cookies : </b> <div id="' + iStat('heartCookies') + '" class="priceoff">' + Beautify(this.HeartCookies) + '/' + Beautify(this.Lists.HeartCookies.length) + '</div></div>' +

	// Easter
	'<div class="listing"><b>Easter Eggs : </b> <div id="' + iStat('easterEggs') + '" class="priceoff">' + Beautify(this.EasterEggs) + '/' + Beautify(this.Lists.EasterEggs.length) + ' <small>' +
		'(rare eggs : ' + Beautify(this.RareEggs) + '/' + Beautify(this.Lists.RareEggs.length) + ')' + '</small></div></div>' +

	'';

	str += StatCookie.WriteSectionEnd();

	return str;
}
StatSeasons.prototype.UpdateStats = function () {
	this.Update();

	lStat('santaLevel').innerHTML = Beautify(this.SantaLevel) + '/' + Beautify(15) + (this.SantaLevel > 0 ? ' ' + this.Lists.SantaLevels[this.SantaLevel - 1] : '');
	lStat('santaDrops').innerHTML = Beautify(this.SantaDrops) + '/' + Beautify(this.Lists.SantaDrops.length);
	lStat('xmasCookies').innerHTML = Beautify(this.ChristmasCookies) + '/' + Beautify(this.Lists.ChristmasCookies.length);

	lStat('spookyCookies').innerHTML = Beautify(this.SpookyCookies) + '/' + Beautify(this.Lists.SpookyCookies.length);

	lStat('heartCookies').innerHTML = Beautify(this.HeartCookies) + '/' + Beautify(this.Lists.HeartCookies.length);

	lStat('easterEggs').innerHTML = Beautify(this.EasterEggs) + '/' + Beautify(this.Lists.EasterEggs.length) + ' <small>' +
		'(rare eggs : ' + Beautify(this.RareEggs) + '/' + Beautify(this.Lists.RareEggs.length) + ')' + '</small>';

}
StatSeasons.prototype.Update = function () {

	//======== CHRISTMAS ========

	// Check Santa level
	this.SantaLevel = (Game.Has('A festive hat') ? Game.santaLevel + 1 : 0);

	// Check Santa drops
	this.SantaDrops = 0;
	for (var i = 0; i < this.Lists.SantaDrops.length; i++) {
		var name = this.Lists.SantaDrops[i];
		if (Game.Has(name)) this.SantaDrops++;
	}
	// Check Christmas cookies
	this.ChristmasCookies = 0;
	for (var i = 0; i < this.Lists.ChristmasCookies.length; i++) {
		var name = this.Lists.ChristmasCookies[i];
		if (Game.Has(name)) this.ChristmasCookies++;
	}

	//======== HALLOWEEN ========

	// Check spooky cookies
	this.SpookyCookies = 0;
	for (var i = 0; i < this.Lists.SpookyCookies.length; i++) {
		var name = this.Lists.SpookyCookies[i];
		if (Game.Has(name)) this.SpookyCookies++;
	}

	//======== VALENTINES DAY ========

	// Check heart cookies
	this.HeartCookies = 0;
	for (var i = 0; i < this.Lists.HeartCookies.length; i++) {
		var name = this.Lists.HeartCookies[i];
		if (Game.Has(name)) this.HeartCookies++;
	}

	//======== EASTER ========

	// Check easter eggs
	this.EasterEggs = 0;
	for (var i = 0; i < this.Lists.EasterEggs.length; i++) {
		var name = this.Lists.EasterEggs[i];
		if (Game.Has(name)) this.EasterEggs++;
	}
	// Check rare eggs
	this.RareEggs = 0;
	for (var i = 0; i < this.Lists.RareEggs.length; i++) {
		var name = this.Lists.RareEggs[i];
		if (Game.Has(name)) this.RareEggs++;
	}
}

/*=====================================================================================
AUTO-COOKIE VARIABLES
=======================================================================================*/


/* The season cycle manager. */
StatCookie.CookieStats = new StatCookies();
StatCookie.PrestigeStats = new StatPrestige();
/* The season cycle manager. */
StatCookie.SeasonStats = new StatSeasons();





/*=====================================================================================
LAUNCH AUTO-COOKIE
=======================================================================================*/

// Launch Stat-Cookie
StatCookie.Init();

