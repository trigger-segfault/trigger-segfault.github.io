# TriggerCookies

* Author:         Robert Jordan
* Version:        v0.1.0.0

TriggerCookies is a large mod suite made in the style of [CookieMaster](https://github.com/greenc/CookieMaster). TriggerCookies comes stocked with a large collection of features but also allows you exclude ones based on which Javascript file they come from. This mod offers modular support, allowing others to create mods for TriggerCookies and even replace the defaults with theirs if they so choose.

## Requirements

* Game Version:   v.1.0501 beta
* Compatibility:  Not ment for use with other (large) mods. This overrides numerous functions, a few of them major.

## How to Load

**Bookmarklet:** Paste this code into a bookmark URL and open the bookmark while on the Cookie Clicker page.

```javascript
javascript: (function () {
    console.log("Loading Trigger Cookies");
    Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/TriggerCookies.js');
    Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/LayoutCookie.js');
    Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/AutoCookie.js');
    Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/StatCookie.js');
    Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/CheatCookie.js');
    Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/HotfixCookie.js');
}());
```

**Userscript:** For use with GreaseMonkey, TamperMonkey, etc.

```javascript
javascript: (function () {
    var checkReady = setInterval(function () {
        if (typeof Game.ready !== 'undefined' && Game.ready) {
        clearInterval(checkReady);
        console.log("Loading Trigger Cookies");
        Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/TriggerCookies.js');
        Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/LayoutCookie.js');
        Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/AutoCookie.js');
        Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/StatCookie.js');
        Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/CheatCookie.js');
        Game.LoadMod('http://trigger-death.github.io/TriggerCookies/Scripts/HotfixCookie.js');
    }}, 100);
}());
```

## Credits

* Bake all Heavenly Cookies button by [/u/jakerman999](http://www.reddit.com/user/jakerman999), [Original Post](http://www.reddit.com/r/CookieClicker/comments/2gb4gw/i_made_a_bake_all_button/).
* Many features based off of [CookieMaster](https://github.com/greenc/CookieMaster) and its source code.
* Originally based off and still uses some code from [Cookieclicker Bots](https://gist.github.com/pernatiy/38bc231506b06fd85473#file-cc-js)

## Features

* Modular Support: Take a look at [ExampleMod.js](https://github.com/trigger-death/trigger-death.github.io/blob/master/TriggerCookies/Scripts/ExampleMod.js).
* Number Places: Write number places such as *billion*/*b*, *octillion*/*oc* in text boxes instead of entering in all those '0's.
* Overrides: Comes with [Overrides.js](https://github.com/trigger-death/trigger-death.github.io/blob/master/TriggerCookies/Scripts/Overrides.js) which allows for handling overriding and appending to Cookie Clicker functions. Also outputs to the console log to see who is overriding functions and if conflicts occur.
* *Third-party* Achievement: Hey guess what!? This is a mod you're using! So why not receive the plugin shadow achievement?
* Favicon: Set the favicon to a cookie, which it should have been all along.

##### AutoCookie

* Autoclick: With customizable click speed.
* Popup Click: Click Golden Cookies (optionally Wrath), Wrinklers, and Reindeer.
* Autobuy: Buy buildings, upgrades, and/or research automatically.
* Season Sycle: Iterate through each season to collect every upgrade.
* Auto Ascend: Ascend with set limits on when to ascend next. (Purchases upgrades and heavenly cookies).
* Chocolate Egg: Automatically sell all buildings and the chocolate egg upon auto or manual ascend.
* Achievement Hunting (**Coming Soon**): Goes for difficult achievements when applicable.

##### CheatCookie

* Extremely useful for debugging.
* Cookies: Add, remove, or set your current amount of cookies. Also allows the activation of Frenzies.
* Prestige: Add, remove, or set your current amount of Heavenly Chips or Heavenly Cookies.
* Upgrades: Buy/sell/unlock/lock an entered in upgrade or buy/sell all upgrades and unlock debug upgrades.
* Achievements: Win/lose an entered in achievement or win or lose all achievements.
* Spawning: Spawn popups such as Golden Cookies, Wrinklers, and Reindeer.

##### StatCookie

* Counts numerous detailed stats the game leaves out.
* Cookies: Extended CPS stats.
* Golden Cookies: Missed cookies, last effect, and Lucky rewards and requirements.
* Prestige: Chips per second stats and cookies to next chip.
* Wrinklers: Cookies sucked and reward for popping.
* Seasons: Current season as well as progress for each season's upgrades.

##### LayoutCookie (probably going to rename)

* Numerous UI improvements and features.
* Improved Scrollbar: Central scrollbar no longer scrolls news ticker at the top.
* News Ticker Background: Now the news ticker will always have the black background instead of changing based on the current menu.
* Remove Top Bar: Remove that pesky top bar and leave more space for cookies to fill up.
* Building Efficiency: Colors building prices based on their efficiency compared to other buildings.
* Pop All Wrinklers Button: A button below the big cookie that appears when Wrinklers are available to pop.
* Bake All Button: Now you can press a button to bake all Heavenly Cookies or input number place names such as *billion*/*b*, *octillion*/*oc*.
* End Season Button: Adds a toggleable upgrade to end the current season at a price.

##### HotfixCookie

* Provides a collection of fixes for the beta version.
* Fix Broken Upgrades: Fixes upgrades that can't be unlocked or have incorrect requirements.
* Fix Broken/Disabled Achievements: Fixes achievements that are disabled in the beta.
* Fix Heavenly Cookie Multiplier: For those hardcore players who want the original 1% multiplier instead of 10%.

## Todo List

* Add ability to save settings.
* Time estimates for settings and stats.
* Debug cheats to change amounts earned.
* Some sort of Carpal Tunnel prevention button that players won't consider cheating, or automation.
* Upgrade efficiency coloring.
