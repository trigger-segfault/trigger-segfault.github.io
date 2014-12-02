/*=====================================================================================
TRIGGERVERSE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/AutoCookie.js

// Based off "Cookieclicker Bots".
// Link: https://gist.githubusercontent.com/pernatiy/38bc231506b06fd85473/raw/cc.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the name of the element. */
function l(name) { return document.getElementById(name); }

/* Sets the class variables of debug. */
function setClass(name) { document.getElementById('debug').className = name; }

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'Triggerverse';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace('Scripts/' + name + '.js', '');
	return url;
}
/* Returns true if the specified mod is loaded. */
function IsModLoaded(name) {
	return (document.getElementById('modscript_' + name) != null);
}
/* Loads the specified Trigger Cookies Mod. */
function LoadMod(name) {
	if (!IsModLoaded(name)) {
		var js = document.createElement('script');
		js.setAttribute('type', 'text/javascript');
		js.setAttribute('id', 'modscript_' + name);
		js.setAttribute('src', GetModURL() + 'Scripts/' + name + '.js');
		document.head.appendChild(js);
		console.log('Loaded the mod ' + GetModURL() + 'Scripts/' + name + '.js' + ', ' + name + '.');
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
/* Creates an interval to wait until all the specified mods are loaded loaded */
function IntervalUntilAllLoaded(mods, func) {
	var checkReady = setInterval(function () {
		var allLoaded = true;
		for (var i = 0; i < mods.length; i++) {
			if (!IsDefined(mods[i] + '.Loaded', 'true')) { allLoaded = false; break; }
		}
		if (allLoaded) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}

//#endregion
/*=====================================================================================
TRIGGERVERSE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
Triggerverse = {};
/* True if the mod has been loaded. */
Triggerverse.Loaded = false;

//#endregion
/*=====================================================================================
TRIGGERVERSE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* The nest management state. */
Triggerverse.Init = function () {
	LoadMod('Overrides');

	IntervalUntilAllLoaded(['Overrides'], function () {

		Triggerverse.Setup();
		LoadStyleSheet('Triggerverse');

		Overrides.OverrideFunction('Toggle', 'Triggerverse.Toggle', 'Triggerverse');
		Overrides.OverrideFunction('Instance.prototype.List', 'Triggerverse.List', 'Triggerverse');
		Overrides.AppendFunctionWithParameters('SetStyle', 'Triggerverse.SetStyle', 'which', null, 'Triggerverse');

		Triggerverse.Loaded = true;

		Triggerverse.LoadSettings();

		//setInterval(Triggerverse.SaveSettings, 10000);
	});
}
Triggerverse.LoadSettings = function () {
	function isValid(varname, name, value) { return (name == varname && !isNaN(value)); }
	
	var saveTo = 'NestedTriggerverse';
	var saveData = window.localStorage.getItem(saveTo);

	if (saveData) {
		saveData = unescape(saveData);

		var lines = saveData.split('|');
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (line.indexOf('=') != -1) {
				var line = line.split('=');
				var name = line[0], valueStr = line[1], value = parseInt(valueStr), valuef = parseFloat(valueStr + 'f');

				if (isValid('style', name, value)) {
					Triggerverse.Style = value;
					SetStyle(value);
				}
			}
		}
	}
	else {
		console.log('Error loading Triggerverse settings! (A save may not exist yet for his mod.)');
	}
}
Triggerverse.SaveSettings = function () {
	var saveData = '';

	function write(name, value) { return name + '=' + value.toString() + '|'; }
	saveData +=

	write('style', Triggerverse.Style) +

	'';

	var saveTo = 'NestedTriggerverse';

	saveData = escape(saveData);
	window.localStorage.setItem(saveTo, saveData);//aaand save
	if (!window.localStorage.getItem(saveTo)) {
		console.log('Error saving Triggerverse settings!');
	}
}

//#endregion
/*=====================================================================================
TRIGGERVERSE FUNCTIONS
=======================================================================================*/
//#region Functions

Triggerverse.Setup = function () {
	/*l('debug').style.position = 'absolute';
	l('debug').style.paddingRight = '70px';
	l('debug').style.overflowX = 'scroll';

	l('sidebar').style.display = 'none';*/

	l('header').style.position = 'fixed';

	l('debug').appendChild(document.createElement('br'));
	l('debug').appendChild(document.createElement('br'));

	var modName = document.createElement('span');
	modName.id = 'modName';
	modName.innerHTML = '[Triggerverse - ' + iN + ' node' + (iN != 1 ? 's' : '') + ']';
	l('header').insertBefore(modName, l('madeby'));

	var states = document.createElement('div');
	states.id = 'states';

	var str = '';

	str +=
	//'<div class="modeName">' + 'Save ' + '</div>' +
	//'<a style="background-color: ' + '#000' + ';" href="javascript:Triggerverse.SaveSettings()">' + 'Save' + '</a>' +
	'<div class="modeName">' + 'Normal ' + '</div><a style="background-color: ' + '#000' + ';" href="javascript:Triggerverse.SetNestState(' + 0 + ')">' + '+' + '</a>' +
	'<div class="modeName">' + 'Center ' + '</div><a style="background-color: ' + '#0A5' + ';" href="javascript:Triggerverse.SetNestState(' + 1 + ')">' + 'O' + '</a>' +
	'<div class="modeName">' + 'Delete ' + '</div><a style="background-color: ' + '#A00' + ';" href="javascript:Triggerverse.SetNestState(' + 2 + ')">' + 'X' + '</a>' +
	'<div class="modeName">' + 'Bookmarks ' + '</div>' +
	'<a id="saveBook" style="background-color: ' + '#07A' + ';" href="javascript:Triggerverse.SetNestState(' + 3 + ')">' + 'Save' + '</a>' +
	'<a id="loadBook" style="background-color: ' + '#07A' + ';" href="javascript:(function () {})();">' + 'Load' + '</a>' +
	'';

	states.innerHTML = str;
	l('header').appendChild(states);

	//window.addEventListener("keydown", Triggerverse.ListenerDown, false);
	//window.addEventListener("keyup", Triggerverse.ListenerUp, false);
}
Triggerverse.SaveBookmark = function (what) {
	if (Triggerverse.Bookmark != -1) {
		l('arrow' + Triggerverse.Bookmark).className = 'arrow';
	}

	Triggerverse.Bookmark = what;
	if (what == -1)
		l('loadBook').href = 'javascript:(function () {})();';
	else
		l('loadBook').href = '#div' + what;
	if (Triggerverse.Bookmark != -1) {
		l('arrow' + Triggerverse.Bookmark).className = 'arrow bookmark';
	}
}
Triggerverse.UpdateNodes = function () {
	l('modName').innerHTML = '[Triggerverse - ' + iN + ' node' + (iN != 1 ? 's' : '') + ']';
}
Triggerverse.SetStyle = function (which) {
	Triggerverse.Style = which;
	Triggerverse.SaveSettings();
}
Triggerverse.SetNestState = function (state) {

	if (Triggerverse.NestState == state || state == 0) {
		Triggerverse.NestState = 0;
		setClass('');
	}
	else if (state != 0) {
		Triggerverse.NestState = state;
		setClass('nestState' + Triggerverse.NestState);
	}
}
Triggerverse.List = function (state) {

	var str = "";
	var addStyle = "";
	for (var i in this.children) {
		str += '<div id="div' + this.children[i].n + '">' + this.children[i].name + '</div>';
	}
	//special-case pictures
	if (this.name == "sharkverse") addStyle = "background-image:url('nestedSharkverse.png');";
	else if (this.name == "baconverse") addStyle = "background-image:url('nestedBaconverse.png');";
	else if (this.name == "doughnutverse") addStyle = "background-image:url('nestedDoughnutverse.png');";
	else if (this.name == "lasagnaverse") addStyle = "background-image:url('nestedLasagnaverse.png');";
	else if (this.name == "cookieverse") addStyle = "background-image:url('" + GetModURL() + "Images/cookieShower2.png');";
	else if (this.name == "grandmaverse") addStyle = "background-image:url('" + GetModURL() + "Images/grandmaIcon.png');";
	//if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<span onclick="Toggle('+this.n+');"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</span><div id="container'+this.n+'" class="thing" style="display:none;">'+str+'</div>';
	if (this.children.length > 0) document.getElementById("div" + this.n).innerHTML = '<a href="javascript:Toggle(' + this.n + ');" style="padding-right:8px;" alt="archetype : ' + (this.type.name) + '" title="archetype : ' + (this.type.name) + '"><span class="arrow" id="arrow' + this.n + '">+</span> ' + this.name + '</a><div id="container' + this.n + '" class="thing" style="display:none;' + addStyle + '">' + str + '</div>';
	else document.getElementById("div" + this.n).innerHTML = '<span class="emptyThing">' + this.name + '</span>';
}
Triggerverse.Toggle = function (what) {

	if (Triggerverse.NestState == 0) {
		if (Instances[what].display == 0) {

			for (var i in Instances[what].children) {
				if (Instances[what].children[i].grown == false) { Instances[what].children[i].Grow(0); Instances[what].children[i].List(0); }
			}

			Instances[what].display = 1;
			document.getElementById("container" + what).style.display = "block";
			document.getElementById("arrow" + what).innerHTML = "-";
		}
		else if (Instances[what].display == 1) {
			Instances[what].display = 0;
			document.getElementById("container" + what).style.display = "none";
			document.getElementById("arrow" + what).innerHTML = "+";
		}
	}
	else if (Triggerverse.NestState == 1) {
		if (l('div' + what).className != 'thing') {
			Triggerverse.SaveBookmark(-1);
			/*var newDiv = l('div' + what);
			newDiv = newDiv.parentNode.removeChild(l('div' + what));
			newDiv.className = 'thing';

			l('debug').insertBefore(newDiv, l('debug').children[1]);
			l('debug').removeChild(l('debug').children[2]);
			Triggerverse.SetNestState(0);*/
			Triggerverse.KillSiblings(what);
			Triggerverse.SetNestState(0);
		}
	}
	else if (Triggerverse.NestState == 2) {
		if (l('div' + what).className != 'thing') {
			if (what == Triggerverse.Bookmark)
				Triggerverse.SaveBookmark(-1);
			var node = Instances[what];
			var parent = node.parent;
			for (var i = 0; i < parent.children.length; i++) {
				if (parent.children[i] == node) {
					parent.children.splice(i, 1);
					break;
				}
			}

			var newDiv = l('div' + what);
			newDiv.parentNode.removeChild(l('div' + what));
		}
	}
	else if (Triggerverse.NestState == 3) {
		if (l('div' + what).className != 'thing') {
			Triggerverse.SaveBookmark(what);
			Triggerverse.SetNestState(0);
		}
	}

	Triggerverse.UpdateNodes();
}
Triggerverse.ListenerDown = function (e) {

	if (Triggerverse.NestState == 0) {
		var newState = Triggerverse.NestState;
		if (e.keyCode == Triggerverse.Controls[1].down)
			newState = 1;
		if (e.keyCode == Triggerverse.Controls[2].down)
			newState = 2;

		if (newState != Triggerverse.NestState) {
			Triggerverse.NestState = newState;
			setClass('nestState' + Triggerverse.NestState);
		}
	}
}
Triggerverse.ListenerUp = function (e) {

	if (Triggerverse.NestState != 0) {
		var newState = Triggerverse.NestState;
		if (e.keyCode == Triggerverse.Controls[1].up)
			newState = 0;
		if (e.keyCode == Triggerverse.Controls[2].up)
			newState = 0;

		if (newState != Triggerverse.NestState) {
			Triggerverse.NestState = newState;
			setClass('');
		}
	}
}
Triggerverse.KillSiblings = function (what) {

	var newDiv = l('div' + what);
	newDiv = newDiv.parentNode.removeChild(l('div' + what));
	newDiv.className = 'thing';

	l('debug').insertBefore(newDiv, l('debug').children[1]);
	l('debug').removeChild(l('debug').children[2]);

	//---------------------------------------

	var it = Instances[what];
	var stack = [];
	var newInstances = [];
	stack.push(it);
	newInstances.push(it);

	while (stack.length > 0) {
		var parent = stack.pop();
		var emptyThing = (parent.children.length == 0);

		var div = l('div' + parent.n);
		div.id = 'divN' + parent.n;

		if (!emptyThing) {
			var container = l('container' + parent.n);
			var arrow = l('arrow' + parent.n);
			container.id = 'containerN' + parent.n;
			arrow.id = 'arrowN' + parent.n;

			for (var i in parent.children) {
				stack.push(parent.children[i]);
				newInstances.push(parent.children[i]);
			}
		}

	}

	var index = 0;
	for (var i in newInstances) {
		var node = newInstances[i];
		var emptyThing = (node.children.length == 0);

		var oldN = node.n;
		node.n = index;

		var div = l('divN' + oldN);
		div.id = 'div' + node.n;
		if (!emptyThing) {
			var container = l('containerN' + oldN);
			var arrow = l('arrowN' + oldN);
			var link = div.children[0];

			container.id = 'container' + node.n;
			arrow.id = 'arrow' + node.n;
			link.href = 'javascript:Toggle(' + node.n + ');';
		}

		index++;
	}

	//---------------------------------------

	iN = index;
	Instances = newInstances;

	Triggerverse.SaveBookmark(-1);
}

//#endregion
/*=====================================================================================
TRIGGERVERSE VARIABLES
=======================================================================================*/
//#region Variables

/* The nest management state. */
Triggerverse.NestState = 0;

Triggerverse.Bookmark = -1;

/* The controls for the mod. */
Triggerverse.Controls = {
	1: { down: 67, up: 67 },
	2: { down: 68, up: 68 }
};

//#endregion
/*=====================================================================================
LAUNCH TRIGGERVERSE
=======================================================================================*/

Triggerverse.Init();

