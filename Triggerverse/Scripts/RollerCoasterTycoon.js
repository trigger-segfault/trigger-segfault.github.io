/*=====================================================================================
ROLLERCOASTER TYCOON MOD
=======================================================================================*/

// Author:       Robert Jordan

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
	var name = 'RollerCoasterTycoon';
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
ROLLERCOASTER TYCOON DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
RollerCoasterTycoon = {};
/* True if the mod has been loaded. */
RollerCoasterTycoon.Loaded = false;

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON INITIALIZATION
=======================================================================================*/
//#region Initialization

/* The nest management state. */
RollerCoasterTycoon.Init = function () {

	IntervalUntilAllLoaded(['Triggerverse'], function () {

		RollerCoasterTycoon.Loaded = true;

		RollerCoasterTycoon.LoadThings();
	});
}

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON THINGS
=======================================================================================*/
//#region Things

RollerCoasterTycoon.LoadThings = function () {
	
	for (var i in RollerCoasterTycoon.GuestNames) {
		RollerCoasterTycoon.GuestNames[i] += " *RCT_INITIAL*.";
	}
	/*for (var i in RollerCoasterTycoon.RideNames) {
		RollerCoasterTycoon.GuestNames[i] += " *RCT_NUMBER*";
	}
	for (var i in RollerCoasterTycoon.StallNames) {
		RollerCoasterTycoon.GuestNames[i] += " *RCT_NUMBER*";
	}*/

	new Thing("theme park", ["guests", "staff", "rides", "stalls"]);
	new Thing("rides", ["ride,4-16"]);
	new Thing("stalls", ["stall,3-7"]);

	new Thing("ride", ["guests on ride", "metal", "wood", "nails"], ["*RCT_RIDE*"]);
	new Thing("stall", ["wood", "nails", "metal"], ["*RCT_STALL*"]);

	new Thing("guests", ["guest,12-24"]);
	new Thing("staff", ["handyman,1-8", "mechanic,1-4", "security guard,0-3", "entertainer,1-8"]);

	new Thing("handyman", ["handyman tasks", "body"], ["Handyman *RCT_NUMBER*"]);
	new Thing("mechanic", ["mechanic tasks", "body"], ["Mechanic *RCT_NUMBER*"]);
	new Thing("security guard", ["security guard tasks", "body"], ["Security Guard *RCT_NUMBER*"]);
	new Thing("entertainer", ["entertainer costume", "body"], ["Entertainer *RCT_NUMBER*"]);

	new Thing("handyman tasks", ["clean paths", "empty bins,50%", "water gardens,50%", "mow grass,50%"], "tasks");
	new Thing("clean paths", []);
	new Thing("empty bins", []);
	new Thing("water gardens", []);
	new Thing("mow grass", []);

	new Thing("mechanic tasks", ["fix rides", "inspect rides,50%"], "tasks");
	new Thing("fix rides", []);
	new Thing("inspect rides", []);

	new Thing("security guard tasks", ["patrol"], "tasks");
	new Thing("patrol", [], ["patrol park", "patrol area"]);

	new Thing("entertainer costume", ["costume"], "costume");
	new Thing("costume", [], RollerCoasterTycoon.EntertainerCostumes);

	new Thing("guests", ["guest,12-24"]);
	new Thing("guests on ride", ["guest,3-8"]);

	new Thing("guest", ["guest mood", "favorite ride", "guest thoughts", "body"], RollerCoasterTycoon.GuestNames);

	new Thing("guest mood", ["mood"], "mood");
	new Thing("mood", [], RollerCoasterTycoon.GuestMoods);

	new Thing("guest thoughts", ["guest thought,1-4"], "thoughts");
	new Thing("guest thought", [], RollerCoasterTycoon.GuestThoughts);

	new Thing("favorite ride", ["favorite ride name"]);
	new Thing("favorite ride name", [], ["*RCT_RIDE*"]);


	Things["city"].contains.push("theme park,25%");
	CleanThings();

	Triggerverse.AddCustomNameRule(RollerCoasterTycoon.NameRules);
	Triggerverse.AddCustomListRule(RollerCoasterTycoon.ListRules);

}

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON RULES
=======================================================================================*/
//#region Rules

