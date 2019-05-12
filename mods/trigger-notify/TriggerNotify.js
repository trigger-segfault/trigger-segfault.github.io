/*=====================================================================================
TRIGGERNOTIFY MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  Ver 1.0.7.1
// Repository:   https://github.com/trigger-segfault/trigger-segfault.github.io/tree/master/mods/trigger-notify

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

function FindModScript() {
	
}

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'TriggerNotify';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace(name + '.js', '');
	return url;
}
/* Loads the style sheet from the same location as this mod. */
function LoadStyleSheet(name) {
	var url = GetModURL() + 'css/' + name + '.css';

	var link = document.createElement("link");
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = url;
	link.media = 'all';

	document.head.appendChild(link);
	console.log('Loaded the style sheet ' + url + ', ' + name + '.');
}

//#endregion
/*=====================================================================================
TRIGGERNOTIFY DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
TriggerNotify = {};

//#endregion
/*=====================================================================================
TRIGGERNOTIFY INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes TriggerNotify. */
TriggerNotify.Init = function() {
	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		var res = gamePage.resPool.resources[i];
		TriggerNotify.Resources[i] = new TriggerResource(res.name, res.name, '');
	}

	TriggerNotify.AstronomicalEvent = new TriggerResource("Astronomical Event", "Astronomical Event", 'astronomical-event.wav');	

	TriggerNotify.SetResource('catnip', 'catnip.wav');
	TriggerNotify.SetResourceProper('manpower', 'catpower', 'cat-power.wav');
	TriggerNotify.SetResource('coal', 'coal.wav');
	TriggerNotify.SetResource('culture', 'culture.wav');
	TriggerNotify.SetResource('faith', 'faith.wav');
	TriggerNotify.SetResource('gold', 'gold.wav');
	TriggerNotify.SetResource('iron', 'iron.wav');
	TriggerNotify.SetResource('kittens', 'kittens.wav');
	TriggerNotify.SetResource('minerals', 'minerals.wav');
	TriggerNotify.SetResource('oil', 'oil.wav');
	TriggerNotify.SetResource('science', 'science.wav');
	TriggerNotify.SetResource('titanium', 'titanium.wav');
	TriggerNotify.SetResource('unobtainium', 'unobtainium.wav');
	TriggerNotify.SetResource('uranium', 'uranium.wav');
	TriggerNotify.SetResource('wood', 'wood.wav');
	TriggerNotify.SetResource('zebras', 'zebras.wav');

	TriggerNotify.AstronomicalEvent.Visible = true;

	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		var res = TriggerNotify.Resources[i].Resource;

		// Check if a new resource should be added to the menu
		if (!TriggerNotify.Resources[i].Visible && (res.maxValue > 0 && res.value > 0)) {
			TriggerNotify.Resources[i].Visible = true;
		}
	}
	
	TriggerNotify.Load();

	// Set the interval to check for resources maxing
	setInterval(TriggerNotify.Update, 1500);

	TriggerNotify.CreateMenus();

	LoadStyleSheet('TriggerNotify');
	TriggerNotify.WriteMenu();

	// Log success to the console
	console.log('TriggerNotify Loaded');

	// Play a sound to let the user know the mod has been loaded successfully
	if (TriggerNotify.PlayLoadSound)
		TriggerNotify.DefaultSound.play();
}

TriggerNotify.CreateMenus = function () {

	var menu = document.createElement('div');
	menu.className = 'dialog help';
	menu.id = 'triggerNotifyDiv';
	menu.style.cssText = "display: none; height: 480px; top: 30%;";
	document.getElementById('gamePageContainer').appendChild(menu);

	var panelLeft = document.getElementById('devPanel').parentNode;
	var panelTN = document.createElement('span');
	panelLeft.insertBefore(panelTN, document.getElementById('devPanel'));

	var str = '';

	str +=
	' | ' +
	'<a onclick="$(\'#triggerNotifyDiv\').toggle();" href="#">TriggerNotify</a>' +
	'<span style="font-size: small;"> ver 1.2</span>';

	panelTN.innerHTML = str;
}

//#endregion
/*=====================================================================================
TRIGGERNOTIFY MENU
=======================================================================================*/
//#region Menu

