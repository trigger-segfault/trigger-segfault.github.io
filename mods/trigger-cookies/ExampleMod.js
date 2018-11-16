/*=====================================================================================
EXAMPLE MOD
=======================================================================================*/

// Author:       -
// Written For:  v.1.0501 beta

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of the TriggerCookies Mod. */
function GetTriggerCookiesURL() {
	return 'http://trigger-death.github.io/TriggerCookies/';
}
/* Returns true if the specified mod is loaded. */
function IsModLoaded(name) {
	return document.getElementById('modscript_' + name) != null;
}
/* Loads the mod from the same location as TriggerCookies if the mod hasn't been loaded yet. */
function LoadTriggerCookiesMod(name) {
	if (!IsModLoaded(name)) {
		var url = GetTriggerCookiesURL() + name + '.js';
		Game.LoadMod(url);
	}
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

//-------------------------------------
// USE THESE TO PREVENT NAMING CONFLICTS
// Name them based on your function, again, to prevent naming conflicts.

/* Returns the element used in ExampleMod. */
function lExample(name) {
	if (name.indexOf('ExampleMod') != 0)
		return l('ExampleMod' + name);
	return l(name);
}
/* Returns the element with the name used in ExampleMod. */
function iExample(name) {
	if (name.indexOf('ExampleMod') != 0)
		return 'ExampleMod' + name;
	return name;
}
//-------------------------------------

//#endregion
/*=====================================================================================
EXAMPLE MOD DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
ExampleMod = {};
/* True if the mod has been loaded. */
ExampleMod.Loaded = false;
/* True if the mod is enabled. */
ExampleMod.Enabled = false;

//#endregion
/*=====================================================================================
EXAMPLE MOD INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes ExampleMod. */
ExampleMod.Init = function () {

	// Just in case someone doesn't load it before this mod
	LoadMod('TriggerCookies');

	// This barrier should always be used to make sure TriggerCookies finishes loading
	IntervalUntilLoaded('TriggerCookies', function () {

		// Define the mod and information about it
		// The second name is the save name. Make sure it is a valid file name
		// You can choose to exclude the Load and Save functions and just put null if your mod has no settings
		// The icon used is the x and y indecies of the icons in icons.png
		// http://orteil.dashnet.org/cookieclicker/beta/img/icons.png
		TriggerCookies.AddMod('Example Mod', 'ExampleMod', [16, 5], ExampleMod.Enable, ExampleMod.Disable, ExampleMod.Load, ExampleMod.Save, ExampleMod.WriteMenu, ExampleMod.UpdateMenu, true);

		// Add the tabs that the mod plans on using
		TriggerCookies.AddTab('Example Tab', 1000);
		// (Alternative for loading multiple tabs, I think AddTab is easier)
		//TriggerCookies.AddTabs([ { name: 'Tab 1', priority: 800 }, { name: 'Tab 2', priority: 801 } ]);


		// No need to do this. TriggerCookies.js already handles this
		// Game.Win('Third-party');

		// Let others know this mod is loaded.
		ExampleMod.Loaded = true;
	});
}
/* Enables ExampleMod. */
ExampleMod.Enable = function (firstTime) {

	// NOTE: This is automatically called by TriggerCookies if enabled is passed as true

	if (firstTime) {

		// Do first time setup

	}

	// Only needed by this mod. TriggerCookies has its own enabled setting for mods
	ExampleMod.Enabled = true;
}
/* Disables ExampleMod. */
ExampleMod.Disable = function () {

	// NOTE: Mod disabling isn't properly implemented yet

	// Disable the actions if they're still on. It's common courtesy
	ExampleMod.Actions['toggleSetting'].Disable();
	ExampleMod.Actions['countSetting'].Disable();

	// Only needed by this mod. TriggerCookies has its own enabled setting for mods
	ExampleMod.Enabled = false;
}
/* Loads the mod settings. */
ExampleMod.Load = function (data) {
	function isValid(varname, name, value) { return (name == varname && !isNaN(value)); }
	function readAction(action, name, value) {
		if (action == name) {
			if (value && !ExampleMod.Actions[action].Enabled)
				ExampleMod.Actions[action].Enable(false);
			else if (!value && ExampleMod.Actions[action].Enabled)
				ExampleMod.Actions[action].Disable(false);
		}
	}

	var lines = data.split('|');
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.indexOf('=') != -1) {
			var line = line.split('=');
			var name = line[0], valueStr = line[1], value = parseInt(valueStr), valuef = parseFloat(valueStr + 'f');

			readAction('toggle1', name, value);
			readAction('toggle2', name, value);

			if (isValid('count', name, value))
				ExampleMod.CountNumber = value;
		}
	}
}
/* Saves the mod settings. */
ExampleMod.Save = function () {
	function write(name, value) { return name + '=' + value.toString() + '|'; }
	function writeAction(name) { return name + '=' + (ExampleMod.Actions[name].Enabled ? 1 : 0).toString() + '|'; }

	var str = '';
	str +=
	writeAction('toggle1') +
	writeAction('toggle2') +

	write('count', ExampleMod.CountNumber) +

	'';
	return str;
}