RollerCoasterTycoon.NameRules = function () {

	if (this.name.indexOf("*RCT_INITIAL*") != -1) {
		this.name = this.name.replace("*RCT_INITIAL*", Choose(RollerCoasterTycoon.GuestInitials));
	}
	if (this.name.indexOf("*RCT_NUMBER*") != -1) {
		this.name = this.name.replace("*RCT_NUMBER*", 1 + Math.floor(Math.random() * 10));
	}
	if (this.name.indexOf("*RCT_RIDE*") != -1) {
		this.name = this.name.replace("*RCT_RIDE*", Choose(RollerCoasterTycoon.RideNames) + " " + (1 + Math.floor(Math.random() * 10)));
	}
	if (this.name.indexOf("*RCT_STALL*") != -1) {
		this.name = this.name.replace("*RCT_STALL*", Choose(RollerCoasterTycoon.StallNames) + " " + (1 + Math.floor(Math.random() * 10)));
	}
	if (this.name.indexOf("*RCT_ITEM*") != -1) {
		this.name = this.name.replace("*RCT_ITEM*", Choose(RollerCoasterTycoon.ItemNames));
	}
}

RollerCoasterTycoon.ListRules = function () {

	if (this.type.name == "mood") {
		document.getElementById("div" + this.n).innerHTML =
		'<div style="background-image: url(\'' + GetModURL() + 'Images/' + RollerCoasterTycoon.GuestMoodIcons[this.name] + '.png\'); width: 27px; height: 25px; display: inline-block;"></div>' +
		'<span class="emptyThing" style="vertical-align: 35%; margin-left: 7px;">' + this.name + '</span>' +
		'';
	}
}

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON STAFF NAMES
=======================================================================================*/
//#region Staff Names

RollerCoasterTycoon.EntertainerCostumes = [
	"panda suit", "tiger suit", "elephant suit", "astronaut suit", "snowman suit", "viking costume", "roman warrior costume"
];


//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON RIDE NAMES
=======================================================================================*/
//#region Ride Names

RollerCoasterTycoon.RideNames = [
	// Transport
	"Chairlift", "Elevator", "Miniature Railway", "Monorail", "Suspended Monorail", "Trams",

	// Gentle Rides
	"Car Ride", "Circus", "Crooked House", "Dodgems", "Double Deck Carousel", "Double-deck Observation Tower", "Ferris Wheel", "Fun House", "Ghost Train", "Hall Of Mirrors", "Haunted House",
	"Hedge Maze", "Merry-Go-Round", "Mini Gold", "Mini Helicopters", "Observation Tower", "Space Rings", "Spiral Slide", "Vintage Cars",

	// Thrill Rides
	"3D Cinema", "Enterprise", "Go-Karts", "Launched Freefall", "Magic Carpet", "Motion Simulator", "Pirate Ship", "Roto-Drop", "Swinging Inverter Ship", "Top Spin", "Twist",

	// Water Rides
	"Bumper Boats", "Canoes", "Dinghy Slide", "Jet Skis", "Log Flume", "River Rafts", "River Rapids", "Rowing Boats", "Splash Boats", "Submarine Ride", "Swans", "Water Tricycles",

	// Rollercoasters
	"Air Powered Vertical Coaster", "Bobsleigh Coaster", "Compact Inverted Coaster", "Corkscrew Roller Coaster", "Floorless Roller Coaster", "Flying Roller Coaster", "Flying Turns", "Giga Coaster",
	"Heartline Twister Coaster", "Hyper Coaster", "Hyper-Twister Roller Coaster", "Inverted Hairpin Coaster", "Inverted Impulse Coaster", "Inverted Roller Coaster", "Inverted Shuttle Coaster",
	"Junior Roller Coaster", "LIM Launched Roller Coaster", "Lay-Down Roller Coaster", "Looping Roller Coaster", "Mine Train Coaster", "Mine Ride", "Mini Roller Coaster", "Mini Suspended Coaster",
	"Mini Suspended Flying Coaster", "Motorbike Races", "Multi-Dimension Roller Coaster", "Reverse Freefall Roller Coaster", "Reverser Roller Coaster", "Spinning Wild Mouse", "Spiral Roller Coaster",
	"Stand-Up Roller Coaster", "Stand-Up Twister Coaster", "Suspended Roller Coaster", "Twister Roller Coaster", "Vertical Roller Coaster", "Virginia Reel", "Water Coaster", "Wild Mouse Roller Coaster",
	"Wooden Roller Coaster", "Wooden Wild Mine Ride", "Wooden Wild Mouse"
];

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON STALL NAMES
=======================================================================================*/
//#region Stall Names