TriggerNotify.WriteMenu = function () {
	var str = '';

	str +=
	//'<div id="triggerNotifyDiv" class="help" style="display: none;">' +
	'<a style="position: absolute; top: 10px; right: 15px;" onclick="$(\'#triggerNotifyDiv\').hide();" href="#">close</a>' +
	'<input id="MuteAllSounds" class="triggerNotifyCheckbox" type="checkbox" " onclick="TriggerNotify.MuteAllSounds = document.getElementById(\'MuteAllSounds\').checked;"' + (TriggerNotify.MuteAllSounds ? 'checked' : '') + '></input> mute all' + ' | ' +
	'<input id="PlayLoadSound" class="triggerNotifyCheckbox" type="checkbox" " onclick="TriggerNotify.PlayLoadSound = document.getElementById(\'PlayLoadSound\').checked;"' + (TriggerNotify.PlayLoadSound ? 'checked' : '') + '></input> play sound when mod starts' + ' | ' +
	'<a style="cursor:pointer; text-decoration:underline;" onclick="TriggerNotify.Save();">save</a> ' +
	'<br></br>';

	for (var i = 0; i < TriggerNotify.Resources.length; i++) {
		var res = TriggerNotify.Resources[i];
		if (res.Visible) {
			str += '<div class="triggerNotifyDivHover">' + TriggerNotify.WriteMenuItem(res, i) + '</div>';

		}
	}
	if (TriggerNotify.AstronomicalEvent.Visible){
		str += '<div class="triggerNotifyDivHover">' + TriggerNotify.WriteMenuItem(TriggerNotify.AstronomicalEvent, TriggerNotify.Resources.length+1) + '</div>';
	}

	var menu = document.getElementById('triggerNotifyDiv');
	menu.innerHTML = str;
}

TriggerNotify.WriteMenuItem = function (res, index) {
	var resStr = 'TriggerNotify.Resources[' + String(index) + ']';
	if(res==TriggerNotify.AstronomicalEvent){
		resStr = 'TriggerNotify.AstronomicalEvent'
	}
	var resURL = (typeof res.CustomSoundURL !== 'undefined' ? res.CustomSoundURL : '');
	var str = '';

	str +=
	'<input class="triggerNotifyCheckbox" id="' + res.Name + 'Muted" type="checkbox" " onclick="' + resStr + '.Muted = document.getElementById(\'' + res.Name + 'Muted\').checked;"' + (res.Muted ? 'checked' : '') + '></input> mute | ' +
	'<input class="triggerNotifyCheckbox" id="' + res.Name + 'UseDefaultSound" type="checkbox" " onclick="' + resStr + '.ChangeUseDefaultSound(document.getElementById(\'' + res.Name + 'UseDefaultSound\').checked);"' + (res.UseDefaultSound ? 'checked' : '') + '></input> use default | ' +
	'<input class="triggerNotifyCheckbox" id="' + res.Name + 'File" type="text" value="' + resURL + '" onchange="' + resStr + '.ChangeCustomSound();"></input> custom url | ' +
	//'<input id="' + res.Name + 'File" type="file" onchange="' + resStr + '.ChangeCustomSound();"></input> mute | ' +
	'<a style="cursor:pointer; text-decoration:underline;" onclick="' + resStr + '.Sound.play();">play</a> ' +
	' | ' + (typeof res.Resource.color !== 'undefined' ?
	('<font color="' + res.Resource.color + '">' + res.ProperName + '</font>') :
	(res.ProperName)) +//' | ' +
	'';

	return str;
}

//#endregion
/*=====================================================================================
TRIGGERNOTIFY UPDATING
=======================================================================================*/
//#region Updating

/* Checks if a resource has reached max. */
TriggerNotify.Update = function () {

	var updateMenu = false;

	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		var res = TriggerNotify.Resources[i].Resource;
		var newValue = res.value;
		if (newValue != TriggerNotify.Resources[i].Value) {
			TriggerNotify.Resources[i].Value = newValue;
			if (newValue >= res.maxValue && res.maxValue > 0) {
				TriggerNotify.Resources[i].Play();
			}
		}

		// Check if a new resource should be added to the menu
		if (!TriggerNotify.Resources[i].Visible && (res.maxValue > 0 && res.value > 0)) {
			TriggerNotify.Resources[i].Visible = true;
			updateMenu = true;
		}
	}

	if(TriggerNotify.AstronomicalEvent.Value == 0 && gamePage.calendar.observeBtn != null) {
		TriggerNotify.AstronomicalEvent.Play();
		TriggerNotify.AstronomicalEvent.Value = 1;
	}
	else if(gamePage.calendar.observeBtn == null) {
		TriggerNotify.AstronomicalEvent.Value = 0;
	}

	if (updateMenu) {
		TriggerNotify.WriteMenu();
	}
}
/* Saves the mod settings. */
TriggerNotify.Save = function () {
	var saveData = {};

	saveData.resources = [];

	for (var i = 0; i < TriggerNotify.Resources.length; i++) {
		saveData.resources[i] = TriggerNotify.Resources[i].Save();
	}
	saveData.astronomicalEvent = TriggerNotify.AstronomicalEvent.Save();

	saveData.muteAll = TriggerNotify.MuteAllSounds;
	saveData.playLoad = TriggerNotify.PlayLoadSound;

	LCstorage["com.nuclearunicorn.kittengame.savedata.TriggerNotify"] = JSON.stringify(saveData);
}
/* Loads the mod settings. */
TriggerNotify.Load = function () {
	var loadData = LCstorage["com.nuclearunicorn.kittengame.savedata.TriggerNotify"];
	if (!loadData) {
		return;
	}
	try {
		var saveData = JSON.parse(loadData);

		if (saveData) {
			TriggerNotify.MuteAllSounds = saveData.muteAll;
			TriggerNotify.PlayLoadSound = saveData.playLoad;

			for (var i = 0; i < saveData.resources.length; i++) {
				TriggerNotify.Resources[i].Load(saveData.resources[i]);
			}
			TriggerNotify.AstronomicalEvent.Load(saveData.astronomicalEvent);
		}
	} catch (ex) {
		console.error("Unable to load TriggerNotify data: ", ex);
	}
}

