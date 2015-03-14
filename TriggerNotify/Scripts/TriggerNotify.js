
function GetModURL() {
	var name = 'TriggerNotify';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace('Scripts/' + name + '.js', '');
	return url;
}

TriggerNotify = {};


TriggerNotify.GetResource = function(index) {
	return gamePage.resPool.resources[index];
}

TriggerNotify.ResourceList = function() {
	return gamePage.resPool.resources;
}

TriggerNotify.SetSound = function(name, sound) {
	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		if (name == gamePage.resPool.resources[i].name) {
			TriggerNotify.ResourceSounds[i] = new Audio(GetModURL() + 'Sounds/' + sound);
			break;
		}
	}
}

TriggerNotify.Initialize = function() {
	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		TriggerNotify.Resources[i] = TriggerNotify.GetResource(i).value;
		TriggerNotify.ResourceSounds[i] = TriggerNotify.AlertSound;
	}
	TriggerNotify.SetSound('catnip', 'Catnip.wav');
	TriggerNotify.SetSound('manpower', 'CatPower.wav');
	TriggerNotify.SetSound('coal', 'Coal.wav');
	TriggerNotify.SetSound('culture', 'Culture.wav');
	TriggerNotify.SetSound('faith', 'Faith.wav');
	TriggerNotify.SetSound('gold', 'Gold.wav');
	TriggerNotify.SetSound('iron', 'Iron.wav');
	TriggerNotify.SetSound('kittens', 'Kittens.wav');
	TriggerNotify.SetSound('minerals', 'Minerals.wav');
	TriggerNotify.SetSound('oil', 'Oil.wav');
	TriggerNotify.SetSound('science', 'Science.wav');
	TriggerNotify.SetSound('titanium', 'Titanium.wav');
	TriggerNotify.SetSound('unobtainium', 'Unobtainium.wav');
	TriggerNotify.SetSound('uranium', 'Uranium.wav');
	TriggerNotify.SetSound('wood', 'Wood.wav');
	TriggerNotify.SetSound('zebras', 'Zebras.wav');
	TriggerNotify.SetSound('manpower', 'CatPower.wav');
	
	TriggerNotify.AlertSound.play();
	console.log('TriggerNotify Loaded');
}

TriggerNotify.Update = function() {

	var soundPlayed = false;

	for (var i = 0; i < gamePage.resPool.resources.length; i++) {
		var res = TriggerNotify.GetResource(i);
		var newValue = res.value;
		if (newValue != TriggerNotify.Resources[i]) {
			TriggerNotify.Resources[i] = newValue;
			if (newValue >= res.maxValue && res.maxValue > 0 && !soundPlayed) {
				TriggerNotify.ResourceSounds[i].play();
				//TriggerNotify.AlertSound.play();
				soundPlayed = false;
			}
		}
	}

}

TriggerNotify.Resources = [];
TriggerNotify.ResourceSounds = [];
TriggerNotify.AlertSound  = new Audio("https://gist.github.com/pernatiy/38bc231506b06fd85473/raw/beep-30.mp3");

TriggerNotify.Initialize();
setInterval(TriggerNotify.Update, 1500);
