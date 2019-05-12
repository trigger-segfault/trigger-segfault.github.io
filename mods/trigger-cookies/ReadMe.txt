---
published: false
---
 _______________________________________________________
|  __                                                  ||
| | ||____ _______ __ _______ _______ _______ _______  ||
| |  ____||_____ \| |/  ____|/  ____|/______||_____ \\ ||
| | ||    _____| || || ||  _ | ||  _  ____________| || ||
| | ||    \  ____/| || || |\\| || |\\|______|\  ____// ||
| | ||     \ \\   | || ||_| \| ||_| \________ \ \\     ||
| |_||      \_\\  |_|\______|\______|\______|| \_\\    ||
|                                                      ||
|  _______ _______ _______ __ ___ __ _______ _______   ||
| /  ____|/  ___ \/  ___ \| |/ //| |/______|/ _____\\  ||
| | ||    | || | || || | || | // | ||_______| ||____   ||
| | ||    | || | || || | ||   \\ | ||______|\____  \\  ||
| | ||____| ||_| || ||_| || |\ \\| ||____________| ||  ||
| \______|\______/\______/|_||\_\|_|\______|\______//  ||
|                                                      ||
|______________________________________________________||

--------------------------------
Author:         Robert Jordan
Version:        v0.1.0.0
Last Updated:   11/24/2014
--------------------------------
Repository:     https://github.com/trigger-segfault/CookieMods

================================================
 Game Requirements
================================================

Version:        v.1.0501 beta

Compatibility:  Probably not compatible with other large mods.
                A few major functions are overwritten.

================================================
 Credits
================================================
- Bake All Heavenly Chips Button
  Function by /u/jakerman999 on Reddit.
  Link: http://www.reddit.com/r/CookieClicker/comments/2gb4gw/i_made_a_bake_all_button/

- Many features based off CookieMaster

================================================
 How to Load
================================================
Bookmarklet
------------------------------------------------

javascript: (function () {
	console.log("Loading Trigger Cookies");

	Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/TriggerCookies.js');
	
	Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/EnhanceCookie.js');
	Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/AutoCookie.js');
	Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/StatCookie.js');
	Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/CheatCookie.js');
	Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/HotfixCookie.js');
}());

================================================
Userscript
------------------------------------------------

javascript: (function () {
	var checkReady = setInterval(function () {
	if (typeof Game.ready !== 'undefined' && Game.ready) {
		clearInterval(checkReady);
		console.log("Loading Trigger Cookies");

		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/TriggerCookies.js');
	
		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/EnhanceCookie.js');
		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/AutoCookie.js');
		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/StatCookie.js');
		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/CheatCookie.js');
		Game.LoadMod('http://trigger-segfault.github.io/mods/trigger-cookies/HotfixCookie.js');
	}
	}, 100);
}());

================================================