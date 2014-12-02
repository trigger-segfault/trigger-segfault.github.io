


var theme = 'normal';
var shower = 0;
var mainURL = 'Webpage/';

function PickBackground(mainPage, url) {
	mainURL = url;

	var rand = Math.random();
	var rand2 = Math.random();
	var step = 0.035;
	var step2 = 0.05;

	var width = window.innerWidth;
	if (width <= 750) {
		document.getElementById('milk').style.display = 'none';

		if (rand2 < step2 * 2) {
			shower = 1;
			document.getElementById('bgOverlay').style.backgroundImage = 'url("' + mainURL + 'Images/cookieShower1.png")';
		}
		else if (rand2 < step2 * 2) {
			shower = 2;
			document.getElementById('bgOverlay').style.backgroundImage = 'url("' + mainURL + 'Images/cookieShower2.png")';
		}
		else if (rand2 < step2 * 2.1) {
			shower = 3;
			document.getElementById('bgOverlay').style.backgroundImage = 'url("' + mainURL + 'Images/cookieShower3.png")';
		}
	}

	
	if (rand < step * 1) {
		theme = 'store';
		document.body.style.backgroundImage = 'url("' + mainURL + 'Images/panelBG.png")';
		if (mainPage) {
			document.getElementById('iconFeatures').style.backgroundPosition = 'calc(48px * -3) calc(48px * -5)';
			document.getElementById('iconScreenshots').style.backgroundPosition = 'calc(48px * -13) calc(48px * -5)';
			document.getElementById('iconCompatibility').style.backgroundPosition = 'calc(48px * -11) calc(48px * -9)';
			document.getElementById('iconGetTriggerCookies').style.backgroundPosition = 'calc(48px * -12) calc(48px * -0)';
			document.getElementById('iconSource').style.backgroundPosition = 'calc(48px * -16) calc(48px * -5)';
			document.getElementById('iconContact').style.backgroundPosition = 'calc(48px * -17) calc(48px * -5)';
		}
	}
	else if (rand < step * 3) {
		theme = 'ascend';
		document.body.style.backgroundImage = 'url("' + mainURL + 'Images/starbg.jpg")';
		if (mainPage) {
			document.getElementById('iconFeatures').style.backgroundPosition = 'calc(48px * -20) calc(48px * -7)';
			document.getElementById('iconScreenshots').style.backgroundPosition = 'calc(48px * -19) calc(48px * -7)';
			document.getElementById('iconCompatibility').style.backgroundPosition = 'calc(48px * -16) calc(48px * -7)';
			document.getElementById('iconGetTriggerCookies').style.backgroundPosition = 'calc(48px * -15) calc(48px * -7)';
			document.getElementById('iconSource').style.backgroundPosition = 'calc(48px * -17) calc(48px * -7)';
			document.getElementById('iconContact').style.backgroundPosition = 'calc(48px * -21) calc(48px * -7)';
		}
	}
	else if (rand < step * 4.5) {
		theme = 'evil';
		document.body.style.backgroundImage = 'url("' + mainURL + 'Images/grandmas2.jpg")';
		if (mainPage) {
			document.getElementById('iconFeatures').style.backgroundPosition = 'calc(48px * -8) calc(48px * -9)';
			document.getElementById('iconScreenshots').style.backgroundPosition = 'calc(48px * -5) calc(48px * -9)';
			document.getElementById('iconCompatibility').style.backgroundPosition = 'calc(48px * -4) calc(48px * -9)';
			document.getElementById('iconGetTriggerCookies').style.backgroundPosition = 'calc(48px * -6) calc(48px * -9)';
			document.getElementById('iconSource').style.backgroundPosition = 'calc(48px * -3) calc(48px * -9)';
			document.getElementById('iconContact').style.backgroundPosition = 'calc(48px * -2) calc(48px * -9)';
		}
	}
	else if (rand < step * 4.6) {
		theme = 'money';
		document.body.style.backgroundImage = 'url("' + mainURL + 'Images/bgMoney.jpg")';
		if (mainPage) {
			document.getElementById('iconFeatures').style.backgroundPosition = 'calc(48px * -0) calc(48px * -14)';
			document.getElementById('iconScreenshots').style.backgroundPosition = 'calc(48px * -14) calc(48px * -14)';
			document.getElementById('iconCompatibility').style.backgroundPosition = 'calc(48px * -4) calc(48px * -14)';
			document.getElementById('iconGetTriggerCookies').style.backgroundPosition = 'calc(48px * -7) calc(48px * -14)';
			document.getElementById('iconSource').style.backgroundPosition = 'calc(48px * -13) calc(48px * -14)';
			document.getElementById('iconContact').style.backgroundPosition = 'calc(48px * -18) calc(48px * -14)';
		}
	}

	if (theme != 'normal')
		console.log('Changed theme to ' + theme);
	if (shower != 0)
		console.log('Cookie shower level ' + shower);

	PickMilk();

	AddCookie();
}