RollerCoasterTycoon.StallNames = [
	"Beef Noodles Stall", "Burger Bar", "Balloon Stall", "Cash Machine", "Chicken Nuggets Stall", "Cookie Shop", "Cotton Candy Stall", "Drink Stall", "First Aid Room", "Fried Rice Noodles Stall",
	"Fruity Ices Stall", "Funnel Cake Shop", "Hat Stall", "Hot Chocolate Stall", "Iced Tea Stall", "Lemonade Stall", "Pizza Stall", "Popcorn Stall", "Pretzel Stall", "Restroom",
	"Roast Sausage Stall", "Sea Food Stall", "Souvenir Stall", "Soybean Milk Stall", "Star Fruit Drink Stall", "Sub Sandwich Stall", "Sujongkwa Stall", "Sunglasses Stall", "T-Shirt Stall",
	"Toffee Apple Stall", "Wondon Soup Stall"
];
RollerCoasterTycoon.ItemNames = [
	"umbrella", "burger", "drink", "lemonade", "pizza", "park map", "balloon"
];

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON GUEST MOODS
=======================================================================================*/
//#region Guest Moods

RollerCoasterTycoon.GuestMoods = [
	"very happy", "happy", "satisfied", "neutral", "disappointed", "unhappy", "very unhappy", "unwell", "sick", "very sick", "tired", "very tired", "angry"
];

RollerCoasterTycoon.GuestMoodIcons = {
	"very happy":	"Veryhappy",
	"happy":		"Happyguest",
	"satisfied":	"Satisfiedguest",
	"neutral":		"Neutralguest",
	"disappointed":	"Disappointedguest",
	"unhappy":		"Unhappyguest",
	"very unhappy":	"Veryunhappyguest",
	"unwell":		"Unwell",
	"sick":			"Sick",
	"very sick":	"Verysick",
	"tired":		"Tired",
	"very tired":	"Verytired",
	"angry":		"Angryguest"
};

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON GUEST THOUGHTS
=======================================================================================*/
//#region Guest Thoughts

RollerCoasterTycoon.GuestThoughts = [
	// Positive
	"This park is really clean and tidy",
	"The scenery here is wonderful",
	"The jumping fountains are great",
	"The music is nice here",
	"*RCT_RIDE* was great!",
	"*RCT_RIDE* is really good value!",
	"This *RCT_ITEM* from *RCT_STALL* is really good value!",

	// Informative
	"I've already got a *RCT_ITEM*.",
	"I'm not hungry.", "I'm not thirsty.",
	"I'm hungry.", "I'm thirsty.",
	"I'm tired", "I'm very tired",
	"I want to go home",
	"I need to go to the bathroom",
	"I feel sick!", "I feel very sick!",
	"I'm running out of cash!",
	"I've spent all my money",
	"I can't afford *RCT_RIDE*.",
	"I can't afford *RCT_ITEM*.",
	"I'm not going on *RCT_RIDE* while it's raining!",
	"*RCT_RIDE* looks too intense for me!",
	"I want to go on something more thrilling than *RCT_RIDE*",
	"Help! I'm drowning!",

	// Negative
	"I can't find *RCT_RIDE*!",
	"I can't find *RCT_STALL*!",
	"I can't find the park exit!",
	"I'm not paying that much to go on *RCT_RIDE*!",
	"I'm not paying that much for *RCT_STALL*!",
	"The vandalism here is really bad",
	"The litter here is really bad",
	"This path is disgusting!",
	"It's too crowded here",
	"I'm lost!",
	"I want to get off *RCT_RIDE*!",
	"I'm not going on *RCT_RIDE* - It isn't safe!",
	"I've been queuing for *RCT_RIDE* for ages",

	// Misc
	"I've not finished my *RCT_ITEM* yet.",
	"I have the strangest feeling someone is watching me!",
	"Wow, a new ride's being built!"
];

