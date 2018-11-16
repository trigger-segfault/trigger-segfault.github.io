---
hide_title: true
title: Triggerverse
title_postfix: A mod for Ortei's Nested
permalink: /mods/triggerverse/
---
# Triggerverse

* **Author:**         Robert Jordan
* **Version:**        v1.0.0.0
* **Source Code:**    [GitHub](https://github.com/trigger-death/trigger-death.github.io/tree/master/mods/triggerverse/)

TriggerVerse creates a more user-friendly environment in [Nested](http://orteil.dashnet.org/nested) making it easier to explore infinitely. This mod will count the total nodes in existence, as well as allow you to remove nodes or recenter a node to be the primary node. TriggerVerse will also save your current theme. As a bonus it also adds RollerCoaster Tycoon-styled theme park catagories randomly into cities.

## Requirements

* Game Version:   v0.3 *(should easily work with newer versions)*

## How to Load

**Bookmarklet:** Paste this code into a bookmark URL and open the bookmark while on the Nested page.

```javascript
javascript: (function () {
  var url = 'http://trigger-death.github.io/mods/triggerverse/Triggerverse.js';
  var js = document.createElement('script');
  js.setAttribute('type', 'text/javascript');
  js.setAttribute('id', 'modscript_Triggerverse');
  js.setAttribute('src', url);
  document.head.appendChild(js);
})();
```

**Userscript:** For use with GreaseMonkey, TamperMonkey, etc. Delays loading the mod so Nested can finish setting up.

```javascript
javascript: (function () {
  var checkReady = setInterval(function () {
  if (typeof iN !== 'undefined' && iN > 0) {
    clearInterval(checkReady);
    var url = 'http://trigger-death.github.io/mods/triggerverse/Triggerverse.js';
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('id', 'modscript_Triggerverse');
    js.setAttribute('src', url);
    document.head.appendChild(js);
  }}, 100);
}());
```

## Credits

All theme park graphics from Rollercoaster Tycoon 2.
