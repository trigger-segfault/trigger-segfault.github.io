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