function PickMilk() {
	var rand = Math.random();
	var step = 0.8;
	if (theme != 'normal')
		step *= 2;

	var milk = 'milkWave';
	if (rand < step * 1) {
		milk = 'chocolateMilkWave';
	}
	else if (rand < step * 2) {
		milk = 'raspberryWave';
	}
	else if (rand < step * 3) {
		milk = 'orangeWave';
	}
	else if (rand < step * 4) {
		milk = 'caramelWave';
	}

	if (theme == 'evil') {
		milk = 'raspberryWave';
	}

	if (milk != 'milkWave')
		console.log('Changed milk to ' + milk);

	document.getElementById('milk').style.backgroundImage = 'url("' + mainURL + 'Images/' + milk + '.png")';
}

function AddCookie() {
	var body = document.body;
	var html = document.documentElement;
	var height = Math.max(body.scrollHeight, body.offsetHeight,
						html.clientHeight, html.scrollHeight, html.offsetHeight);
	var width = window.innerWidth;

	var cookiesAdded = 0;
	var wrinklersAdded = 0;

	for (var i = 1; i <= 6; i++) {
		if (width > 750 && ((Math.random() < 0.75 / (i * i) && i <= 3) || (Math.random() < 0.9 && i > 3 && theme == 'evil'))) {
			if (i <= 3)
				cookiesAdded++;
			if (i > 3)
				wrinklersAdded++;
			var imageWidth = 96, imageHeight = 96;
			var image = 'goldCookie.png';

			if (theme == 'normal') {
				if (Math.random() < 0.7) {
					image = 'goldCookie.png';
					imageWidth = imageHeight = 96;
				}
				else {
					image = 'perfectCookieSmall.png';
					imageWidth = imageHeight = 256;
				}
			}
			else if (theme == 'evil') {
				if (i <= 3) {
					image = 'wrathCookie.png';
					imageWidth = imageHeight = 96;
				}
				else {
					image = 'wrinkler.png';
					imageWidth = 100;
					imageHeight = 200;
				}
			}
			else if (theme == 'store') {
				image = 'perfectCookieSmall.png';
				imageWidth = imageHeight = 256;
			}
			else if (theme == 'ascend') {
				image = 'haloCookie.png';
				imageWidth = imageHeight = 384;
			}
			else if (theme == 'money') {
				image = 'contract.png';
				imageWidth = imageHeight = 96;
			}

			var centerX = imageWidth / 2, centerY = imageHeight / 2;
			width -= imageWidth + 3 - 16; height -= imageHeight + 3;
			var x = 1 + centerX + Math.random() * width, y = 1 + centerY + Math.random() * height;

			var cookie = document.createElement('div');
			cookie.style.position = 'absolute';
			cookie.style.left = '' + (x - centerX) + 'px';
			cookie.style.top = '' + (y - centerY) + 'px';
			cookie.style.backgroundImage = 'url("' + mainURL + 'Images/' + image + '")';
			cookie.style.width = '' + imageWidth + 'px';
			cookie.style.height = '' + imageHeight + 'px';
			document.body.insertBefore(cookie, document.getElementById('container'));
		}
	}

	if (cookiesAdded > 0)
		console.log('Added ' + cookiesAdded + ' cookie' + (cookiesAdded != 1 ? 's' : ''));
	if (wrinklersAdded > 0)
		console.log('Added ' + wrinklersAdded + ' wrinkler' + (wrinklersAdded != 1 ? 's' : ''));
}
