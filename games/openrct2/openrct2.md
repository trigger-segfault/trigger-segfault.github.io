---
layout: page
title: OpenRCT2 Contributions
permalink: /games/openrct2/
description: Documentation of contributions trigger_death has made to OpenRCT2 over the years.
image: /games/openrct2/assets/icon-256.png
---

* **[Commit History](https://github.com/OpenRCT2/OpenRCT2/commits?author=trigger-death)**
* **[Pull Request History](https://github.com/OpenRCT2/OpenRCT2/pulls?q=author%3Atrigger-death)**

Before I started working for the OpenRCT2 team, I began working on my original RCT2 tool, the Content Browser. I worked with [X123M3-256](https://github.com/X123M3-256) over IRC to decipher the attraction .DAT file format, which he used to create his [RCT2 Ride Generator](https://github.com/X123M3-256/RCT2RideGenerator) and [many custom-made rides](http://x123m3-256.github.io/RCT2/CustomRides/). I started contributing to OpenRCT2 after I released my [GitHub Pages section for my RCT2 Tools](/tools/rct2-tools/) and someone recommended I help out.

OpenRCT2 was my first real experience of working on an open source project, and my first dive into pull requests and working with Git Bash. It's kind of embarrassing looking back on my PRs and seeing many of the mistakes I made so often. Below is the history of my contributions and what I added to the project, excluding many of the minor bug fixes.

Although I've made a lot of visible contributions to OpenRCT2, that in no way invalidates any of the work many are doing behind the scenes. OpenRCT2 wouldn't be where it is today without the extensive effort to decompile every function along with all the bug fixing everyone works on.

## Contributions 2015

### Random Title Music: [#1050](https://github.com/OpenRCT2/OpenRCT2/pull/1050)

My first small feature I added was the ability to randomize which music played on the title screen (Either RCT1's or RCT2's).

![Random Title Music Preview](/games/openrct2/assets/img/random-title-music.png)

### Remember last Game Window Size: [#1051](https://github.com/OpenRCT2/OpenRCT2/pull/1051)

A simple addition to keep track of the window size between play sessions so it's not always a small Window on launch.

### Land Paint Mode: [#1058](https://github.com/OpenRCT2/OpenRCT2/pull/1058)

My first big Quality of Life feature was a toggle settings for dragging the land tool around to change Surface types without having to click every single time (and risk changing the land elevation).

![Land Paint Mode Preview](/games/openrct2/assets/img/land-paint-mode.png)

### Selection Size Text Input: [#1058](https://github.com/OpenRCT2/OpenRCT2/pull/1058)

OpenRCT2 supports selection sizes much larger than the original game. Because of this, I added the ability to change the selection size by clicking on the selection grid in the window. A text input would pop up asking for a new size.

![Selection Size Text Input Preview](/games/openrct2/assets/img/selection-size-input.png)

### Land Rights Tool: [#1069](https://github.com/OpenRCT2/OpenRCT2/pull/1069)

Buying land rights in RCT2 was a huge pain before. You could only buy one piece of land at a time which was a huge pain when it came to claiming uncharted territory. To fix this, clicking on the consolidated Land Rights button in the Park window would open up a new tool where you could choose, Land Rights or Construction Rights, along with the input size.

![Land Rights Tool Preview](/games/openrct2/assets/img/land-rights-tool.png)

### Game Speed Button: [#1092](https://github.com/OpenRCT2/OpenRCT2/pull/1092), [#1100](https://github.com/OpenRCT2/OpenRCT2/pull/1100)

Before the advent of the Game Speed Button. The only way to change the game speed was through hotkeys, you also could not determine what speed you were currently at. Game Speed works based on powers of 2:

* **Normal Speed:** 2^0 = 1 updates per tick
* **Quick Speed:** 2^1 = 2 updates per tick
* **Fast Speed:** 2^2 = 4 updates per tick
* **Turbo Speed:** 2^3 = 8 updates per tick
* **Hyper Speed:** 2^7 = 128 updates per tick (Requires Debugging Tools enabled)

Upon a user's request, I made it so clicking the game speed button without making a selection would cycle to the next highest speed. Hyper speed is so unbelievably fast that you can fail a scenario in under a minute using it, so this speed is restricted to Debugging Tools mode only. There is no practical use for this speed outside of testing as it even slows down the game enough to reduce the speed of viewport dragging to a crawl.

In a later PR, I added custom sprites for the Game Speed Buttons so would look unique.

![Game Speed Button Preview](/games/openrct2/assets/img/game-speed-button.png)

### OpenRCT2 Title Logo: [#1094](https://github.com/OpenRCT2/OpenRCT2/pull/1094)

Just around this time, we started making use of `g2.dat`, which is an OpenRCT2-exclusive data file containing all custom-made sprites. With that in mind, I decided it was time to show the correct logo on the title screen since we already had a logo for the game picked out. This required taking the game icon and title sprites into Photoshop, and applying a palette and dithering to give them a proper look.

![OpenRCT2 Title Logo Preview](/games/openrct2/assets/img/title-logo.png)

### Test Unfinished Rides & No Test Crashes: [#1134](https://github.com/OpenRCT2/OpenRCT2/pull/1134)

Although, even today, this feature still hasn't changed much, the ability to test rides that have not finished is a huge advantage, along with the addition of disabling test crashes, you can safely and quickly test modifications to rides without worrying about park rating or connecting the track into a loop. In the beginning, these two features were only enablable through the in-game console because of the possibly glitches they may cause.

![Test Unfinished Rides Preview](/games/openrct2/assets/img/test-unfinished-rides.png)

### In-Game Object Selection: [#1142](https://github.com/OpenRCT2/OpenRCT2/pull/1142)

One of the biggest pet peeves with RollerCoaster Tycoon 2 was taking hours and hours to pick out what scenery, rides, etc. was available in the scenario, only later to find out you missed something. With the in-game Object Selection, you can reopen the window and change what's currently available in-game. What's nice is the game already had built in measures to gray out anything that was in use in the park so this was a relatively bug-free addition. Due to also being experimental, this feature was also only available through the in-game console in the beginning.

### Twitch Options Tab Sprite

OpenRCT2 starting adding built-in features for Twitch around this point such as appointing viewers in the channel as guests etc. There was a need for a sprite for the Options Tab at the time so I offered to give a whack at it. Although I'm not much of a sprite artist, I do alright when the palette is restricted.

![Twitch Sprite](/games/openrct2/assets/img/twitch-tab.png)

### Window Theming: [#1174](https://github.com/OpenRCT2/OpenRCT2/pull/1174), [#1190](https://github.com/OpenRCT2/OpenRCT2/pull/1190), [#1261](https://github.com/OpenRCT2/OpenRCT2/pull/1261)

Window theming was a fun little undertaking to allow recoloration of every window and UI element in the game. Opening the themes window shows a collection of tabs that each list UI elements and windows and their respective color groups. The checkboxes below each color swatch enable transparency. Themes were originally called Color Schemes.

![Themes Preview](/games/openrct2/assets/img/themes.png)

The water tool and land tool are perfect examples of windows that look good with recoloration and transparency.

![Water/Land Tool Transparency Preview](/games/openrct2/assets/img/themes-water-land.png)

In a later PR, I added the ability to display RollerCoaster Tycoon 1 start/stop lights in themes, (which the original RCT1 theme didn't have)

![Open/Close Lights Preview](/games/openrct2/assets/img/themes-open-close-lights.png)

### OpenRCT2 Steam Stub (No longer Supported)

OpenRCT2 still wasn't the most stable thing in the world at this point and there were still many reasons to run the original RCT2 for testing/etc. I created a launcher Window that would be called when running RCT2 through Steam. With this, OpenRCT2 or the old OpenRCT2 Launcher (by [Krutonium](https://github.com/Krutonium)) could be launched and recognized by Steam at the same time.

This was added to my collection of RCT2 Tools but was later removed after it lost compatibility and I discontinued it.

![OpenRCT2 Steam Stub Preview](/games/openrct2/assets/img/openrct2-stub.png)

### Object Selection Window Filtering/Searching/Categories: [#1208](https://github.com/OpenRCT2/OpenRCT2/pull/1208), [#1235](https://github.com/OpenRCT2/OpenRCT2/pull/1235), [#1339](https://github.com/OpenRCT2/OpenRCT2/pull/1339)

The amount of objects in RCT2 *even without custom content* is huge. Navigating them and trying to choose what objects to use is an absolute pain so I made it easier to look for objects you are familiar with or have a certain keyword in them.

First I added a Filter option to choose where the content came from.

![Object Selection Filter Preview](/games/openrct2/assets/img/object-selection-filter.png)

In later Pull Requests, I added object searching, and then ride category separation.

![Object Selection Search/Categories Preview](/games/openrct2/assets/img/object-selection-search-categories.png)

### Clear Scenery Filters: [#1233](https://github.com/OpenRCT2/OpenRCT2/pull/1233)

Before this, the Clear Scenery tool would only clear walls, small scenery, and I believe *not* large scenery. I switched things up by adding three toggleable settings for clearing the regular scenery, large scenery, and paths. Clearing paths is a big deal because there was no decent way to do it beforehand.

Below I was able to wipe out everything from Electric Fields with a single mouse click and dragging.

<img style="max-height: 400px" src="/games/openrct2/assets/img/clear-scenery.png">

### Force Ride Breakdown: [#1288](https://github.com/OpenRCT2/OpenRCT2/pull/1288)

I added dropdown button in the maintenance tab of rides that allows the user to manually trigger ride breakdowns if they have Debugging Tools enabled. This feature is fun to use with Carousels and Control Failures.

![Force Breakdown Preview](/games/openrct2/assets/img/force-breakdown.png)

### Quick-Fire Staff: [#1298](https://github.com/OpenRCT2/OpenRCT2/pull/1298)

Firing large groups of staff is extremely time consuming, so I added a toggle button allowing you to fire a staff member just by clicking on their name in the list. No more `click staff` > `goto new window` > `click fire` > `click yes` for *every* staff member.

![Quick-Fire Staff Preview](/games/openrct2/assets/img/quick-fire-staff.png)

### Title Sequence Editor: [#1459](https://github.com/OpenRCT2/OpenRCT2/pull/1459), [#1460](https://github.com/OpenRCT2/OpenRCT2/pull/1460), [#1475](https://github.com/OpenRCT2/OpenRCT2/pull/1475), [#1478](https://github.com/OpenRCT2/OpenRCT2/pull/1478)

The Title Sequence Editor is by far my favorite contribution to OpenRCT2, it's a huge feature, but it adds a lot to game customization that wasn't there before. With each stable release of OpenRCT2, a new title sequence was created, this may seem fine, but these sequences were hand-made, with no tools or previews to go by. With the advent of this tool, the team can easily create new title sequences when moving to the next stable.

Below are some drawn-up previews I made of what the windows would look like to help make the actual implementation easier.

![Title Sequence Editor Design Preview](/games/openrct2/assets/img/title-sequence-editor-design.png)

These are what the final windows looked like, along with the option for changing the sequence.

![Title Sequence Editor Preview](/games/openrct2/assets/img/title-sequence-editor.png)

Below is an example of the MR BONES WILD INTRO title sequence.

<img style="max-height: 400px" src="/games/openrct2/assets/img/title-sequence-mrbones.png">

## Contributions 2017

### Place Path Inside Park Entrances: [#6479](https://github.com/OpenRCT2/OpenRCT2/pull/6479)

Before this, changing the path used by a park entrance meant deleting the entrance than replacing it *and* making sure the correct path was next to it. Now you can just click and change the path over the entrance like any other path (assuming you have the ability to edit outside the park, via cheat, or other means).

![Place Path Inside Park Entrances Preview](/games/openrct2/assets/img/park-entrance-path.gif)

### Preview Title Sequences In-Game: [#6498](https://github.com/OpenRCT2/OpenRCT2/pull/6498)

A big overhaul of the Title Sequence Editor that made creation so much easier. Before this, title sequences were only suited for playback in the title screen, due to numerous issues with variable conflicts and just how things generally function.

Along with this, this PR also fixed the issues with the *Get Location* button not giving accurate coordinates, this took a bit of work because of how awkward it was to acquire 2D coordinates in an isometric environment.

### Park Entrance Placement Arrow: [#6591](https://github.com/OpenRCT2/OpenRCT2/pull/6591)

Placing park entrances was often a pain because it wasn't always easy to tell the difference between the front and back of the park entrance, leading to placing it in the wrong direction. This fixes that by adding a preview arrow showing the direction towards the park, like is shown with constructing other objects.

* *Figure A:* Arrows are easy to see when placing, facing the direction of the park.
* *Figure B:* Arrows are harder to see when placing, facing away from the park.
* *Figure C:* Arrow will still guide placement inside the park even when the entrance is in an unplaceable location or the entrance has no visual.
* *Figure D:* Arrow may be harder to see on thicker entrances but still visible enough to register.
* *Figure E:* Arrow may be completely hidden by thick entrances when facing away from the park. However, it should eventually become learned behavior that when the arrow is not visible or partially obstructed, the entrance is facing towards you.
* *Figure F:* Arrow will still guide placement outside the park even when the entrance is in an unplaceable location or the entrance has no visual.

![Park Entrance Placement Arrow Preview](/games/openrct2/assets/img/park-entrance-arrow.png)

### Title Sequence Editor Load Scenario Command: [#6598](https://github.com/OpenRCT2/OpenRCT2/pull/6598)

My next addition to the Title Sequence Editor was the ability to Load a scenario file instead of a save file. This may sound easy enough, but there were limitations that had to be overcome such as displaying the Scenario Selection dialog in-game without making it load the selected scenario. With the advent of this feature, RCT1, and RCT2 title sequences no longer needed to rely on the `LOADMM` and `LOADRCT` commands that were exclusive to these sequences, it also meant duplicating these sequences would be more user friendly as the user would just see a *Load Scenario* command instead of special unselectable commands.

![Load Scenario Command Preview](/games/openrct2/assets/img/title-sequence-editor-load-scenario.png)

### Title Sequence Editor Follow Sprite Command: [#6606](https://github.com/OpenRCT2/OpenRCT2/pull/6606)

This was originally based off of [Broxzier's PR #5930](https://github.com/OpenRCT2/OpenRCT2/pull/5930). There was a lot of extra work to do to fix a lot of the issues, especially since this PR was created before title sequences could be tested in-game. This was one of the more challenging PR's I've done for OpenRCT2 as much of the functionality needed lots of additions to work with the existing code.

![Follow Sprite Command Preview](/games/openrct2/assets/img/title-sequence-editor-follow-sprite.png)

### Don't Block Land Rights Tool: [#6610](https://github.com/OpenRCT2/OpenRCT2/pull/6610)

Even after I added the Land Rights Tool back in 2015, there was still one issue that made it annoying to use. That was the fact that the tool action would stop the moment you tried to purchase unavailable land. This fixed that by making the tool ignore all land tiles that did not meet the purchase conditions, just like how all other tools behave.

### Fix Viewport Scrolling: [#6620](https://github.com/OpenRCT2/OpenRCT2/pull/6620)

My final pull request of 2017 was fixing of numerous Viewport issues. OpenRCT2 and even the original RCT2 were plagued with a number of issues with scrolling the main view in-game. This fixed a total of 4 different reported issues (that were not duplicates). Along with fixes, I also modified scrolling at the edge of the map to move at the same speed in both directions (horizontal and vertical). This was an issues because of the isometric differences in slant of one direction vs. the other.

Apparently I wasn't the first to tackle this issue, but every PR before this ended up creating new issues in the process. It felt quite good to implement a major fix that had been troubling people for awhile.

## Decompiled Functions

Decompiling assembly code into C for OpenRCT2 was quite a difficult task. I only worked on a few functions but I really salute all the work everyone else did to get the game to the point where it was using no original executable code. Often times I decompiled methods I needed for other fixes or features.

### Related PR's: [#1082](https://github.com/OpenRCT2/OpenRCT2/pull/1082), [#1271](https://github.com/OpenRCT2/OpenRCT2/pull/1271), [#1284](https://github.com/OpenRCT2/OpenRCT2/pull/1284), [#1316](https://github.com/OpenRCT2/OpenRCT2/pull/1316)

## OpenRCT2 Podcast Episode 1

I took part in the first of 3 OpenRCT2 developer podcasts, although there were plenty of technical troubles along the way, it was still a pretty neat experience.

{% include youtube.html id="TQSbXaLStDc" %}