//#endregion
/*=====================================================================================
EXAMPLE MOD MENU
=======================================================================================*/
//#region Menu

//-------------------------------------
// FUNCTIONS FROM TRIGGERCOOKIES.JS
// These are only here for reference
// Keeping the same style as the main mod allows the UI to look nice

// The icon used is the x and y indecies of the icons in icons.png
// http://orteil.dashnet.org/cookieclicker/beta/img/icons.png
TriggerCookies.WriteSectionHead = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';
	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';
	return str;
}
TriggerCookies.WriteSectionMiddle = function () {
	return '<div style="width: 100%; margin: 12px 0px;"></div>';
}
TriggerCookies.WriteSectionEnd = function () {
	return '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
}
TriggerCookies.WriteSpacing = function (pixels) {
	if (!pixels)
		pixels = 8;
	return '<div style="margin-left: ' + pixels.toString() + 'px; display: inline;"></div>';
}
//-------------------------------------

/* Writes the mod menu (Only called once). */
ExampleMod.WriteMenu = function (tab) {
	var str = '';

	if (tab == 'Example Tab') {
		str +=

		// Write the first section
		TriggerCookies.WriteSectionHead('Section 1', [0, 3]) +

		'<div class="listing">' + ExampleMod.WriteButton('toggle1') + '</div>' +
		'<div class="listing"><b>Information : </b> <div id="' + iExample('toggleSetting') + '" class="priceoff">' + 'Toggle state off' + '</div></div>' +

		TriggerCookies.WriteSectionMiddle() +

		'<div class="listing">' +
		ExampleMod.WriteButton('toggle2') + ' ' +
		'<div id="' + iExample('countSetting') + '" class="priceoff">' + Beautify(ExampleMod.CountNumber) + '</div>' +
		'</div>' +

		TriggerCookies.WriteSectionEnd() +


		// Write the second section
		TriggerCookies.WriteSectionHead('Section 2', [1, 3]) +

		'<div class="listing">' + ExampleMod.WriteButton('basic1') + '</div>' +
		
		'<div class="listing">' +
		'Using a text box: ' +
		'<input id="' + iExample('textInput') + '" type="text" value="Hello World!" style="width: 200px; font-size: 14px; background-color: #111; color: #FFF; border: 1px solid #444; padding: 2px;"></input>' +
		TriggerCookies.WriteSpacing() +
		ExampleMod.WriteButton('readtext') +
		'</div>' +

		TriggerCookies.WriteSectionEnd() +

		'';
	}
	else if (tab == 'Mod List') {

		// Add information about the mod here. You really shouldn't put buttons or anything here though.
		// Don't use separators here. They're already added

		str +=
		'<div class="listing"><b>Author : </b> <div class="priceoff">' + 'Example Person' + ' <small>(He\'s a cool guy)</small>' + '</div></div>' +
		'<div class="listing"><div class="priceoff">' + 'Information about the mod goes here.' + '</div></div>' +

		'';
	}

	return str;
}
/* Updates the mod menu. */
ExampleMod.UpdateMenu = function () {
	
	// Don't rewrite the menus when updating like how Cookie Clicker does it.
	// Otherwise, input text boxes, etc would reset.

	lExample('toggleSetting').innerHTML = (ExampleMod.Actions['toggle1'].Enabled ? 'Toggle state on' : 'Toggle state off');
	lExample('countSetting').innerHTML = Beautify(ExampleMod.CountNumber);
}

