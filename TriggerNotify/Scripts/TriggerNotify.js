/*=====================================================================================
TRIGGERNOTIFY MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  Ver 1.0.7.1
// Repository:   https://github.com/trigger-death/trigger-death.github.io/tree/master/TriggerNotify

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'TriggerNotify';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace('Scripts/' + name + '.js', '');
	return url;
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

	TriggerNotify.SetResource('catnip', 'Catnip.wav');
	TriggerNotify.SetResourceProper('manpower', 'catpower', 'CatPower.wav');
	TriggerNotify.SetResource('coal', 'Coal.wav');
	TriggerNotify.SetResource('culture', 'Culture.wav');
	TriggerNotify.SetResource('faith', 'Faith.wav');
	TriggerNotify.SetResource('gold', 'Gold.wav');
	TriggerNotify.SetResource('iron', 'Iron.wav');
	TriggerNotify.SetResource('kittens', 'Kittens.wav');
	TriggerNotify.SetResource('minerals', 'Minerals.wav');
	TriggerNotify.SetResource('oil', 'Oil.wav');
	TriggerNotify.SetResource('science', 'Science.wav');
	TriggerNotify.SetResource('titanium', 'Titanium.wav');
	TriggerNotify.SetResource('unobtainium', 'Unobtainium.wav');
	TriggerNotify.SetResource('uranium', 'Uranium.wav');
	TriggerNotify.SetResource('wood', 'Wood.wav');
	TriggerNotify.SetResource('zebras', 'Zebras.wav');

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
	menu.className = 'help';
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
	'<span style="font-size: small;"> ver 1.1</span>';

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
	'<input id="MuteAllSounds" type="checkbox" " onclick="TriggerNotify.MuteAllSounds = document.getElementById(\'MuteAllSounds\').checked;"' + (TriggerNotify.MuteAllSounds ? 'checked' : '') + '></input> mute all' + ' | ' +
	'<input id="PlayLoadSound" type="checkbox" " onclick="TriggerNotify.PlayLoadSound = document.getElementById(\'PlayLoadSound\').checked;"' + (TriggerNotify.PlayLoadSound ? 'checked' : '') + '></input> play load sound' + ' | ' +
	'<a style="cursor:pointer; text-decoration:underline;" onclick="TriggerNotify.Save();">save</a> ' +
	'<br></br>';

	for (var i = 0; i < TriggerNotify.Resources.length; i++) {
		var res = TriggerNotify.Resources[i];
		if (res.Visible) {
			str += '<div class="triggerNotifyDivHover">' + TriggerNotify.WriteMenuItem(res, i) + '</div>';

		}
	}

	var menu = document.getElementById('triggerNotifyDiv');
	menu.innerHTML = str;
}

TriggerNotify.WriteMenuItem = function (res, index) {
	var resStr = 'TriggerNotify.Resources[' + String(index) + ']';
	var resURL = (typeof res.CustomSoundURL !== 'undefined' ? res.CustomSoundURL : '');
	var str = '';

	str +=
	'<input id="' + res.Name + 'Muted" type="checkbox" " onclick="' + resStr + '.Muted = document.getElementById(\'' + res.Name + 'Muted\').checked;"' + (res.Muted ? 'checked' : '') + '></input> mute | ' +
	'<input id="' + res.Name + 'UseDefaultSound" type="checkbox" " onclick="' + resStr + '.ChangeUseDefaultSound(document.getElementById(\'' + res.Name + 'UseDefaultSound\').checked);"' + (res.UseDefaultSound ? 'checked' : '') + '></input> use default | ' +
	'<input id="' + res.Name + 'File" type="text" value="' + resURL + '" onchange="' + resStr + '.ChangeCustomSound();"></input> custom url | ' +
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
		this.DefaultSoundURL = GetModURL() + 'Sounds/' + defaultSound;
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

TriggerNotify.MuteAllSounds = false;
TriggerNotify.PlayLoadSound = true;

//#endregion
/*=====================================================================================
LAUNCH TRIGGERNOTIFY
=======================================================================================*/

// Launch TriggerNotify
TriggerNotify.Init();
