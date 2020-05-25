---
hide_title: true
title: TriggerNotify
title_postfix: A Kittens Game Alert mod
description: The homepage for the TriggerNotify mod for Bloodrizer's insane incremental Kittens Game.
permalink: /mods/trigger-notify/
---
# TriggerNotify

* **Author:**         Robert Jordan
* **Version:**        v1.1.0.0
* **Source Code:**    [GitHub](https://github.com/trigger-segfault/trigger-segfault.github.io/tree/master/mods/trigger-notify/)

TriggerNotify is a simple mod for Kittens Game that alerts the user with a sound when a resource hits its limit. Each resource has a unique sound when hit so it's differentiable while multitasking. The mod comes with a menu for customization. You can mute specific resources or use a custom sound for a resource. Resources will not show up in the menu unless the resources has been discovered to prevent spoilers.

## Custom Sounds

Browsers can be picky about the audio format used. If no sound plays when testing the sound then the format is most likely the problem.

If your browser allows loading of local audio files you can paste the file path into the custom url text box. The path must be prefixed with `file:///`, you can shift click on a file in windows to get its path (you still need to add `file:///`). Remember to remove the quotes after pasting it.

## Requirements

* Game Version:   Ver 1.0.7.1 *(should work with newer versions)*
* Compatibility:  Should work with any other mod. Does not modify the game other than the menu button.

## How to Load

**Bookmarklet:** Paste this code into a bookmark URL and open the bookmark while on the Kittens Game page.

```javascript
javascript: (function () {
    var mod = document.createElement('script');
    mod.src = 'https://trigger-segfault.github.io/mods/trigger-notify/TriggerNotify.js';
    mod.id = 'modscript_TriggerNotify';
    document.head.appendChild(mod);
})();
```

**Userscript:** For use with GreaseMonkey, TamperMonkey, etc. Delays loading the mod so Kittens Game can finish setting up.

```javascript
javascript: (function () {
    var checkReady = setInterval(function () {
      clearInterval(checkReady);
      var mod = document.createElement('script');
      mod.src = 'https://trigger-segfault.github.io/mods/trigger-notify/TriggerNotify.js';
      mod.id = 'modscript_TriggerNotify';
      document.head.appendChild(mod);
    }, 400);
}());
```

## Credits

Here are the sources for all the sounds used. A few use the same base sound but the rest have been edited.

* Default Beep: [soundjay](https://www.soundjay.com/button/beep-30b.mp3)
* Catnip: [freesound](https://www.freesound.org/people/MaxDemianAGL/sounds/131050/)
* Wood: [freesound](https://www.freesound.org/people/Celticvalkyria/sounds/250391/)
* Minerals: [freesound](https://www.freesound.org/people/Prosser/sounds/233998/)
* Coal: [freesound](https://www.freesound.org/people/Prosser/sounds/233998/)
* Iron: [freesound](https://www.freesound.org/people/joshfeed/sounds/168822/)
* Titanium: [freesound](https://www.freesound.org/people/joshfeed/sounds/168822/)
* Uranium: [freesound](https://www.freesound.org/people/Corsica_S/sounds/188791/)
* Unobtainium: [freesound](https://www.freesound.org/people/johnnypanic/sounds/32675/)
* Gold: [freesound](https://www.freesound.org/people/monotraum/sounds/162192/)
* Oil: [freesound](https://www.freesound.org/people/jurpobiltema/sounds/189703/)
* CatPower: [freesound](https://www.freesound.org/people/audione/sounds/52458/)
* Science: [freesound](https://www.freesound.org/people/JoelAudio/sounds/136542/)
* Culture: [freesound](https://www.freesound.org/people/Reitanna/sounds/235150/)
* Faith: [freesound](https://www.freesound.org/people/chipfork/sounds/50087/)
* Kittens: [freesound](https://www.freesound.org/people/Npeo/sounds/203121/)
* Zebras: [freesound](https://www.freesound.org/people/acclivity/sounds/19812/)
* Astronomical Event: [freesound](https://www.freesound.org/people/Andromadax24/sounds/186719/)
