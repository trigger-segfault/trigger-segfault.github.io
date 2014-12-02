
RollercoasterTycoon = function () {
	function listNames(length, names) {
		var list = [];
		for (var i in names) {
			for (var j = 0; j < length; j++) {
				list.push(names[i] + " " + (j + 1));
			}
		}
		return list;
	}
	function listThoughts(length, sentences, rideSentences, baseSentences, rideNames, stallNames) {
		var list = [];
		for (var i in baseSentences) {
			for (var j = 0; j < 20; j++)
				list.push(baseSentences[i]);
		}
		for (var i in rideSentences) {

			for (var j in rideNames) {
				for (var k = 0; k < length; k++) {
					list.push(rideSentences[i][0] + " " + rideNames[j] + " " + (k + 1) + " " + rideSentences[i][1]);
				}
			}
		}
		for (var i in sentences) {
			for (var j in rideNames) {
				for (var k = 0; k < length; k++) {
					list.push(sentences[i][0] + " " + rideNames[j] + " " + (k + 1) + " " + sentences[i][1]);
				}
			}
			for (var j in stallNames) {
				for (var k = 0; k < length; k++) {
					list.push(sentences[i][0] + " " + rideNames[j] + " " + (k + 1) + " " + sentences[i][1]);
				}
			}
		}
		return list;
	}

	new Thing("theme park", ["guests", /*"staff",*/ "rides", "stalls"]);
	new Thing("rides", ["ride,4-12"]);
	new Thing("stalls", ["stall,2-5"]);
	new Thing("ride", ["guests on ride", "wood", "nails", "metal"],
		listNames(6, [
			"Wooden Rollercoaster", "Gigacoaster", "Flying Swings", "Haunted House", "Death Coaster", "Elevator", "Wild Mouse", "Corkscrew Rollercoaster", "Ferris Wheel", "Chairlift", "Merry-go-round",
			"Junior Rollercoaster", "Monorail", "Mr Bones Wild Ride", "Log Flume"
		])
	);
	new Thing("stall", ["wood", "nails", "metal"],
		listNames(6, [
			"Bathroom", "Burgur Stall", "Pizza Stall", "Lemonade Stall", "Drink Stall", "Information Kiosk", "Sunglasses Stall"
		])
	);
	new Thing("guests", ["guest,12-24"]);
	new Thing("guests on ride", ["guest,3-7"]);
	new Thing("guest", ["favorite ride", "guest thoughts", "body"], listNames(40, ["guest"]));
	new Thing("guest thoughts", ["guest thought,1-4"], "thoughts");
	new Thing("guest thought", [],
		listThoughts(6, [
			["I'm not paying for", "."], ["", "is really good value."]
		], [
			["I want to get off", "."], ["", "looks too intense for me."], ["I want to go on something more exciting than", "."]
		], [
			"This park is really clean and tidy.", "I already have an umbrella.", "I feel sick.", "I have to go to the bathroom.", "I want to go home."
		], [
			"Wooden Rollercoaster", "Gigacoaster", "Flying Swings", "Haunted House", "Death Coaster", "Elevator", "Wild Mouse", "Corkscrew Rollercoaster", "Ferris Wheel", "Chairlift", "Merry-go-round",
			"Junior Rollercoaster", "Monorail", "Mr Bones Wild Ride", "Log Flume"
		], [
			"Bathroom", "Burgur Stall", "Pizza Stall", "Lemonade Stall", "Drink Stall", "Information Kiosk", "Sunglasses Stall"
		])
	);
	new Thing("favorite ride", ["favorite ride name"]);
	new Thing("favorite ride name", [],
		listNames(6, [
			"Wooden Rollercoaster", "Gigacoaster", "Flying Swings", "Haunted House", "Death Coaster", "Elevator", "Wild Mouse", "Corkscrew Rollercoaster", "Ferris Wheel", "Chairlift", "Merry-go-round",
			"Junior Rollercoaster", "Monorail", "Mr Bones Wild Ride"
		])
	);


	Things["city"].contains.push("theme park,30%");

	CleanThings();
}

RollercoasterTycoon();