//#endregion
/*=====================================================================================
TRIGGERNOTIFY FUNCTIONS
=======================================================================================*/
//#region Functions

TriggerNotify.SetResource = function (name, sound) {
	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		if (name == gamePage.resPool.resources[i].name) {
			TriggerNotify.Resources[i] = new TriggerResource(name, name, sound);
			break;
		}
	}
}
TriggerNotify.SetResourceProper = function (name, properName, sound) {
	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		if (name == gamePage.resPool.resources[i].name) {
			TriggerNotify.Resources[i] = new TriggerResource(name, properName, sound);
			break;
		}
	}
}

//#endregion
/*=====================================================================================
TRIGGERNOTIFY RESOURCE
=======================================================================================*/
//#region Resource

/* Creates a trigger resource object. */
function TriggerResource(name, properName, defaultSound) {
	this.Name				= name;
	this.ProperName			= properName;
	this.Muted				= false;
	this.Visible			= false;

	this.UseDefaultSound	= true;
	this.DefaultSoundURL	= '';
	if (defaultSound != '')
		this.DefaultSoundURL = GetModURL() + 'snd/' + defaultSound;
	this.CustomSoundURL		= '';
	this.Sound				= null;
	if (defaultSound == '')
		this.Sound = TriggerNotify.DefaultSound;
	else
		this.Sound = new Audio(this.DefaultSoundURL);


	this.Resource			= gamePage.resPool.get(name);
	// The current count for the resource
	this.Value				= this.Resource.value;
}

TriggerResource.prototype.ChangeUseDefaultSound = function (useDefault) {
	this.UseDefaultSound = useDefault;

	if (this.UseDefaultSound && this.DefaultSoundURL != '')
		this.Sound = new Audio(this.DefaultSoundURL);
	else if (this.CustomSoundURL != '')
		this.Sound = new Audio(this.CustomSoundURL);
	else
		this.Sound = TriggerNotify.DefaultSound;
}

TriggerResource.prototype.Play = function () {
	if (!TriggerNotify.MuteAllSounds && !this.Muted)
		this.Sound.play();
}

TriggerResource.prototype.ChangeCustomSound = function () {
	this.CustomSoundURL = document.getElementById(this.Name + 'File').value;

	if (this.UseDefaultSound && this.DefaultSoundURL != '')
		this.Sound = new Audio(this.DefaultSoundURL);
	else if (this.CustomSoundURL != '')
		this.Sound = new Audio(this.CustomSoundURL);
	else
		this.Sound = TriggerNotify.DefaultSound;
}

TriggerResource.prototype.Save = function () {
	var saveData = {
		muted: this.Muted,
		useDefault: this.UseDefaultSound,
		customURL: this.CustomSoundURL
	};

	return saveData;
}

TriggerResource.prototype.Load = function (saveData) {
	this.Muted = saveData.muted,
	this.UseDefaultSound = saveData.useDefault;
	this.CustomSoundURL = saveData.customURL;

	if (this.UseDefaultSound && this.DefaultSoundURL != '')
		this.Sound = new Audio(this.DefaultSoundURL);
	else if (this.CustomSoundURL != '')
		this.Sound = new Audio(this.CustomSoundURL);
	else
		this.Sound = TriggerNotify.DefaultSound;
}

//#endregion
/*=====================================================================================
TRIGGERNOTIFY VARIABLES
=======================================================================================*/
//#region Variables

/* The default sound that plays when no other sound is available. */
TriggerNotify.DefaultSound = new Audio("https://gist.github.com/pernatiy/38bc231506b06fd85473/raw/beep-30.mp3");

/* The list of resources to track. */
TriggerNotify.Resources = [];
TriggerNotify.ResourceSounds = [];
TriggerNotify.AstronomicalEvent = null;

TriggerNotify.MuteAllSounds = false;
TriggerNotify.PlayLoadSound = true;

//#endregion
/*=====================================================================================
LAUNCH TRIGGERNOTIFY
=======================================================================================*/

// Launch TriggerNotify
TriggerNotify.Init();
