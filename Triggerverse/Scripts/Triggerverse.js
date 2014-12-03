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
	LoadMod('RollerCoasterTycoon');

	IntervalUntilAllLoaded(['Overrides'], function () {

		Triggerverse.Setup();
		LoadStyleSheet('Triggerverse');

		Overrides.OverrideFunction('Toggle', 'Triggerverse.Toggle', 'Triggerverse');
		Overrides.OverrideFunction('Instance.prototype.List', 'Triggerverse.List', 'Triggerverse');
		Overrides.AppendFunctionWithParameters('SetStyle', 'Triggerverse.SetStyle', 'which', null, 'Triggerverse');
		Overrides.OverrideFunction('Instance.prototype.Name', 'Triggerverse.Name', 'Triggerverse');


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
	else if (this.name == "grandmaverse") addStyle = "background-image:url('" + GetModURL() + "Images/grandmaicon2.png');";
	//if (this.children.length>0) document.getElementById("div"+this.n).innerHTML='<span onclick="Toggle('+this.n+');"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</span><div id="container'+this.n+'" class="thing" style="display:none;">'+str+'</div>';
	if (this.children.length > 0) document.getElementById("div" + this.n).innerHTML = '<a href="javascript:Toggle(' + this.n + ');" style="padding-right:8px;" alt="archetype : ' + (this.type.name) + '" title="archetype : ' + (this.type.name) + '"><span class="arrow" id="arrow' + this.n + '">+</span> ' + this.name + '</a><div id="container' + this.n + '" class="thing" style="display:none;' + addStyle + '">' + str + '</div>';
	else document.getElementById("div" + this.n).innerHTML = '<span class="emptyThing">' + this.name + '</span>';

	for (var i in Triggerverse.CustomListRules) {
		Triggerverse.CustomListRules[i].bind(this)();
	}
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
Triggerverse.Name = function () {
	this.name = this.type.namegen;

	if (typeof (this.name) != "string") {
		var str = "";
		if (typeof (this.name[0]) == "string") str += Choose(this.name);
		else {
			for (var i in this.name) {
				str += Choose(this.name[i]);
			}
		}
		this.name = str;
	}

	nameParts = this.name.split("|");
	this.name = nameParts[0];

	//#region Preset Rules

	if (this.name == "*PERSON*" || this.name == "*MAN*" || this.name == "*WOMAN*") {
		//Generates a first name + last name, compiled from the 100 most popular names in the USA. Yes, every person in the universe is an American.
		if (this.name == "*PERSON*") var gender = Choose([0, 1]);
		else if (this.name == "*MAN*") var gender = 1;
		else if (this.name == "*WOMAN*") var gender = 0;
		var str = "";
		//http://names.mongabay.com/male_names.htm
		if (gender == 0) str += WeightedChoose(["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Jessica", "Shirley", "Cynthia", "Angela", "Melissa", "Brenda", "Amy", "Anna", "Rebecca", "Virginia", "Kathleen", "Pamela", "Martha", "Debra", "Amanda", "Stephanie", "Carolyn", "Christine", "Marie", "Janet", "Catherine", "Frances", "Ann", "Joyce", "Diane", "Alice", "Julie", "Heather", "Teresa", "Doris", "Gloria", "Evelyn", "Jean", "Cheryl", "Mildred", "Katherine", "Joan", "Ashley", "Judith", "Rose", "Janice", "Kelly", "Nicole", "Judy", "Christina", "Kathy", "Theresa", "Beverly", "Denise", "Tammy", "Irene", "Jane", "Lori", "Rachel", "Marilyn", "Andrea", "Kathryn", "Louise", "Sara", "Anne", "Jacqueline", "Wanda", "Bonnie", "Julia", "Ruby", "Lois", "Tina", "Phyllis", "Norma", "Paula", "Diana", "Annie", "Lillian", "Emily", "Robin"], 1.2);
		else if (gender == 1) str += WeightedChoose(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary", "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric", "Stephen", "Andrew", "Raymond", "Gregory", "Joshua", "Jerry", "Dennis", "Walter", "Patrick", "Peter", "Harold", "Douglas", "Henry", "Carl", "Arthur", "Ryan", "Roger", "Joe", "Juan", "Jack", "Albert", "Jonathan", "Justin", "Terry", "Gerald", "Keith", "Samuel", "Willie", "Ralph", "Lawrence", "Nicholas", "Roy", "Benjamin", "Bruce", "Brandon", "Adam", "Harry", "Fred", "Wayne", "Billy", "Steve", "Louis", "Jeremy", "Aaron", "Randy", "Howard", "Eugene", "Carlos", "Russell", "Bobby", "Victor", "Martin", "Ernest", "Phillip", "Todd", "Jesse", "Craig", "Alan", "Shawn", "Clarence", "Sean", "Philip", "Chris", "Johnny", "Earl", "Jimmy", "Antonio"], 1.2);
		str += " ";
		if (Rand(0, 30) == 1) str += "Mc";
		str += WeightedChoose(["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen", "Sanchez", "Wright", "King", "Scott", "Green", "Baker", "Adams", "Nelson", "Hill", "Ramirez", "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans", "Turner", "Torres", "Parker", "Collins", "Edwards", "Stewart", "Flores", "Morris", "Nguyen", "Murphy", "Rivera", "Cook", "Rogers", "Morgan", "Peterson", "Cooper", "Reed", "Bailey", "Bell", "Gomez", "Kelly", "Howard", "Ward", "Cox", "Diaz", "Richardson", "Wood", "Watson", "Brooks", "Bennett", "Gray", "James", "Reyes", "Cruz", "Hughes", "Price", "Myers", "Long", "Foster", "Sanders", "Ross", "Morales", "Powell", "Sullivan", "Russell", "Ortiz", "Jenkins", "Gutierrez", "Perry", "Butler", "Barnes", "Fisher", "Henderson", "Coleman", "Simmons", "Patterson", "Jordan", "Reynolds", "Hamilton", "Graham", "Kim", "Gonzales", "Alexander", "Ramos", "Wallace", "Griffin", "West", "Cole", "Hayes", "Chavez", "Gibson", "Bryant", "Ellis", "Stevens", "Murray", "Ford", "Marshall", "Owens", "Mcdonald", "Harrison", "Ruiz", "Kennedy", "Wells", "Alvarez", "Woods", "Mendoza", "Castillo", "Olson", "Webb", "Washington", "Tucker", "Freeman", "Burns", "Henry", "Vasquez", "Snyder", "Simpson", "Crawford", "Jimenez", "Porter", "Mason", "Shaw", "Gordon", "Wagner", "Hunter", "Romero", "Hicks", "Dixon", "Hunt", "Palmer", "Robertson", "Black", "Holmes", "Stone", "Meyer", "Boyd", "Mills", "Warren", "Fox", "Rose", "Rice", "Moreno", "Schmidt", "Patel", "Ferguson", "Nichols", "Herrera", "Medina", "Ryan", "Fernandez", "Weaver", "Daniels", "Stephens", "Gardner", "Payne", "Kelley", "Dunn", "Pierce", "Arnold", "Tran", "Spencer", "Peters", "Hawkins", "Grant", "Hansen", "Castro", "Hoffman", "Hart", "Elliott", "Cunningham", "Knight", "Bradley"], 2);
		if (gender == 1 && Rand(0, 2000) == 1) str = Choose(["Elvis Presley", "Gabe Newell"]);//4chan made me do it
		this.name = str;
	}
	else if (this.name == "*MEDIEVAL PERSON*" || this.name == "*MEDIEVAL MAN*" || this.name == "*MEDIEVAL WOMAN*") {
		//Generates a medieval first name + last name, mostly taken from http://www.infernaldreams.com/names/Europe/Medieval/England.htm
		if (this.name == "*MEDIEVAL PERSON*") var gender = Choose([0, 1]);
		else if (this.name == "*MEDIEVAL MAN*") var gender = 1;
		else if (this.name == "*MEDIEVAL WOMAN*") var gender = 0;
		var str = "";
		if (gender == 0) str += Choose(["Millicent", "Alinor", "Eleanor", "Agnes", "Alice", "Avice", "Beatrice", "Cecily", "Emma", "Isabella", "Joan", "Juliana", "Margery", "Matilda", "Roh", "Morgan", "Elizabeth", "Kethleen"]);
		else if (gender == 1) str += Choose(["Adam", "Geoffrey", "Gilbert", "Henry", "Hugh", "John", "Nicholas", "Peter", "Ralf", "Richard", "Robert", "Roger", "Simon", "Thomas", "Walter", "William", "Robin", "Albin", "Bayard", "Erwin"]);
		str += " ";
		str += Choose(["Strong", "Tall", "Grand", "Bold", "Big", "Small", "Fine", "Good", "Glad", "Green", "Blue", "Red", "Black", "White", "Pale", "Gray", "Gold", "Silver", "Dark", "Light", "Brave", "Sly"]);
		str += Choose(["ington", "son", "house", "door", "castle", "forest", "tree", "leaf", "wind", "rain", "snow", "rock", "stone", "river", "sea", "ship", "smith", "craft", "cook", "worth", "might", "wolf", "bear", "sheep", "pig", "fox", "hunt", "dragon"]);
		this.name = str;
	}
	else if (this.name == "*ANCIENT PERSON*" || this.name == "*ANCIENT MAN*" || this.name == "*ANCIENT WOMAN*") {
		//Generates a primitive name
		if (this.name == "*ANCIENT PERSON*") var gender = Choose([0, 1]);
		else if (this.name == "*ANCIENT MAN*") var gender = 1;
		else if (this.name == "*ANCIENT WOMAN*") var gender = 0;
		var str = "";
		str = Choose(["Passing", "Walking", "Running", "Sitting", "Kneeling", "Timid", "Dreaming", "Swift", "Deadly", "Wise", "Old", "Young", "Ugly", "Bright", "Broken", "Fine", "Soulful", "Loud", "Mad", "Crazed", "Unending", "Lone", "Sure", "Steady", "Hungry", "Crafty", "Thirsty", "Rising", "Falling", "Huge", "Magnificent", "Deep", "Aching", "Mourning", "Sweet", "Kind", "Comforting", "Misshapen", "Smiling", "Sneaking", "Trusted", "Shifty", "Furious", "Lustful"]);
		str += " ";
		str += Choose(["Thought", "Eyes", "Legs", "Hands", "Nose", "Sorrow", "Scream", "Whisper", "Rage", "Stream", "River", "Sky", "Light", "Spark", "Moon", "Sun", "Star", "Forest", "Cloud", "Tree", "Rock", "Beast", "Rabbit", "Wolf", "Auroch", "Mammoth", "Lion", "Spear", "Flame", "Cave", "Ocean", "Snail", "Slug", "Bear", "Shark", "Toad", "Day", "Night", "Friend", "Snake", "Ears", "Spirit", "Track", "Pebble", "Boulder", "Mountain", "Volcano", "Storm", "Rain", "Snow"]);
		if (gender == 1 && Rand(0, 250) == 1) str = "Dave";
		this.name = str;
	}
	else if (this.name == "*FUTURE PERSON*" || this.name == "*FUTURE MAN*" || this.name == "*FUTURE WOMAN*") {
		//Generates a futuristic first name + last name
		if (this.name == "*FUTURE PERSON*") var gender = Choose([0, 1]);
		else if (this.name == "*FUTURE MAN*") var gender = 1;
		else if (this.name == "*FUTURE WOMAN*") var gender = 0;
		var str = "";
		if (gender == 0) str += Choose(["Alice", "Trillian", "Zeria", "Zinda", "Myriad", "Shosset", "Tary", "Wayt", "Cassidy", "Millanda", "Replika", "Simia", "Mirrix", "Bariona", "Sossis", "Kroassent", "Five", "Seven", "Fourteen"]);
		else if (gender == 1) str += Choose(["Bob", "Zaphod", "Zorvax", "Zerebius", "Borbon", "Bradbury", "Isaac", "Werber", "Omni", "Robion", "Shossur", "Alistor", "Clonos", "Sorbel", "Boodin", "Bagget", "Three", "Twelve", "Twenty"]);
		str += " ";
		str += Choose(["Zar", "Star", "Solar", "Jaro", "Mera", "Gar", "Dar", "Bar", "Mar", "Mor", "Dor", "Kar", "Kra", "Sbur", "Bostro", "Astro", "Cosmo", "Poly", "Beeble", "Pro", "Nano", "Shimmer", "Glimmer", "Wander", "Lea", "Magna"]);
		str += Choose(["bion", "bius", "micus", "bicus", "dion", "dius", "billion", "million", "bistor", "bostrud", "wund", "brox", "biotis", "saurus", "boticus", "meld", "sweep", "block", "dine", "zine", "nople", "neon", "ba", "zor", "zar", "klor"]);
		this.name = str;
	}
	else if (this.name == "*MEMORY*")	//Memories and thoughts are a little tricky because they have to be gender-neutral (you can't go up levels to figure out if the person is male or female).
	{
		var str = "";
		str += WeightedChoose([
		Choose(["Biking", "Hiking", "Swimming", "Flying kites", "Playing", "Playing baseball", "Stargazing", "Playing soccer", "Playing basketball", "Playing chess", "Playing checkers", "Playing video-games", "Watching TV", "Cooking"]) + " with my " + Choose(["mother", "father", "parents", "grand-father", "grand-mother", "grand-parents", "uncle", "aunt", "cousin", "sister", "brother"]) + Choose(["", " when I was " + Choose(["a child", "young", Rand(7, 21)])]) + ".",
		"The day I " + Choose(["learned how to " + Choose(["drive", "cook", "love", "kiss", "read", "forgive", "make friends", "speak another language", "play " + Choose(["piano", "drums", "guitar", "saxophone", "cards"])]), Choose(["graduated high school", "graduated college", "got my license"]), Choose(["got promoted as ", "got a job as ", "finally became "]) + Choose(["a cook", "a reporter", "a game designer", "a lawyer", "a doctor", "a veterinarian", "a biologist", "a soldier", "a physicist", "a scientist", "a geologist", "a shopkeeper", "a teacher", "a historian", "an archeologist", "a musician", "an artist", "an athlete", "a dancer"])]) + ".",
		Choose(["Kissing", "Cuddling with", "Watching movies with", "Staying up late with", "Sharing secrets with", "Sharing childhood memories with", "Feeling close to", "Laying my arm around"]) + " " + Choose(["that one person", "my best friend", "my love interest", "my crush"]) + " in " + Choose(["middle school", "high school", "college"]) + ".",
		"The day I " + Choose(["got married", "had my daughter", "had my son", "lost my father", "lost my mother", "went on a trip with " + Choose(["my partner", "my family", "my friends"]), "learned " + Choose(["I", "my son", "my daughter", "my sister", "my brother", "my father", "my mother"]) + " was ill", "learned we were at war", "learned the war was over", "broke my " + Choose(["leg", "ankle", "elbow", "knee", "nose"]), "broke up with my partner", "lost my " + WeightedChoose(["dog", "cat", "bunny", "hamster", "gerbil", "bird", "goldfish", "ferret", "rat", "iguana", "pet spider"], 1.5)]) + ".",
		"That one unforgettable " + Choose(["book", "movie", "video game", "trip", "kiss", "person I met", "party"]) + "."
		], 1.5);
		this.name = str;
	}
	else if (this.name == "*SADTHOUGHT*") {
		var str = "";
		str += WeightedChoose([
		Choose(["This place is crowded.", "I don't want to live here my whole life.", "I don't want to spend the rest of my life here.", "I want to meet different people.", "I'm so alone.", "I don't want to be alone.", "When did I get so lonely?", "I'm scared.", "I feel so insignificant.", "Does it matter, really?", "This is absurd.", "I hate this place.", "I hate the people here.", "Nobody understands me.", "I wish the voices would stop.", "I'm in debt.", "I shouldn't spend so much.", "I don't really like my friends.", "I regret doing that thing I did.", "I hope they never find out.", "What if I get caught?", "This is killing me.", "What will happen to me when I die?", "This is all sick.", "What's the point?", "I secretly know the meaning of life but I won't tell anyone.", "I know why we're here.", "What if this was real?", "Some people need to check their privilege...", "This isn't what I wanted.", "I... I just want " + Choose(["a friend", "friends", "someone to hug", "a family", "someone who understands me", "to have kids"]) + ".", "Is this how it's going to end?", "Oh, that's going on my blog."]),
		Choose(["I'm too lazy.", "I don't want to get fired.", "I'm worried.", "I don't deserve this.", "Why am I doing this to myself?", "This isn't like me.", "If only I was " + Choose(["a pirate", "a dolphin", "an unicorn", "a panda", "a cyborg", "a robot", "a superhero", "invisible"]) + ".", "Hold me. I'm scared.", "This is my only shot at this.", "This was my only shot at this, and I blew it.", "I won't make the same mistake twice.", "If I must.", "As you wish.", "Where are my parents now?", "I hate myself sometimes.", "I'm " + Choose(["worthless", "terrible", "just a bad person", "just not a good person", "so awful", "so alone. I need help", "never going to amount to anything", "no good. My mom was right", "not that bad, I guess", "a faker", "so bad at this", "too nice for my own good"]) + ".", "What a waste.", "I wish I was a better person.", "I should learn a new " + Choose(["skill", "language"]) + ".", "I'm terrified of death.", "I don't want to get older.", "I wish I didn't waste my youth.", "I regret so much.", "I shouldn't have said no.", "I should call " + Choose(["her", "him"]) + " and say sorry.", "I should call my parents.", "I miss " + Choose(["him", "her", "them"]) + Choose([". So much", "", ""]) + ".", "I " + Choose(["wish I was", "should be", "want to be"]) + " " + Choose(["more generous", "nicer", "more popular", "more interesting", "more romantic"]) + ".", "I don't suck at " + Choose(["singing", "painting", "dancing", "writing", "video-games", "maths"]) + ". People just think I do.", "Nobody must know about " + Choose(["my balding hair", "my parents", "this", "me", "my drinking problem", "my health problems", "what I do in the shower", "what I did", "what I'm about to do", "what I'm doing", "the movies I watch", "the books I read", "the websites I go on"]) + ".", "I am secretly " + Choose(["a regular human being", "perfectly normal", "perfectly ordinary", "spying on you right now", "a wizard", "the smartest person in the world", "the wisest person in the world", "the most important person in the world", "a spider", "a robot", "a midget", "a very ancient ghost", "an extra-terrestrial", "a tree", "a flower", "a shark", "a bear", "my own cousin", "an astral monstrosity", "a secret"]) + ".", "I'm tired. I've been doing this all day.", "Don't listen to what they say. It's just not true.", "Too many rumors going on.", "It's not what it looks like, I swear!", "Uh... I can explain.", "Well, I'm glad nobody can read my mind.", "My friends aren't real.", "I'm the only real person here."]),
		Choose(["I need", "I want", "I might need", "I should get", "What I want is", "What I need right now is", "I'll just get"]) + " " + Choose(["some new shoes", "a new TV", "a new computer", "another car", "a bigger house", "a better job", "a lover", "more pets", "a makeover", "a good movie", "a nice dinner in town"]) + ".",
		Choose(["My " + Choose(["butt", "nose", "foot", "ear", "forehead", "back"]) + " is itchy.", "My " + Choose(["head", "leg", "arm", "belly", "back", "shoulder"]) + " " + Choose(["feels weird", "feels icky", "hurts", "feels strange"]) + ".", "I should see a doctor for my " + Choose(["eyes", "brain", "head", "chest", "legs", "back"]) + "."]),
		Choose(["This " + Choose(["marriage", "relationship"]) + " " + Choose(["is a failure", "is a disaster", "was a mistake", "isn't working"]), "I regret getting married", "I want a divorce", "This isn't why I got married"]) + ".",
		Choose([Choose(["I just can't stand the taste of", "I am not going to finish", "I paid way too much for", "I don't really like"]) + " " + Choose(["this hamburger", "this steak", "this salad", "this pasta", "this sandwich", "this pizza", "this meal", "this beer", "this soda"]) + ".", Choose(["I hate that show", "That show is revolting", "I hate that show, but I'm going to watch it anyway", "My parents used to watch that show", "There's nothing on TV", "That's a stupid movie", "I've seen that movie already"]) + ".", Choose(["Wait, ", "Hold on. ", "Ugh. ", "Ugh, I told them ", ""]) + "I'm allergic to " + Choose(["shrimp", "soy", "pineapple"]) + "."]),
		Choose(["This will not stand.", "Dammit I'm mad.", "Yes, I am mad.", "I won't let this happen.", "No. Never. Not if I have a word in it.", "Over my dead body.", "Do they have any idea how angry I am?", "I am absolutely furious.", "This upsets me.", "Well, I am upset.", "On we march.", "This is not over.", "I can see them, beyond the stars.", "I can sense them. They're coming.", "Something is coming this way.", "Something is about to go horribly wrong.", "It was written.", "It is coming.", "We must fight on.", "I've seen things.", "Oh no. I'm thinking weird stuff again.", "Do you really think I can't see you?", "I don't look at the world the way I used to.", "Can't you hear them?", "It's always there.", "It won't go away.", "There are things that I just can't explain.", "Who where?", "They don't think it is like this. But it is.", "The world looks too intense for me.", "I never asked for this.", "No! I don't want that!", "What if we're all living in a giant computer simulation?", "This place would look good on fire!", "This is the end, isn't it?", "The end."])
		], 1.4);
		this.name = str;
	}
	else if (this.name == "*HAPPYTHOUGHT*") {
		var str = "";
		str += WeightedChoose([
		Choose(["What a nice day!", "It's sunny today.", "It's a sunny day out.", "It's such a nice day.", "It's such a great day to be alive!", "This is a happy kind of day.", "I feel great.", "Ooh, I'm feeling fine.", "I'm feeling awesome.", "Hey, this is great!", "I'm so glad I came here.", "I regret nothing!", "Regrets are pointless.", "I have no regrets.", "This is what I wanted!", "Everything's going just fine.", "I can't wait!", "Things are going smoothly.", "I'm just happy to be here.", "Well, this is " + Choose(["unexpected", "awkward", "fun", "just funny", "strange", "interesting", "odd", "peculiar", "weird"]) + ".", "I know the meaning of life!", "I didn't expect this!", "I'm glad someone understands me.", "I'm glad someone likes me for who I am.", "I love my friends!", "Life is good!", "I could picture myself spending the rest of my life here.", "I should meet new friends!", "I feel loved.", "I feel almighty!", "I matter.", "This place is nice.", "Everybody's great in some way!", "I hope " + Choose(["they", "she", "he"]) + "'ll like me!", "I wonder what happens next!", "It's all going to be alright.", "It'll all be alright in the end. I just know it.", "This is actually okay.", "I love the whole world!", "The world is a big place!", "The world is amazing!", "So it has come to this.", "Well this is an interesting development.", "Let's see what happens next.", "Oh hey. I found me.", "I NEED to blog about this."]),
		Choose(["I should take a self-help course!", "I'm doing alright.", "My job is pretty fulfilling.", "I don't really worry.", "Worrying is pointless!", "This is cooler than I expected!", "Haha, this is just like me.", "Wouldn't it be awesome if I was " + Choose(["a pirate", "a dolphin", "an unicorn", "a panda", "a cyborg", "a robot", "a superhero", "invisible"]) + "?", "I'm pretty self-confident.", "I'm a pretty big deal.", "I'm pretty extreme.", Choose(["You want a piece of this?", "I'm all business, all the time.", "I vibrate through walls.", "This is going to be gay as hell.", "We're making this happen!"]), "I mean, wow.", "Yep. Just a regular human person. Nothing to see here.", "I want to become even better!", "I should learn a new " + Choose(["skill", "language"]) + "!", "I hope I'll become a nice old person.", "I kinda miss my youth!", "I should call " + Choose(["her", "him"]) + " and say \"I love you\"!", "Maybe I should call my parents?", "You can always better yourself.", "Do I really suck at " + Choose(["singing", "painting", "dancing", "writing", "video-games", "maths"]) + "?", "I'm secretly " + Choose(["super-hardcore", "perfectly normal", "perfectly ordinary", "peeking over your shoulder right now", "a wizard", "the smartest person in the world", "the wisest person in the world", "the most important person in the world", "a spider", "a robot", "a midget", "a very ancient ghost", "an extra-terrestrial", "a tree", "a flower", "a shark", "a bear", "my own cousin", "an astral monstrosity", "a secret"]) + "!", "H-here I go!", "This place would look good on fire!", "I don't worry, because I know nothing matters in the end.", "Well, I'm glad nobody can read my mind."]),
		Choose(["Hmm! I should get", "I know what would be awesome...", "Time for", "I need", "You know what? I need", "Know what I need? I'll tell you - "]) + " " + Choose(["some new shoes", "a new TV", "a new computer", "a new car", "a bigger house", "a cooler job", "a lover", "more pets", "a makeover", "a good movie", "a nice dinner in town"]) + "!",
		Choose(["This is the best relationship ever.", "I love being married!", "Marriage isn't as bad as they make it out to be!", "This relationship is awesome!", "I love my family.", "I love doing stuff with my family."]),
		Choose([Choose(["I really, really like", "I can't get enough of", "I'm going to get more of", "I wonder what they put in"]) + " " + Choose(["this hamburger", "this steak", "this salad", "this pasta", "this sandwich", "this pizza", "this meal", "this beer", "this soda"]) + ".", Choose(["Haha, I love that show!", "That show is confusing!", "That show is hilarious.", "That's a silly show, but there's nothing on TV anyway.", "Oooh, my parents used to watch that show!", "There's nothing on TV!", "That movie's plot is hilariously bad.", "I've never seen that movie before!"])])
		], 1.4);
		this.name = str;
	}
	else if (this.name == "*MEDIEVAL MEMORY*") {
		var str = "";
		str += WeightedChoose([
		Choose(["Tending the fields", "Tending the animals", "Harvesting the crops", "Learning to cook", "Learning magic tricks", "Learning alchemy", "Learning how to yield a sword", "Learning how to defend myself", "Learning how to shoot a bow", "Learning about the gods above", "Learning about the spirits that inhabit every thing", "Learning proper manners", "Looking at the skies", "Swimming in the rivers", "Exploring the woods", "Wandering the wild expanses", "Getting lost in the woods", "Travelling to the city", "Running from wild beasts", "Hunting wild beasts", "Taking part in the great hunt", "Tracking beasts", "Sparring"]) + " with my " + Choose(["mother", "father", "parents", "grand-father", "grand-mother", "grand-parents", "uncle", "aunt", "cousin", "sister", "brother", "caretaker", "master"]) + Choose(["", " when I was " + Choose(["a child", "young", Rand(6, 16)])]) + ".",
		"The day I " + Choose(["found my calling", "mastered " + Choose(["the art of blacksmithing", "the art of swordfighting", "the arcane arts", "the arts of writing", "the art of war", "all of the arts and sciences"]), Choose(["finished my training", "finished my education", "was accepted into the guild"]), Choose(["found task as ", "was called to become ", "finally became "]) + Choose(["a cook", "a squire", "an engineer", "a footsoldier", "a bard", "a peasant", "a blacksmith", "a lumberjack", "a monk"])]) + ".",
		Choose(["The sweetness of the lips of", "The fond affection I felt for", "Conversing late into the night with", "The kinship I felt for"]) + " " + Choose(["that one person", "my companion", "my love interest", "the person I courted"]) + " " + Choose(["when I was still a child", "when I was young", "when I was in training"]) + ".",
		"The day I " + Choose(["wed my partner", "became a parent", "lost my father", "lost my mother", "explored the world with " + Choose(["my partner", "my family", "my companions", "my master"]), "learned " + Choose(["I", "my son", "my daughter", "my sister", "my brother", "my father", "my mother"]) + " was ill", "fell victim to disease", "learned we were at war", "learned the war was over", "took part in the war", "helped strike down a dragon", "had to leave our town due to contagious diseases", "was forced to move to a new town", "was forced to become a beggar", "visited our castle", "saw a display of magic at the castle", "broke my " + Choose(["leg", "ankle", "elbow", "knee", "nose"]), "lost " + Choose(["my dog", "my cat", "my cattle", "a valuable trinket", "a magic artifact", "my way in the forest"])]) + "."
		], 1.5);
		this.name = str;
	}
	else if (this.name == "*MEDIEVAL THOUGHT*") {
		var str = "";
		str += WeightedChoose([
		Choose(["Today was a fine day.", "Many things happened on this day.", "What an eventful week this has been.", "It's been a good year so far.", "So much to do, so little time.", "I was born too soon.", "I'm still young. I'll manage.", "I would still be " + Choose(["an adventurer", "a bandit", "a traveller", "a travelling merchant", "a hunter", "a courrier"]) + " if not for that " + Choose(["witch", "ambush years ago", "dragon", "new king", "stupid accident", "unfortunate wound"]) + ".", "What a surprising world we live in.", "Hopefully next year's crops will be fruitful.", "What hides yonder?", "What lies yonder, I wonder.", "So many things out of my comprehension.", "I want to see more of this world.", "I am sworn to carry this burden.", "I'll " + Choose(["ready my spells", "grab my sword", "grab my axe", "grab my shield", "pack my things"]) + " and go on an adventure.", "I will " + Choose(["compose a sonnet", "tell the tale", "write a saga", "compose a song"]) + " of " + Choose(["witches", "princesses", "adventure", "fate", "distant kingdoms", "unicorns", "knights", "bards", "swords", "love"]) + " and " + Choose(["wizards", "princes", "dragons", "magic", "paladins", "warlocks", "dungeons", "destruction", "monsters", "friendship"]) + "!", "I want to travel and see " + Choose(["the unicorns", "the dinosaurs", "a dragon", "the steam monsters", "the goblin kingdoms", "the dwarves in the mountains", "pixies", "fairies", "catpeople", "sharkpeople", "dogpeople", "the troll pits", "the wizard kingdom", "the footfaces", "the cephalites", "the gembabies"]) + "!", "What strange and terrifying creatures could live in the distant lands?", "I've heard so many stories about the things that live in the farlands.", "Thank our star, I feel fine now.", Choose(["She", "He", "They"]) + " " + Choose(["will regret it", "will regret saying that", "will regret doing that", "must pay, somehow", "will get what's coming", "will get what is deserved", "will see how right I was", "will not hold me back any longer", "will regret laughing at me"]) + ".", Choose(["Our star will guide us throughout.", "I trust our star to guide us in the right direction.", "I trust our star to point us to the right choices."]), "I need to " + Choose(["find", "see", "consult"]) + " " + Choose(["a physician", "a witch", "a wizard", "an apothecary", "an exorcist", "a priest"]) + ".", Choose(["What is that smoke on the horizon?", "That new moon keeps getting bigger.", "Will the court wizards keep us safe?", "The Entities are due soon.", "All of our cattle is getting sick. What's happening?", "I don't want to take part in another sacrifice.", "Let's hope that sacrifice was worth it.", "I hate those dark rituals.", "I hope the liches will leave us alone this year.", "I keep finding these weird stones.", "Some must fight, so that all may be free."])])
		], 1.1);
		this.name = str;
	}
	else if (this.name == "*ANCIENT MEMORY*") {
		var str = "";
		str += WeightedChoose([
		Choose(["Scouting for wild beasts", "Tending the fire", "Chopping wood", "Learning the secrets of fire", "Learning the shamanic ways", "Scouting the wilderness for resources", "Searching for fresh water", "Taking part in the great hunt", Choose(["Hunting wild", "Tracking", "Running from wild", "Ambushing", "Making pelts from", "Skinning", "Slicing the meat off"]) + " " + Choose(["mammoths", "saber-toothed cats", "mountain lions", "wooly rhinoceroses", "wolves", "aurochs", "rabbits"]), "Bringing our catch back to the settlement", "Harvesting wild berries", "Harvesting wild grain", "Fetching water", "Learning how to throw a spear", "Learning how to use a harpoon", "Learning how to sculpt the stone", "Learning about the spirits", "Hiding from wild beasts", "Staring at birds in the sky", "Looking at the stars at night", "Looking at the skies", "Swimming in the rivers", "Exploring the woods", "Wandering the wild lands", "Getting lost in the woods"]) + " with my " + Choose(["mother", "father", "family", "tribe", "sister", "brother"]) + Choose(["", " when I was " + Choose(["a child", "younger"])]) + ".",
		"The day I " + Choose(["followed the path of my ancestors", "mastered " + Choose(["the art of stonecarving", "the art of woodcarving", "the art of making fire", "the shamanic way", "the art of painting images on cave walls", "the techniques of spear-throwing", "hunting"])]) + ".",
		Choose(["The affection I felt for", "Talking late into the night with", "The kinship I felt for"]) + " " + Choose(["my mate", "my friend", "my friends", "my tribe"]) + " " + Choose(["when I was still a child", "when I was young", "when I was in training", "when I was on that great hunt"]) + ".",
		"The day I " + Choose(["had my son", "had my daughter", "lost my father", "lost my mother", "became the last of my tribe and had to find a new tribe to take me in", "became accepted into a new tribe", "explored the wilderness with " + Choose(["my mate", "my friend", "my tribe"]), "realized " + Choose(["I", "my son", "my daughter", "my father", "my mother"]) + " was sick", "fell sick", "encountered members of another tribe", "had a skirmish with another tribe", "helped strike down a wild beast", "almost starved", "found a new way to cut rocks", "broke my " + Choose(["leg", "ankle", "elbow", "knee", "nose"]), "got lost in the forest"]) + "."
		], 1.5);
		this.name = str;
	}
	else if (this.name == "*ANCIENT THOUGHT*") {
		var str = "";
		str += WeightedChoose([
		Choose(["Today. Nice day.", "Many things, today.", "Good year so far. Not many dead children.", "I sure hope wolves don't eat my baby again.", "Family comes back from hunt soon. Right?", "Busy. Always busy.", "I was born too soon.", "I am young still. So much to learn!", "I must stay home because of wound. Total baloney.", "Spoiled meat and no fire is utter baloney.", "Beasts are getting scarce. Absolute baloney.", "The spirits must hate me. Only explanation.", "Oh, my aching head.", "No. I don't want.", "This displeases me.", "Sun setting soon. Must ready the fire.", "We mustn't do that mistake with the fire again.", "We live in surprising world.", "Many more hunts to come.", "What lies beyond hills?", "Does sun sleep behind mountains?", "I do not comprehend many things. But I will try.", "This world. I want to see more of it.", "I must " + Choose(["sharpen spears for next hunt", "prepare for next hunt", "tend to my children now", "get ready for big hunt", "get tools ready for tomorrow"]) + ".", "I am curious. About distant things.", "I don't feel so sick anymore.", "I won't eat raw rabbit again.", Choose(["She", "He", "They"]) + " " + Choose(["will regret it", "will regret saying that", "will regret doing that", "must pay", "will get what's coming", "will get what is deserved", "will see how right I was", "will not hold me back any longer", "will regret laughing at me"]) + ".", Choose(["Our shaman will guide us throughout.", "I trust our shaman to guide us in the right direction.", "I trust our shaman to point us to the right choices.", "Where has our shaman gone now?", "I must consult our shaman."]), Choose(["What is smoke on horizon?", "Moon... getting bigger.", "Will our shaman keep us safe?", "The Old Things come back soon.", "All the beasts, they are getting sick. What is happening?", "I do not want to take part in another sacrifice.", "Let us hope sacrifice was worth it.", "I do not like those dark rituals.", "I hope the Old Things will leave us alone this year.", "I keep finding these strange stones.", "I saw the lights. But nobody believes me.", "Oh boy. Shamanic ritual soon. We eat funny mushrooms.", "Have ritual. Smoke plants. All get naked. Good times.", "I shake fist at you, spirits!"]), "I have great idea! " + Choose(["Round stone. Rolls fast, make transportation!", "Shiny rocks. Melt on fire, make weapons!", "Hungry wolves. Make friends, hunt for us!", "Wild seeds. Plant in ground, harvest later!", "Babies. Eat the babies. Free meat!", "Tickle auroch udder, drink free udderjuice!", "Smash rocks found on the beach. Eat insides."])])
		], 1.1);
		this.name = str;
	}
	else if (this.name == "*FUTURE MEMORY*") {
		var str = "";
		str += WeightedChoose([
		Choose(["Spraying the clearpath", "Clearing the tendrils", "Shedding our nanomolts", "Ionizing the biomass", "Collecting stardust", "Equipping my first synchotron", "Brainalyzing each other", "Learning how to use a transponder", "Reversing polarities", "Stepping into that astrodeck", "My first time in microgravity", "Browsing the stars", "Synthesizing new organisms", "That night we spent synthesizing every exotic food we could think of", "Synthesizing new outfits for hours", "Getting our lungs removed", "Riding the claytide", "Searching the moon for clams", "Learning old-timey cooking", "Visualizing old videoverses", "Experiencing that exciting new videoverse", "Losing our headsets and getting lost", "Earning my lifekey", "Inadvertantly spawning starkids"]) + " with my " + Choose(["biocontributor", "biocontributors", "distant biocontributor", "biosibling", "biomate", "biopartner", "nanobro", "nanofamily"]) + Choose(["", "", "", " when I was " + Choose(["a kid", "younger", Rand(30, 120)])]) + ".",
		"The cycle I " + Choose(["learned how to " + Choose(["sprowse a ship", "cook the old-timey way", "love", "kiss", "forgive", "forget", "make friends on the nanoverse", "speak my hundredth language", "play " + Choose(["biano", "prums", "blitar", "praxophone", "videocards"])]), Choose(["graduated videoschool", "graduated videocollege", "got my sprowsing license"]), Choose(["got promoted as ", "got a job as ", "finally became "]) + Choose(["a food pill designer", "a videowriter", "a videoverse engineer", "a thoughtsprayer", "a biomedic", "a nanomedic", "an exobiologist", "a warfare engineer", "a nanophysicist", "a nanoscientist", "a nanogeologist", "a market intendant", "a videoteacher", "a historian", "an archeologist", "a videomusician", "an videoartist", "a bodyenhancer", "a videodancer", "a mindsensor", "a commercial ship sprowser", "a sprowseship engineer", "a nanobot whisperer"])]) + ".",
		Choose(["Kissing", "Cuddling with", "Visualizing videoverses with", "Staying up late with", "Sharing mindsecrets with", "Sharing childhood videomemories with", "Feeling close to", "Laying my arm around"]) + " " + Choose(["that one person", "my biomate", "my biopartner", "my nanobro"]) + " in " + Choose(["videoschool", "sprowsing school", "videocollege"]) + ".",
		"The cycle I " + Choose(["got nanowed", "biocontributed my biodaughter", "biocontributed my bioson", "lost a biocontributor", "went on a trip with " + Choose(["my biomate", "my biopartner", "my nanobro", "my nanofamily", "my biocontributors"]), "learned " + Choose(["I", "my bioson", "my biodaughter", "my biosibling", "a biocontributor of mine"]) + " had a nanodisease", "learned we found a new galaxy", "learned we met a new lifeform", "got a new " + Choose(["leg", "ankle", "elbow", "knee", "nose", "brain"]), "ended my biocontract with my biomate", "lost my " + WeightedChoose(["dwog", "cwat", "bwunny", "namster", "werbil", "bwird", "rubyfish", "fwerret", "giant lizard", "pet clam"], 1.5)]) + ".",
		"That one unforgettable " + Choose(["videoverse", "videomemory", "mindsecret", "cosmotrip", "kiss", "person I met", "lifeform I met", "party"]) + "."
		], 1.5);
		this.name = str;
	}
	else if (this.name == "*FUTURE THOUGHT*") {
		var str = "";
		str += WeightedChoose([
		Choose(["That's nice... that's really nice.", "All of this stuff is so nice.", "So nice, wow.", "I need a couple decades on an exotic planet to cool off.", "Oh boy, they've come up with a new food pill flavor!", "Which food pills will I be ingesting today?", "Who where?", "Those are nice limbs. I bet they cost, uh, a lot, though.", "I think I'll need more nanocredits.", "We've come a long way.", "What will we discover tomorrow?", "This system is getting cramped.", "I wonder - can we ever reverse entropy?", "Meatspace's getting stale for me.", "I'm still at least " + Rand(5, 90) + "% meat!", "I think I'll go visit some biorelatives.", "Ugh. My biocontributors are visiting again.", "One day I'll just upload myself.", Choose(["Needs", "What this planet needs is", "What we need as a species is", "What I need is"]) + " " + Choose(["more clones", "more clams", "more magnets", "more nano", "more nanostuff", "more food pill flavors", "more planets", "more revived extinct species"]) + ".", "These last few centuries have been a little boring.", "I'll say, I'm a little bit bored.", "I don't really give a clam's hinge.", "Everything's so nano.", "That's totally nano.", "I wonder, where's my nanobro right now?", "I hope we don't get assimilated.", "I'm synthesizing " + Choose(["dinosaurs", "trilobites", "businessmen", "birds", "cavemen", "clones", "forbidden food", "more nanogoo", "moonclams", "my own clone", "a synthesizing machine", "nanocredits"]) + " and nobody can stop me!", "I think I lost my " + Choose(["wall-vibrating device", "transponder", "synchotron", "pocket biano", "blitar", "praxophone", "moonclam", "ID key"]) + ".", "Time for " + Choose(["a new brainlobe", "my nanomolting", "a new arm", "a new leg", "a new pelvis", "a new face", "a new nanomate", "my yearly checkup", "some sprowsing", "a good old videoverse"]) + "!", Choose(["That videoverse's plot is barely believable.", "That videoverse has some nicely-written characters.", "I think this videoverse is too large for me.", "I'm getting lost in this videoverse.", "I can't view this videoverse anymore. Way too scary.", "I can't stop crying at that videoverse..."])])
		], 1.5);
		this.name = str;
	}
	else if (this.name == "*PAINTING*") {
		//Paintings ! Most of these end up sounding rather disturbing, I wonder why ?
		var str = "";
		var objs = ["apple", "pear", "peach", "coconut", "banana", "fruit bowl", "teapot", "teacup", "spoon", "knife", "fork", "lemon", "plate of pasta", "baby", "girl", "boy", "person", "young man", "young woman", "man", "woman", "gentleman", "lady", "old person", "businessman", "salesman", "ballerina", "princess", "prince", "wizard", "king", "queen", "witch", "dragon", "knight", "singer", "comedian", "magician", "artist", "cook", "clown", "mime", "dictator", "president", "flower pot", "monster", "creature", "ice cream cone", "cookie", "fridge", "oven", "bunny", "penguin", "llama", "horse", "beetle", "spider", "bird", "duck", "mouse", "bat", "monkey", "whale", "fish", "bear", "shark", "cat", "dog", "wolf", "frog", "snake", "dolphin", "chicken", "brain", "skeleton", "skull", "eyeball", "rose", "hat", "robot", "android", "ghost", "dinosaur", "flower", "tree", "mushroom", "worm", "snowflake", "clock", "violin", "tuba", "saxophone", "harp", "piano", "cosmic abomination", "video game character", "pizza slice", "sphere", "cube", "ovoid", "torus", "square", "triangle", "line", "dot", "pyramid", "abstract blob", "hand", "foot", "beak", "mouth", "eye", "tentacle", "god", "ancestor", "unicorn", "vampire", "midget", "giant", "mountain", "caveman", "feather", "bubble", "detective", "cop", "spinning top", "sponge", "doll", "train", "manbox", "person dressed as an animal", "animal dressed as a person", "moustache", "fetus", "egg", "phone", "television", "computer", "humanoid", "anthill", "beehive", "octopus", "couple", "pair of shoes", "mirror"];
		var adjs = ["an ugly", "a disfigured", "a shapeless", "a faceless", "a rancid", "a misshapen", "a happy", "a happy little", "a plump little", "a fat little", "a sad", "a giant", "a miniature", "a small", "a huge", "an insane", "a crazy", "a big-nosed", "a big-mouthed", "a long-eared", "a scary", "a talking", "a jolly", "a merry", "a bearded", "a tall", "a stout", "a smiling", "a tap-dancing", "a very distressed-looking", "a depressed", "a lovestruck", "a wandering", "an eerie", "a sleepy", "a lonely", "a naked", "a disturbing", "a confused", "an evil-looking", "a headless", "a tidy little", "a moist", "a shrivelled", "an eyeless", "a bulging", "a murderous", "a skinny", "a skeletal", "a ghostly", "a tentacled", "a monstrous", "a horned", "a robotic", "a wooden", "a metal", "a translucent", "a rad", "a pretty cool", "a well-dressed", "a regretful", "a hopeful", "a famous", "an infamous", "a friendly", "a flying", "a winged", "a jealous", "a satisfied", "a spiteful", "an elegant", "a dapper", "a mirrored"];
		var tverbings = ["harassing", "dancing with", "screaming at", "yelling at", "laughing at", "smiling at", "kissing", "licking", "arguing with", "crying over", "eating", "mourning", "devouring", "killing", "seducing", "courting", "hanging out with", "having a chat with", "drawing", "painting", "running towards", "insulting", "stabbing", "tickling", "nibbling", "hugging", "watching", "looking at", "staring at", "pointing at", "running away from", "chasing", "stalking", "following", "holding hands with", "being mean to", "being nice to", "sharing toys with", "tearing apart", "trying to touch", "reaching for", "giving birth to", "cleaning up", "strangling", "exploring with", "lasering", "cutting up", "singing for", "intimidating", "ignoring", "trying to eat", "suffocating under the weight of", "searching for", "fishing for", "trying to lure", "explaining something to", "laying on", "jumping on", "stomping on", "marrying", "rejecting", "playing with", "toying with", "fused to", "softly rubbing", "spreading jam on", "drooling on", "climbing on", "stepping on", "putting a hat on"];
		var verbings = ["dancing", "screaming", "crying", "laughing", "flying", "sleeping", "resting", "thinking", "tap-dancing", "smiling", "meditating", "wiggling", "jiggling", "looking away", "shivering", "shaking", "trembling", "moaning", "drooling", "twitching", "spinning", "melting", "phasing out of existence", "breathing heavily", "dying", "slowly dying", "floating away", "looking terrified", "looking happy as can be", "playing music", "reading a book", "losing all sanity", "slowly coming this way", "stifling laughter", "pretending not to notice anything", "yawning", "singing", "stretching", "taking notes", "teleporting", "drowning", "suffocating", "vomiting", "flying away", "swimming away", "shapeshifting", "changing shapes", "morphing into something else", "tearing apart", "bursting into treats", "trying to escape death", "sobbing sadly", "clapping", "staring at the viewer", "blowing a raspberry", "making a prank call", "looking upset", "looking bored", "looking sad", "jogging", "spilling spaghetti", "looking satisfied", "partying", "skiing", "rotting away", "wearing a hat"];
		var locs = ["in outer space", "in the moonlight", "under a starry night", "under a red sky", "under an otherworldly sky", "in a kitchen", "among the clouds", "in the sky", "on a table", "in a blank room", "outside a house", "in a dark room", "on a bed", "on a couch", "in a living-room", "in front of a house", "on top of a house", "in the ocean", "on the beach", "on an airplane", "on a boat", "in front of a window", "on top of a building", "on the town square", "in a dark cave", "in the forest", "in the desert", "on top of a mountain", "in a snowy landscape", "in a storm", "in an urban setting", "in a metropolis", "in a bar", "at a party", "in a medieval setting", "in a futuristic setting", "in a restaurant", "in an elegant stairway", "in a castle", "in a lavish palace", "in a museum", "in an ancient temple", "in an alien construction", "in an industrial landscape", "on a movie set", "in an opera", "surrounded by strange contraptions", "in a laboratory", "surrounded by geometric patterns", "in an abstract landscape", "in a geometric landscape", "on an alien planet", "in a bloody landscape", "in a bleak landscape", "in a post-apocalyptic landscape", "in an alternate dimension", "in a historic scene", "in a bathroom", "in a romantic setting", "surrounded by ruins", "in a library", "underwater", "in a wasteland", "in a long, dark corridor", "in a dark alley", "surrounded by dancing figures", "surrounded by judging faces", "surrounded by twisted statues", "under the rain", "atop a hill", "in the sewers", "on a moon's surface"];

		str += WeightedChoose(["A painting of", "A portrait of", "A picture of", "A photograph of", "A rendition of", "A sculpture of", "A bas-relief of", "An installation of", "A series of pictures representing", "A series of photographs showing", "A model of", "A dyptic of", "A tryptic of"], 3) + " ";
		str += Choose(["$adj $obj $loc.", "$adj $obj $verbing $loc.", "$adj $obj $loc. The $obj is $verbing.", "$adj $obj and $adj2 $obj2 $loc. The $obj is $tverbing the $obj2.", "$adj $obj and $adj2 $obj2 $loc. The $obj2 is $verbing, and the $obj is $verbing2.", "$adj $obj $tverbing $adj2 $obj2. The $obj2 is $verbing.", "$adj $obj $tverbing $adj2 $obj2 $loc."]);

		str = str.split("$verbing2").join(Choose(verbings));
		str = str.split("$verbing").join(Choose(verbings));
		str = str.split("$tverbing").join(Choose(tverbings));
		str = str.split("$loc").join(Choose(locs));
		str = str.split("$adj2").join(Choose(adjs));
		str = str.split("$obj2").join(Choose(objs));
		str = str.split("$adj").join(Choose(adjs));
		str = str.split("$obj").join(Choose(objs));

		this.name = str;
	}
	else if (this.name == "*NOTE*") {
		//Notes found hidden in people's pockets, etc. Can contain recipes, laundry bills, or creepy observations.
		var str = "";
		str += Choose([
		Choose(["I'm sorry.", "I regret everything.", "I regret nothing!", "Please don't judge me.", "I wish things went otherwise.", "I didn't know what to say.", "Thanks for the dinner." + Choose(["", " It was great.", " I enjoyed it."]), "I have this " + Choose(["neat", "cool", "awesome", "stupid"]) + " idea for " + Choose(["a book", "a joke", "a story", "a film"]) + ". It involves " + Choose(["pirates", "ninjas", "dinosaurs", "unicorns", "robots", "cyborgs", "scientists", "superheroes", "maths"]) + ", " + Choose(["surgeons", "penguins", "dolphins", "cheese", "dragons", "ghosts", "kittens", "sarcasm", "astronomers", "banana peels"]) + " and " + Choose(["spaceships", "vegetarians", "babies", "art", "time travel", "abortions", "philosophy", "computers", "punctuation", "magnets", "geometry", "language"]) + ".", "Socks and sandals. Because I can.", "I like shorts. They're comfy and easy to wear.", "Ski masks are in right now.", "Recipe for happiness :<br>1)?", "How to be happy :<br>-eat well<br>-sleep early<br>-don't ask questions", "Hey.<br>I'll show you something neat :<br>add?seed=*** to the url<br>and replace *** by whatever you want,<br>like person or bookshelf or ocean.", "You will find the strangest things in the oddest places.", "I'd love to learn a foreign language. But they don't seem to exist...", "Alright, how comes everybody in the universe has an american name?"]),
		Choose(["I know who you are.", "I see you.", "Stop looking through my stuff!", "So, I was right after all? You were sifting through my stuff?", "They don't know where I hid it.", "Hi!", "Hello there!", "Pay attention.", "I'm proud of you.", "Don't look behind you.", "It's on its way to find you now.", "Let's not get too meta.", "we are all nested<br>we are all viewed<br>we are all viewing<br>nested<br>nesters<br>nestees<br>all is one", "Well? Did you?", "OH MY GOD<br>WHAT IF SOMEONE IS LOOKING AT ALL THIS RIGHT NOW", "I found myself in a website once.", "But for real though. Nothing is of any significance to anything. There is no overarching story. There is no grand scheme of things. There is only here and now.", "Tell you what. None of this is randomly generated. All this data is actually being transferred from the real world.", "Every time you refresh, a new universe is being born just for you. Think about it before you close the page.", "Did you know? A team of 781 persons worked on this game for 11 years, painstakingly adding in every single thing they could think of.", "aint no universe like a nested universe", "this party gettin started or what", "it aint stopping oh god", "There is no Nested; only shark.", "Nothing makes sense, and nothing ever will.", "There's no real point to anything, and that's okay.", "Hands off, you plebeian!", "Everything is fine. Everything is fine. Everything is fine. There is nothing to worry about. Nothing at all.", "I have a secret for you. Wait no, I don't.", "Tell me a secret. Wait. I don't care.", "(The note is " + Choose(["burnt", "partly-burnt", "washed-off", "bleached", "covered in scribblings", "covered in strange symbols", "covered in intricate patterns", "covered in densely-written instructions"]) + " and indecipherable.)", "This universe is so. Very. Large.", Choose(["A", "B", "C", "D", "E", "F", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]) + Rand(0, 9) + "" + Rand(0, 9) + "" + Rand(0, 9) + "" + Rand(0, 9) + ""]),
		Choose(["Laundry service : $" + Rand(10, 50) + "." + Rand(0, 9) + "0"]),
		Choose(["Recipe :<br>-" + Choose(["toast", "bagel", "breadstick", "garlic bread", "pita", "taco shell"]) + "<br>-" + Choose(["eggs", "ground beef", "fries", "ice cream", "mashed potatoes"]) + "<br>-" + Choose(["chocolate syrup", "whipped cream", "cheese", "mayonaise", "vinegar", "tabasco", "cough syrup", "soy sauce"])])
		]);
		this.name = '"' + str + '"';
	}
	else if (this.name == "*BOOK*") {
		//This is probably my favorite name generator.
		var str = "";
		str += Choose([
		Choose(["All about ", "Of ", "Everything you need to know about", "The definitive guide to", "A beginner's guide to", "How to deal with", "Dealing with", "Hanging out with", "Making friends with", "I fell in love with", "Falling in love with", "The shocking truth about", "They're serious :", "Here's a book about", "A conversation with", "Why we need more", "Nobody understands", "Who cares about", "A study on", "These are not my", "Say no to", "Getting away from", "Getting along with", "Avoiding", "Approaching", "Investigating", "Not worth it :", "Stay away from", "Never underestimate", "Anatomy of", "I hate", "I love", "Who hates", "Who loves", "They were", "Living with", "Cooking with", "Cooking for", Rand(10, 200) + " recipes for", "A few words on", "They know where you live :", "What I think about", "What you didn't know about", "The truth on", "What they don't show you about", "Hey look,", "Aw crap,", "Holy crap,", "Understanding", "Getting rid of", "Delicious", "They're okay :", "Licking", "Reasoning with", "You can't explain that :", "Drawing", "Choosing your", "Night of the", "Day of the", "Revenge of the", "The book of", "The big book of", "Those aren't my", "Hey everyone,", "The chorus of"]) + " " + Choose(["weird", "mutant", "normal", "serious", "elongated", "exploding", "obese", "skinny", "whiny", "stupid", "slimy", "creamy", "tiny", "small", "giant", "gigantic", "ancient", "tasty", "obnoxious", "invisible", "shiny", "boring", "confused", "lost", "lonely", "curly", "frilly", "friendly", "annoying", "space", "green", "orange", "purple", "mauve", "transparent", "stilted", "hairy", "bald", "ridiculous", "demanding", "imaginary", "awkward", "stubborn", "pretentious", "naughty", "nasty", "lazy", "fancy", "magic", "clumsy", "smelly", "bearded", "sleazy", "rabid", "translucent", "edible", "inedible", "foreign", "snotty", "mind-reading", "telepathic", "silent"]) + " " + Choose(["shrimps", "birds", "people", "friends", "relatives", "chappies", "whales", "deities", "cactii", "fungi", "shellfish", "alligators", "jellyfish", "crabs", "hoboes", "machines", "robots", "goats", "cyborgs", "ninjas", "fish", "mushrooms", "mammals", "reptiles", "amphibians", "cephalopods", "spiders", "fossils", "moustaches", "perverts", "mermaids", "squids", "lampreys", "seafood", "turtles", "unicorns", "barbarians", "vampires", "werewolves", "teenagers", "babies", "kids", "ladies", "superheroes", "roads", "hats", "insects", "centaurs"]),
		Choose(["Tales of", "Chronicles of", "A history of", "The gates of", "Objective : ", "Reaching for", "War for", "Battle for", Choose(["Money", "A savior", "A wizard", "A warrior", "A hero", "A prince", "A king", "A princess", "A queen", "Cake", "Booze"]) + " for", "The ruins of", "The prophet of", "Zealots on", "Mysteries of", "The temple of", "The vagrant from", "The nights of", "Conquerors from", "They came from", "The spaceships on", "The soldiers of", "The warrior from", "On the moons of", "Saving", "Glory for", "Rulers of", "Kings of", "Lords of", "Princes of"]) + " " + Choose(["G", "P", "S", "St", "Sh", "B", "F", "K", "Z", "Az", "Oz"]) + Choose(["", "", "", "r", "l"]) + Choose(["u", "o", "a", "e"]) + Choose(["r", "sh", "nd", "st", "sd", "kl", "kt", "pl", "fr", "ck", "sh", "ff", "gg", "l", "lig", "rag", "sha", "pta", "lir", "limd", "lim", "shim", "stel"]) + Choose(["i", "u", "o", "oo", "e", "ee", "y", "a"]) + Choose(["ll", "th", "h", "k", "lm", "r", "g", "gh", "n", "m", "p", "s", "rg", "lg"]),
		Choose([Choose(["How to", "Learning how to", "Teaching yourself how to"]) + " " + Choose(["knit", "dance", "swim", "cook", "play piano", "program", "be cool", "be popular", "be friendly", "be nice", "be smarter", "stay fit", "be succesful", "make money", "be funny", "find a job", "write books", "make a website", "play chess", "do magic tricks", "do yoga", "be happy"]), Choose(["A beginner's guide to", "All about", "Everything you need to know about", "The basics of", "The secrets of", "The definitive guide to", "Advanced techniques for"]) + " " + Choose(["knitting", "dancing", "swimming", "cooking", "playing piano", "programming", "being cool", "being popular", "being friendly", "being nice", "getting smarter", "staying fit", "being succesful", "making money", "being funny", "finding a job", "writing books", "making websites", "playing chess", "magic tricks", "yoga", "happiness"])]),
		Choose(["", Choose(["The", Choose(["The amazing", "The ridiculous", "The heart-warming", "The retarded", "The downright retarded", "The stupid", "The simply stupid", "The insulting", "The repulsive", "The revolting", "The delightful", "The distracting", "The flabbergasting", "The mind-numbing", "The silly", "The clever", "The boring", "The idiotic", "The hilarious", "The endless", "The illustrated"])]) + " " + Choose(["adventure", "adventures", "tale", "tales", "story", "stories", "happenings", "stumblings", "discoveries"]) + " of "]) + Choose([WeightedChoose(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Jeff", "Jack"], 1.5), Choose(["A", "Ana", "Ba", "Bo", "Bra", "Bro", "Bee", "Bea", "Bre", "Bi", "Ca", "Cla", "Co", "Da", "Dee", "Dri", "E", "Fa", "Fi", "Fo", "Fro", "Go", "Ga", "Gri", "Gi", "Gnu", "Ha", "Ho", "I", "Jo", "Ja", "Je", "Kla", "Ko", "Klo", "Lo", "Lee", "Mi", "Ma", "Mu", "Ni", "Nee", "O", "Oo", "Pi", "Pa", "Po", "Qua", "Quo", "Quee", "Ri", "Ra", "Ro", "Sti", "Sla", "Shwa", "Shwo", "To", "Tra", "U", "Vo", "Vro", "Wo", "Wee", "Wi", "Xi", "Y", "Zi", "Zo", "Za"]) + Choose(["bble", "rble", "pple", "ttle", "ffle", "stle", "ffin", "ggin", "ggle", "rgle", "rbus", "rtus", "bus", "tus", "gus", "rtus", "rtos", "zzle"])]) + Choose([" the", ", the " + Choose(["amazing", "stupid", "boring", "diminutive", "giant", "friendly", "psychotic", "crafty", "swift", "cowardly", "mighty", "hilarious", "magic", "midget", "tiny", "clumsy", "lazy", "fancy", "nasty", "naughty", "hairy", "bald", "disgusting", "smelly", "failed", "noble"])]) + " " + Choose(["bard", "poet", "prince", "knight", "wizard", "sorcerer", "tourist", "shopkeeper", "joker", "blacksmith", "butcher", "gardener", "magician", "mage", "astronomer", "alchemist", "merchant", "pirate", "ninja", "shoemaker", "monk"]) + Choose(["", "", "", "", "", " " + Choose(["from space"])]),
		Choose(["A shocking", "An amazing", "A vibrant", "A heart-warming", "A true", "An astounding", "A riveting", "A twisted", "A short", "An elaborate", "An overly elaborate", "A ridiculous", "A hilarious", "A boring", "An illustrated", "A mind-numbing", "A"]) + " " + Choose(["story", "tale", "essay", "book"]) + " " + Choose(["involving", "about", "on the subject of"]) + " " + Choose(["pirates", "ninjas", "dinosaurs", "unicorns", "robots", "cyborgs", "scientists", "superheroes", "maths"]) + ", " + Choose(["surgeons", "penguins", "dolphins", "cheese", "dragons", "ghosts", "kittens", "sarcasm", "astronomers", "banana peels"]) + " and " + Choose(["spaceships", "vegetarians", "babies", "art", "time travel", "abortions", "philosophy", "computers", "punctuation", "magnets", "geometry", "language"]),
		Choose(["", "", Choose(["Meet", "Hey, it's", "The life of", "My life as", "The day I woke up as", "My life with", "Living with", "My friend", "Me and my friend", "My buddy", "Me and my buddy", "My neighbor"]) + " ", Choose(["The", Choose(["The amazing", "The ridiculous", "The heart-warming", "The retarded", "The downright retarded", "The stupid", "The simply stupid", "The insulting", "The repulsive", "The revolting", "The delightful", "The distracting", "The flabbergasting", "The mind-numbing", "The silly", "The clever", "The boring", "The idiotic", "The hilarious", "The endless", "The illustrated"])]) + " " + Choose(["adventure", "adventures", "tale", "tales", "story", "stories", "happenings", "stumblings", "discoveries"]) + " of "]) + Choose([WeightedChoose(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel", "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward", "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Jeff", "Jack"], 1.5), WeightedChoose(["Mary", "Patricia", "Linda", "Barbara", "Elizabeth", "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy", "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon", "Michelle", "Laura", "Sarah", "Kimberly", "Deborah"], 1.5)]) + ", the " + Choose(["weird", "mutant", "normal", "serious", "confused", "lost", "exploding", "obese", "skinny", "whiny", "stupid", "slimy", "tiny", "giant", "ancient", "obnoxious", "invisible", "boring", "annoying", "space", "hairy", "bald", "ridiculous", "imaginary", "awkward", "stubborn", "pretentious", "naughty", "nasty", "lazy", "fancy", "magic", "clumsy", "smelly", "bearded", "lonely", "sleazy", "rabid", "translucent", "edible", "inedible", "foreign", "snotty", "mind-reading", "telepathic", "silent"]) + " " + Choose(["shrimp", "bird", "person", "chap", "whale", "deity", "cactus", "fungus", "alligator", "jellyfish", "crab", "hobo", "machine", "robot", "goat", "cyborg", "ninja", "fish", "mushroom", "spider", "pervert", "mermaid", "squid", "lamprey", "turtle", "unicorn", "barbarian", "vampire", "werewolf", "teenager", "baby", "kid", "lady", "superhero", "insect", "centaur", "shopkeeper", "caveman", "school teacher", "cosmonaut", "scientist", "doctor", "car salesman", "baker", "butcher", "cop", "minister"])
		]);
		if (Rand(0, 10) == 0) str += ", " + Choose(["Part", "Tome", "Volume"]) + " " + Choose(["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]);
		this.name = Title(str);
	}
	else if (this.name == "*CHAR*") {
		var str = "";
		str = "aaaabbccddeeeeffgghhhiijkkllmmnnooppqqrrrssstttuuvwwxyz.,;!?:()-'";
		if (Rand(0, 20) == 0) str += "0123456789*$/#&";
		str = str.split("");
		str = Choose(str);
		if (Rand(0, 30) == 0) str = str.toUpperCase();
		this.name = str;
	}
	else if (this.name == "*MONUMENT*") {
		var str = "";
		str += Choose([
		Choose([Choose([WeightedChoose(["old", "new", "ancient", "historic", "royal", "imperial", "sunken", "painted", "crooked", "slanted", "high", "rising", "underground", "immersed", "twisted", "shaky", "lucky", "glorious", "flying"], 2), WeightedChoose(["great", "big", "large", "giant", "huge", "grand", "gigantic", "colossal", "tremendous", "humongous"], 0.5)]) + " "]) + Choose(["", "", "", Choose(["stone", "gold", "silver", "copper", "bronze", "metal", "white", "black", "blue", "green", "yellow", "red", "grey", "crimson", "azure", "viridian"]) + " "]) + WeightedChoose(["tower", Choose(["", "smiling ", "proud ", "wise ", "horse ", "freedom ", "watching ", "crying ", "singing "]) + "statue", "bridge", "park", "towers", "palace", "statues", "gardens", "parks", "cathedral", "ruins", "wall", "church", "maze", "castle", "radio tower", "arena", "keep", "colossus", "space needle", "house", "villa", "manor", "dungeon", "opera", "pyramid", "cave", "ark", "wheel"], 5)
		]);
		str = "The " + str;
		this.name = Title(str);
	}

	//#endregion

	for (var i in Triggerverse.CustomNameRules) {
		Triggerverse.CustomNameRules[i].bind(this)();
	}

	if (nameParts[1] != undefined) this.name = this.name + nameParts[1];
}

Triggerverse.AddCustomNameRule = function (func) {
	Triggerverse.CustomNameRules.push(func);
}
Triggerverse.AddCustomListRule = function (func) {
	Triggerverse.CustomListRules.push(func);
}

//#endregion
/*=====================================================================================
TRIGGERVERSE VARIABLES
=======================================================================================*/
//#region Variables

/* The nest management state. */
Triggerverse.NestState = 0;

Triggerverse.Bookmark = -1;
Triggerverse.CustomNameRules = [];
Triggerverse.CustomListRules = [];

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

