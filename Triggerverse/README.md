# TriggerVerse

* Author:         Robert Jordan
* Version:        v1.0.0.0

TriggerVerse creates a more user-friendly environment in Nested making it easier to explore infinitely. TriggerVerse will also save your current theme. As a bonus it also adds theme park catagories randomly into cities.

## Requirements

* Game Version:   v0.3 *(should easily work with newer versions)*

## How to Load

**Bookmarklet:** Paste this code into a bookmark URL and open the bookmark while on the Nested page.

```javascript
javascript: (function () {
  var url = 'http://trigger-death.github.io/Triggerverse/Scripts/Triggerverse.js';
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
    var url = 'http://trigger-death.github.io/Triggerverse/Scripts/Triggerverse.js';
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