//#endregion
/*=====================================================================================
ROLLERCOASTER TYCOON GUEST NAMES
=======================================================================================*/
//#region Guest Names

RollerCoasterTycoon.GuestInitials = [
	"B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "W"
];
RollerCoasterTycoon.GuestNames = [
	"Aaron", "Abdul", "Abraham", "Abu", "Adam", "Adrian", "Adriane", "Aileen", "Aisha", "Akiko", "Akira", "Al", "Ali", "Alan", "Alana", "Albert", "Alberta", "Alec", "Alesia", "Alex", "Alexa",
	"Alexander", "Alexandra", "Alexis", "Alf", "Alfonso", "Alfred", "Alice", "Alicia", "Alison", "Alistair", "Allan", "Allen", "Allison", "Allister", "Alma", "Alvin", "Alyson", "Amanda", "Amber",
	"Amilio", "Amos", "Amy", "Ana", "Anabel", "Anastasia", "Andie", "Andrea", "Andres", "Andrew", "Andy", "Angel", "Angela", "Angelica", "Angie", "Angus", "Anika", "Ann", "Anna", "Anne", "Annette",
	"Annie", "Annika", "Anthony", "Anton", "Antonio", "April", "Archer", "Archie", "Arlene", "Arnie", "Arnold", "Art", "Arthur", "Asaf", "Ashley", "Astrid", "Aubrey", "Austin", "Austine", "Avon",
	"Avril", "Axel", "Aziz", "Bailey", "Barbara", "Barney", "Barry", "Bart", "Barton", "Baxter", "Beck", "Becket", "Becky", "Belinda", "Bella", "Belle", "Ben", "Benjamin", "Benny", "Bernadette",
	"Bernard", "Bernice", "Bess", "Beth", "Bethany", "Bette", "Betty", "Bernard", "Bernardette", "Bernice", "Berty", "Bev", "Beverly", "Beverley", "Bianca", "Bill", "Billie", "Billy", "Bjorn",
	"Blaire", "Blake", "Blanche", "Bo", "Bob", "Bobbie", "Bobby", "Bonnie", "Boris", "Brad", "Bradley", "Brady", "Brandi", "Brandon", "Brandy", "Brenda", "Brendan", "Brendon", "Brent", "Brett",
	"Brian", "Bridgit", "Brigitte", "Britney", "Bruce", "Bruno", "Brutus", "Bryan", "Buck", "Bucky", "Bug", "Burton", "Byron", "Cailin", "Caitlyn", "Cal", "Caley", "Callum", "Calvin", "Cameron",
	"Camille", "Campbell", "Candy", "Carl", "Carla", "Carlene", "Carlos", "Carmela", "Carmen", "Carol", "Carole", "Caroline", "Carolyn", "Carrie", "Casey", "Cassandra", "Cassey", "Cassie",
	"Catherina", "Catherine", "Cathy", "Caz", "Cecelia", "Cecil", "Cecille", "Ceilidh", "Celeste", "Chad", "Charlene", "Charles", "Charlie", "Charlotte", "Chelsea", "Cher", "Cheri", "Cheryll", "Chip",
	"Chloe", "Chris", "Christel", "Christian", "Christie", "Christina", "Christine", "Christopher", "Chuck", "Cindy", "Clark", "Clair", "Claire", "Clara", "Clarabell", "Claude", "Claudette",
	"Claudia", "Clayton", "Cliff", "Clifford", "Clint", "Clive", "Clyde", "Codey", "Cody", "Colin", "Colleen", "Connie", "Coral", "Corina", "Craig", "Curtis", "Cynthia", "Cyril", "Darby", "Daisy",
	"Dale", "Damien", "Damon", "Dan", "Dana", "Daniel", "Danielle", "Danni", "Danny", "Daphne", "Darla", "Darlene", "Darrell", "Darren", "Darryl", "Dave", "David", "Davie", "Davis", "Dawn", "Dean",
	"Debbie", "Debby", "Deborah", "Debra", "Debs", "Deidre", "Delores", "Denise", "Dennis", "Denzel", "Derek", "Desmond", "Diana", "Diane", "Dianna", "Dick", "Dillon", "Dina", "Dominic", "Dominik",
	"Don", "Donald", "Donna", "Donovan", "Doreen", "Doris", "Dorothy", "Doug", "Dougal", "Douglas", "Doyle", "Drew", "Duane", "Dudley", "Duncan", "Dwight", "Dylan", "Earl", "Ed", "Eddie", "Edgar",
	"Edith", "Edmond", "Edward", "Edwin", "Edwina", "Eileen", "Elaine", "Elina", "Elisa", "Elisabeth", "Eliza", "Elizabeth", "Ella", "Ellen", "Elmer", "Elsie", "Emile", "Emilio", "Emily", "Emma",
	"Emmett", "Enrique", "Eric", "Erica", "Ericka", "Erik", "Erika", "Erin", "Erinn", "Ernest", "Esmeralda", "Esta", "Estella", "Esther", "Ethan", "Eugene", "Eva", "Evan", "Eve", "Evelyn", "Everett",
	"Felix", "Fabio", "Falicia", "Farah", "Felicity", "Fernando", "Fergus", "Fidelia", "Finlay", "Fiona", "Fletcher", "Flora", "Florence", "Floyd", "Fly", "Frances", "Francesca", "Francis",
	"Francisco", "Frank", "Franklin", "Franky", "Fraser", "Fred", "Freda", "Freddy", "Fuzz", "Gabriel", "Gabriela", "Gail", "Garrett", "Garth", "Gary", "Gavin", "Gayle", "Gene", "Genevieve", "Geoff",
	"Geoffrey", "George", "Gerald", "Geraldine", "Gerard", "Geri", "Gerry", "Gilbert", "Gillian", "Gina", "Ginger", "Giuseppe", "Gladys", "Glen", "Glenda", "Glenn", "Gloria", "Glyne", "Goldie",
	"Gordon", "Grace", "Graeme", "Graham", "Grant", "Grayson", "Greg", "Gregor", "Gregory", "Gretchen", "Gus", "Guy", "Gwen", "Gwendoline", "Hadrian", "Hamish", "Hank", "Hannah", "Hans", "Harley",
	"Harold", "Harry", "Harvey", "Haseem", "Hayley", "Hazel", "Heather", "Hector", "Heidi", "Helen", "Helena", "Henri", "Henry", "Herbert", "Herbie", "Hermann", "Hilda", "Hollie", "Holly", "Homer",
	"Horace", "Howard", "Hugh", "Hugo", "Iain", "Ian", "Imani", "Imelda", "Imran", "Ingrid", "Irene", "Irma", "Irving", "Isaac", "Isabella", "Isabelle", "Ishan", "Isla", "Ivan", "Ivanna", "Ivy",
	"Izola", "Jack", "Jacque", "Jacqueline", "Jacqui", "Jake", "Jakob", "James", "Jacob", "Jan", "Janet", "Jane", "Janice", "Jason", "Jasper", "Jay", "Jayne", "Jean", "Jeanette", "Jeff", "Jeffrey",
	"Jennifer", "Jenny", "Jeremy", "Jerry", "Jesse", "Jessica", "Jessie", "Jessy", "Jill", "Jillian", "Jim", "Jimbo", "Jimmy", "Jo", "Joan", "Joann", "Joanne", "Jock", "Jodi", "Joe", "Joel", "Joelyn",
	"Joey", "Johan", "John", "Johnathan", "Johnnie", "Johnny", "Jolynn", "Jon", "Jonah", "Jonas", "Jonathan", "Joni", "Jonny", "Jordan", "Jorge", "Jose", "Joseph", "Josephine", "Josh", "Joshua",
	"Joyce", "Juan", "Juana", "Juanita", "Judge", "Judie", "Judith", "Judy", "Julia", "Julian", "Julie", "Juliette", "Julio", "Julius", "June", "Justin", "Kaley", "Kaitlyn", "Kandice", "Kara",
	"Kareen", "Karen", "Karl", "Karolyne", "Karri", "Kate", "Katelyn", "Katey", "Kathy", "Katherine", "Kathie", "Kathleen", "Kathryn", "Katie", "Katrina", "Katy", "Katya", "Kay", "Keiko", "Keith",
	"Kelly", "Kelsey", "Ken", "Kenneth", "Kenny", "Kerry", "Kev", "Kevin", "Kieran", "Kim", "Kimberly", "Kiriaki", "Kirk", "Klaus", "Kris", "Krista", "Kristian", "Kristy", "Kurt", "Kurtis", "Kyle",
	"Kylie", "Laila", "Lana", "Lance", "Larry", "Lasse", "Latisha", "Laura", "Lauren", "Lauryn", "Laurie", "Lawrence", "Leah", "Lee", "Leigh", "Len", "Lena", "Lenore", "Leo", "Leon", "Leonard",
	"Leonardo", "Leone", "Leroy", "Les", "Leslie", "Lesley", "Lester", "Lewis", "Liam", "Lillian", "Lilly", "Lily", "Linda", "Lindsay", "Lindsey", "Lisa", "Lita", "Logan", "Lone", "Loren", "Loretta",
	"Lori", "Lorraine", "Lottie", "Louis", "Louise", "Lowell", "Lucas", "Lucy", "Luis", "Luke", "Luther", "Lydia", "Lynn", "Lynne", "Lyssa", "Mabel", "Madeline", "Maggie", "Magnus", "Mahamed",
	"Malcolm", "Mandy", "Manuel", "Marc", "Marcela", "Marci", "Marcia", "Marco", "Marcus", "Marcy", "Margaret", "Margarita", "Maria", "Mariah", "Marian", "Marianna", "Marie", "Marilyn", "Marina",
	"Marion", "Marisa", "Marissa", "Marjorie", "Mark", "Markus", "Marlene", "Marlin", "Marlon", "Marshall", "Martha", "Martin", "Martyn", "Marvin", "Mary", "Mathew", "Matt", "Matthew", "Maude",
	"Maureen", "Maurice", "Mauricio", "Mavis", "Max", "Maxine", "May", "Megan", "Meghan", "Mel", "Melanie", "Melany", "Melinda", "Melissa", "Melody", "Melvin", "Mervin", "Mhairi", "Mia", "Michael",
	"Michelle", "Mick", "Mickey", "Miguel", "Mikael", "Mike", "Mikey", "Miki", "Mikko", "Mildred", "Millie", "Milly", "Milton", "Miranda", "Miriam", "Mirriam", "Mitchell", "Mo", "Molly", "Monica",
	"Monique", "Monty", "Morgan", "Morten", "Moses", "Morris", "Muriel", "Murphy", "Murray", "Mustafa", "Myles", "Myrissa", "Myrtle", "Nadine", "Nancy", "Nanette", "Naomi", "Natalia", "Natalie",
	"Natasha", "Nathan", "Nathaniel", "Neil", "Nellie", "Nelly", "Nelson", "Neville", "Nicholas", "Nichole", "Nick", "Nico", "Nicola", "Nicolas", "Nicole", "Nigel", "Nikia", "Nikki", "Nina", "Noah",
	"Noel", "Norma", "Norman", "Norris", "Norvall", "Olga", "Olive", "Oliver", "Ollie", "Omar", "Oona", "Orve", "Orville", "Oscar", "Otto", "Owen", "Paisley", "Pam", "Pamela", "Pandora", "Pat",
	"Patricia", "Patrick", "Patty", "Paul", "Paula", "Pauline", "Pedro", "Peggy", "Penelope", "Penny", "Perry", "Pete", "Peter", "Phil", "Philip", "Phillip", "Phyllis", "Polly", "Preston", "Qasim",
	"Quentin", "Quinn", "Rachel", "Rae", "Rafael", "Raj", "Raja", "Ralph", "Ramon", "Randal", "Rashid", "Raquel", "Raul", "Ray", "Raymond", "Raymondo", "Rebecca", "Reg", "Regina", "Reginald",
	"Reinhold", "Rene", "Reuben", "Rex", "Rhonda", "Richard", "Rick", "Ricky", "Rita", "Robb", "Robert", "Roberta", "Robin", "Robina", "Robyn", "Robynne", "Rock", "Rockie", "Rod", "Rodney", "Rodrigo",
	"Roland", "Rolf", "Romeo", "Ronald", "Ronan", "Ronnie", "Roger", "Rosalind", "Rosanna", "Rosanned", "Rose", "Rosemary", "Rosetta", "Rosie", "Ross", "Roxanne", "Roy", "Russell", "Rosty", "Ruben",
	"Ruby", "Ruth", "Ryan", "Sabrina", "Sadie", "Sally", "Sam", "Samantha", "Sammy", "Samuel", "Sandra", "Sandy", "Sara", "Sarah", "Sasha", "Saul", "Scot", "Scott", "Sean", "Sebastian", "Sergio",
	"Shakira", "Shannon", "Shari", "Sharnell", "Sharon", "Sharyn", "Shawn", "Shelby", "Shelley", "Sherene", "Sheri", "Sherman", "Sherry", "Shirley", "Sheryl", "Shivani", "Shona", "Sian", "Sid",
	"Sidney", "Simon", "Sindy", "Sinead", "Sofia", "Sonny", "Sonja", "Sonya", "Sophia", "Sophie", "Spencer", "Stacey", "Stan", "Stanley", "Stefan", "Stephen", "Stephanie", "Steve", "Steven",
	"Stewart", "Stuart", "Sue", "Suki", "Susan", "Susana", "Susanne", "Susie", "Suzanne", "Sven", "Sylvester", "Sylvia", "Tabatha", "Tamara", "Tammie", "Tamsin", "Tania", "Tanya", "Tara", "Taylor",
	"Ted", "Teresa", "Terrance", "Terry", "Tess", "Tessa", "Tex", "Thelma", "Theodore", "Theresa", "Thomas", "Tiffany", "Tiger", "Tiko", "Tillie", "Tim", "Timmy", "Timothy", "Tina", "Toby", "Todd",
	"Tom", "Tomaki", "Tommy", "Tonia", "Tonie", "Tony", "Tracy", "Travis", "Trevor", "Tricia", "Trixie", "Troy", "Tucker", "Tyler", "Tyson", "Ulysses", "Uri", "Val", "Valerie", "Vanessa", "Vani",
	"Vaughn", "Velma", "Vernon", "Veronica", "Vicki", "Vicky", "Victor", "Victoria", "Vijay", "Vince", "Vincent", "Vinnie", "Virginia", "Viv", "Vivian", "Viviene", "Wally", "Walt", "Walter", "Walton",
	"Wanda", "Warren", "Wayne", "Wendell", "Wendy", "Wes", "Wesley", "Whitney", "Will", "William", "Willie", "Willis", "Wilson", "Winston", "Wyatt", "Xavier", "Yasmin", "Yogi", "Ysabel", "Yvonne",
	"Zachary", "Zachery", "Zola"
];

//#endregion
/*=====================================================================================
LAUNCH ROLLERCOASTER TYCOON
=======================================================================================*/

RollerCoasterTycoon.Init();