//#endregion
/*=====================================================================================
EXAMPLE MOD FUNCTIONS
=======================================================================================*/
//#region Functions

// Currently this function doesn't have a home so each script defines it if needed
ExampleMod.ParseNumber = function (text) {
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


ExampleMod.ToggleSetting = function () {
	if (lExample('toggleSetting') != null) {
		lExample('toggleSetting').innerHTML = (ExampleMod.Actions['toggle1'].Enabled ? 'Toggle state on' : 'Toggle state off');
	}
}
ExampleMod.ToggleSettingCount = function () {
	if (lExample('countSetting') != null) {
		ExampleMod.CountNumber++;
		lExample('countSetting').innerHTML = Beautify(ExampleMod.CountNumber);
	}
}
ExampleMod.BasicButton = function () {
	// The notification should be enought to understand it.
}

ExampleMod.ReadText = function () {
	var text = lExample('textInput').value;

	ExampleMod.Actions['readtext'].NotifyDescOn = 'Input text is: "' + text + '".';
}

//#endregion
/*=====================================================================================
EXAMPLE MOD ACTION
=======================================================================================*/
//#region Action

// NOTE: These actions are just an example of how to handle controls in your mod.
// You can do whatever you want, I don't really care. :)

/* Writes the action button. */
ExampleMod.WriteButton = function (name) {
	var action = ExampleMod.Actions[name];
	var button = iExample(name + 'Button');

	if (action.Type == 'toggle') {
		var on = action.ButtonName + ' ON'.fontcolor('green');
		var off = action.ButtonName + ' OFF'.fontcolor('red');
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="ExampleMod.Toggle(\'' + name + '\',\'' + button + '\');">' + (action.Enabled ? on : off) + '</a>';
	}
	else if (action.Type == 'basic') {
		return '<a class="option" id="' + button + '" ' + Game.clickStr + '="ExampleMod.Actions[\'' + name + '\'].Action();">' + action.ButtonName + '</a>';
	}
}
/* Toggles the action button function. */
ExampleMod.Toggle = function (name, button) {
	ExampleMod.Actions[name].Action();
	var action = ExampleMod.Actions[name];
	if (action.Enabled) {
		lExample(button).innerHTML = action.ButtonName + ' ON'.fontcolor('green');
		lExample(button).className = 'option enabled';
	}
	else {
		lExample(button).innerHTML = action.ButtonName + ' OFF'.fontcolor('red');
		lExample(button).className = 'option';
	}
}

/* The ExampleMod Action object. */
function ExampleModAction(name, buttonName, icon, type, enabled, delay, func, offFunc, showNotify, notifyTitle, notifyDescOn, notifyDescOff) {
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
ExampleModAction.prototype.Action = function (notify) {
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
ExampleModAction.prototype.Enable = function (notify) {
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
ExampleModAction.prototype.Disable = function (notify) {
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
EXAMPLE MOD ACTIONS
=======================================================================================*/
//#region Action List

/* The list of actions. */
ExampleMod.Actions = {
	// Instant Toggle Setting
	toggle1: new ExampleModAction('Toggle Setting', null, [16, 5], 'toggle', false, 0, ExampleMod.ToggleSetting, null, true),

	// Toggle Setting with delay (will repeat every [delay] milliseconds)
	toggle2: new ExampleModAction('Toggle Setting w/ Delay', null, [16, 5], 'toggle', false, 1000, ExampleMod.ToggleSettingCount, null, true,
		'Custom Notify Title', 'Custom Notify On Description', 'Custom Notify Off Description'),

	// Basic button
	basic1: new ExampleModAction('Basic Button', null, [16, 5], 'basic', false, 0, ExampleMod.BasicButton, null, true,
		'Basic Button', 'Custom Button Pressed Description'),

	// Reads the text and changes the notification
	readtext: new ExampleModAction('Read Text', null, [16, 5], 'basic', false, 0, ExampleMod.ReadText, null, true)
};

//#endregion
/*=====================================================================================
EXAMPLE MOD VARIABLES
=======================================================================================*/
//#region Variables

ExampleMod.CountNumber = 0;

//#endregion
/*=====================================================================================
LAUNCH EXAMPLE MOD
=======================================================================================*/

// After everything is setup, initialize the mod
ExampleMod.Init();

