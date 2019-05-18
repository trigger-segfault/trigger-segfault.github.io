---
layout: post
title:  "2018: End of Year Wrap-Up (Part 2)"
date:   2019-05-05 16:00:00 -0400
#date_edited: 2019-01-04 12:00:00 -0500
categories: [meta, dev, anime, gaming]
category: [meta, dev, anime, gaming]
tags: [wrap-up, pic]
excerpt: Part 2 of my 2018 End of Year Wrap-Up, covering all of 2018.
image: /blog/assets/img/end-of-year-wrapup-2018.png
preview: /blog/assets/img/end-of-year-wrapup-2018.png
---
## 2018 Coverage

{:align="center"}
![Preview of 2018](/blog/assets/img/end-of-year-wrapup-2018.png)

Now that I have a blog and feel obligated to post things. Let's follow in [my friend's footsteps](https://blog.huguesross.net/2018/12/2018-end-of-year-wrap-up.html) and create a wrap-up of this years development (and a little bit of last year's since a lot went on then too).

Part two is long overdue, so here it so.

# 2018

## [Zelda Oracle Engine (Nov - Apr)](https://github.com/trigger-segfault/ZeldaOracle)

{:align="center"}
![Zelda Oracle Engine logo](/blog/assets/img/zelda-oracle.png)

The Zelda Oracle Engine is a pet project me and my [brother, cube_man](https://github.com/cubeman99) have had for a long time, crossing over many languages. In 2015, we gave it a good start in C# XNA and restarted then revived it in late November of 2017. During the revival we made many changes including transitioning to a WPF editor, *as that's what I specialize in*, it created a few headaches in some areas, but overall we got a few nice improvements out of it, including a pretty nice script editor using AvalonEdit.

### Major Improvements: Everything

We have now surpassed any previous generations of this project (Java, and before that GameMaker). We transitioned to a paletted sprite system for maximum authenticity. We created an editor to feed and build `.conscript`'s in to get maximum representation of errors while compiling resources and checking that tiles were setup correctly. The new paletting system is a little overwhelming at first glance, although I did end up writing some tutorial conscripts.

{:align="center"}
![Conscript Designer Window](/blog/assets/img/zelda-oracle-conscript-designer.png)

The world editor saw some big improvements with an undo feature, which was pretty difficult to nail down. We also got a selection tool with different levels of layer support. My brother finally got the script API implemented, we decided to write the scripts in straight C#, with an API library for access to the game. The script editor uses Roslyn for much more advanced intellisense which is much nicer to work with than just an error message at the bottom of the window.

{:align="center"}
![World Editor Window](/blog/assets/img/zelda-oracle-world-editor.png)

The physics engine got an overhaul along with monster API. Pretty much every weapon got its implementation down. We also finally got side-scrolling view in, which is quite fun to play around in.

{:align="center" .figure-text}
An example of a palette zone transition and making use of the game engine for memes.

{% include gyfcat.html id="PartialMeaslyHoneyeater" id2="LimpJovialHusky" %}

{:align="center" .figure-text}
We encountered a few *interesting* bugs along the way.

{% include gyfcat.html id="MisguidedHealthyBaboon" id2="PaltryPartialHound" %}

It was great to get to work on this project again and great to work with my brother, who really knows what he's doing when he goes to implement something. The game wouldn't be even 1/10th as good as it is now without his help. cube_man worked mostly on the actual engine, while I worked more in the area of the editor and resource management. Most of my time went to gathering and compiling the [tile list we see here](/blog/assets/img/zelda-oracle-tile-list.png). The project went on hiatus in April after slowly losing interest, but I have no doubt we'll pick it up again in the future, assuming we have the time.

## [Discord Bot: trigger_chan v1 (Apr - Oct)](https://github.com/trigger-segfault/TriggerChan)

{:align="center" .figure-text}
The old avatar for Triggy before upgrading to my Bot Framework v2 with a new image.

{:align="center"}
![trigger_chan Old Avatar](/blog/assets/img/trigger-chan-avatar-old.png)

On April 20th, a Discord server for an anime app I used opened up. Me and the developer knew each other from another server so he gave me the go-ahead to setup a bot for the server to manage basic stuff such as MyAnimeList profile embeds and roles. With this, I made my first trek into writing a Discord Bot, which ended up being a ton of fun. It was pretty basic at first, and the help embeds were *not very helpful*, but it got the job done.

I decided on the name *trigger_chan* to play off my own username of *trigger_segfault* as well as her being the mascot for Studio Trigger.

{:align="center"}
![PostgreSQL Database View](/blog/assets/img/postgresql-db.png)

Working on trigger_chan was also my first delve into really working with relational databases as well as Entity Framework Core. I *did* work with SQLite databases for Trigger's PC back in 2016, but these were static and edited by hand, it's very different to work with ones that require changes being made. It was pretty difficult to get used to, especially while trying to get the hang of code-first implementation.

{:align="center" .figure-text}
The MAL embed is still relatively the same as when it first came out.

{:align="center"}
![trigger_chan Old MAL Embed](/blog/assets/img/triggy-mal-old.png)

With v1 of the bot framework, each command was stored in it's own entry identified by name, so every subcommand of a command got its own entry. It was terrible and awful.

{:align="center" .figure-text}
The help list goes on and on and on.

{:align="center"}
![trigger_chan Old Help Embed](/blog/assets/img/triggy-help-old.png)

{:align="center" .figure-text}
The command help embed was at least a bit more helpful, although it lacked examples.

{:align="center"}
![trigger_chan Old Help Command Embed](/blog/assets/img/triggy-help-command-old.png)

Unfortunately, in the beginning and even now, Triggy was still hosted locally on my Computer. I didn't move her to AWS until after the 2019 started, and I still haven't nailed down what to do once the free year is up.

## [Discord Bot: trigger_chan v2 (Oct - present)](https://github.com/trigger-segfault/TriggerChan)

{:align="center" .figure-text}
The new image for Triggy after upgrading to my Bot Framework v2. [The avatar is by Zwimmy](https://www.deviantart.com/zwimmy/art/Trigger-chan-711192608).

{:align="center"}
![trigger_chan New Avatar](/blog/assets/img/trigger-chan-avatar-new.png)

Starting in October I began writing version two of my Discord.NET bot framework implementation. My goal was to fix a lot of the general flaws with the previous framework such as how commands are categorized, and how bad the help commands were. I also wanted to get Triggy up to standards to be Discord TOS compliant, which requires that end user data in databases be encrypted.

During the upgrade, I switched from SQLite to PostgreSQL to allow more advanced database migrations.

One of the other big changes to Triggy was migrating the audio player to using Lavalink, which does most of the hard work for you when it comes to playing audio. It supports YouTube and SoundCloud searches, as well as BandCamp, Twitch, and Vimeo urls.

More in depth view on the current state of trigger_chan [can be found here](/tools/trigger-chan/).

## [Grisaia Extract (May - Jun)](https://github.com/trigger-segfault/GrisaiaExtractor)

{:align="center"}
![Grisaia Extract Console](/blog/assets/img/grisaia-extract.png)

I'd consider the Grisaia trilogy one of my favorite visual novel series of all time. I'd worked with extracting graphics from visual novels before, and [there were already existing tools to do it for CatSystem2 games like Grisaia](http://asmodean.reverse.net/pages/exkifint.html), but I wanted to make the experience *better* for Grisaia. This process evolved over time from simply wrapping existing programs, to rewriting the existing codebase to be incorporated into C# as a native library. I got started using the helpful existing info on categorization from the [/r/Grisaia ripping wiki page](https://www.reddit.com/r/grisaia/wiki/ripping). And after that I spent a lot of time sifting through images to figure out the pattern to their name, and where to move each of them programmatically. The tool was pretty much done in May, but I decided to actually make it presentable for release in June, because I didn't know how long it would take before I made a proper UI. Post-release many hotfixes have come to update categorization.

## [TriggersTools.<wbr>SteinsGate.<wbr>Divergence (Jun)](https://github.com/trigger-segfault/TriggersTools.SteinsGate)

{:align="center"}
![Divergence Meter Examples](/blog/assets/img/triggerstools-steinsgate-divergence.png)

I created a library to draw the iconic [Divergence Meters](https://steins-gate.fandom.com/wiki/Divergence_Meter) from the popular visual novel and anime Steins;Gate. The purpose was to make drawing Divergence meters for memes or art quick and easy. I spent the first many days of this project just isolating the nixie tubes from the images that would allow them to be easily combined with one another. After the actual drawing code was done, I wrote a small program to generate the font for other characters using Oslo II. It took awhile to nail down a decent look, and it certainly doesn't look perfect, but I'm pretty happy with how it turned out.

## [Discovery of Shields.io Badges (Jun)](https://shields.io/)

{:align="center"}
![Example of Project with Shield.io Badges](/blog/assets/img/shield-io-badges.png)

I'd seen these badges used a lot in other repos, but never went out of my way to find out more about them, once I finally learned what they were called in June, I proceeded to absolutely plaster them on pretty much every repository that was maintained or of use to some degree.

## [Wiimote Experimentation (Jun - Sep)](https://github.com/trigger-segfault/WiimoteLib.Net)

{:align="center"}
![Wiimote Controller Overlay](/blog/assets/img/wiimote-controller.png)

I started fiddling around with Wiimote control to enable playing games from a couch with an easier-to-use controller. It began with looking at existing libraries and how they communicated with the Wiimote. The current system for Wiimote Bluetooth pairing in Windows 7 was a huge hastle of remove and readding the device every time it was needed. One of the goals of this work was to create a better system for easily pairing the Wiimote automatically.

{:align="center"}
![BSOD: Windows 10th Edition](/blog/assets/img/bsod-10.png)

One interesting thing I attempted was to modify the existing [HID-Wiimote](https://github.com/jloehr/HID-Wiimote) drivers to help support better pairing and passthrough so that the original controls could be retained without registering it as a different controller. It was interesting to learn how difficult it is to develop drivers, but it was also pretty fun. I took an old unused laptop and manages to hook it up to my main system with a debugger. Then I proceeded to-*Your PC ran into a problem and needs to restart*, to-*Your PC ran into a problem and needs to restart*... I crashed the laptop quite a lot. Although in the end I did learn a bit about HID descriptors and how USB decices work. I never made any usable progress with the drivers.

{:align="center"}
![Wiimote Audio Player](/blog/assets/img/wiimote-audio-player.png)

After getting the library up and running, I wanted to start looking into Wiimote Speaker playback, which for a long time has been relatively impossible to do well. The first part was that I had to purchase the latest Wiimote type which actually had better audio support. I don't think I ever got the original Wiimote to play anything identifiable. The hardest part was getting the ADPCM format down. I eventually found what seems to be the right version of it, but even then the audio sometimes fades out and in in the Wiimote, and conversion to lower sample rates in general is pretty destructive.

{% include youtube.html id="vNItdVw6ONs" center="true" %}

I've been using the Wiimote controller application that resulted from this project ever since it's inception. This paired with the DolphinBar has made the Wiimote Controller my personally most-used application to date.

## Finally Upgrading to Windows 10 (Jul)

On July 7th I finally caved and upgraded to Windows 10. The reason being: Everytime I tried to install .NET 4.7 in Visual Studio 2017, it would brick the entire IDE. Not even a reinstall could fix it, and I was sick of having to restore from backups everytime I learned this hasn't been fixed. The initial transition was frustrating at first. I immediately got Winaero Tweaker just to fix a few huge annoyances, messed around with the registry to fix more annoyances, and changed the system window AND taskbar color. I generally like Windows 10 now but there are still some very annoying issues that leave regrets...

My biggest problems with Windows 10 that still persist today are major graphical issues like white flashing when scrolling in certain UIs, the Start Menu just not showing the lower half for a split second when opening, and in-game movies flat out giving me a black screen with audio. I've messed around with the NVidia drivers quite a bit and nothing has resolved any of these issues. The other major issue I'm having is that system restores cannot be performed outside of safe mode, which adds an additional layer to the headache of having to perform a system restore in the first place. Once I get a new hard drive to shove my current install on, I plan to do a fresh install of Windows 10 to see if I can fix the issues, if this doesn't help then my graphics card is likely causing the problems, which is a pain because it worked absolutely fine in Windows 7.

I'm just one of those *unlucky few people who have bad luck with Windows 10 on their build.*

## [TriggersTools.<wbr>Build (Jul)](https://github.com/trigger-segfault/TriggersTools.Build)

{:align="center"}
![TriggersTools.Build NuGet Icons](/blog/assets/img/triggerstools-build.png)

I started futzing around with MSBuild Task NuGet packages to create a proper system for auto-updating the copyright year and keeping a build timestamp without having to manually set these up for every project. These build tasks have been really handy with the other projects I've worked on and allowed for additional laziness.

## [WinDirStat.Net (Aug)](https://github.com/trigger-segfault/WinDirStat.Net)

{:align="center"}
![WinDirStat.Net](/blog/assets/img/windirstat-net.png)

WinDirStat is tried and true, but their UI is quite outdated at this point, and often quite laggy at times. The scanning can also be slower than it needs to be as pointed out in [altWinDirStat](https://github.com/ariccio/altWinDirStat/issues/19).

I started work on creating a WPF implementation of WinDirStat and managed to get pretty far. This ended up being my first delve into MVVM, which was recommended by a friend. This also required *a lot* of code optimization and memory optimization. A lot of time was put into improving the UI responsiveness while still scanning, and generally improving the treeview render. The program came out quite nicely, but there are still some bugs to iron out and features to implement.

## [TriggersTools.<wbr>FileFind (Sep)](https://github.com/trigger-segfault/TriggersTools.FileFind)

{:align="center"}
![TriggersTools.FileFind NuGet](/blog/assets/img/triggerstools-filefind.png)

I had to recreate file enumeration in WinDirStat because of a large number of flaws with the .NET implementation, including enumeration exceptions and slow speed due to waste of resources. This library allows traversing a Windows file tree in many different orders while avoiding security exceptions and wasting time on checks that don't need to be made. This also has the option of returning the actual file information acquired during the file enumeration so that it doesn't go to waste.

## [TriggersTools.<wbr>DirectoryCaseSensitivity (Sep)](https://github.com/trigger-segfault/TriggersTools.DirectoryCaseSensitivity)

{:align="center"}
![TriggersTools.DirectoryCaseSensitivity NuGet](/blog/assets/img/triggerstools-dircase.png)

I'd started fiddling with Windows Subsystem for Linux and wanted to look into API support for Windows 10's new directory case-sensitivity functionality. Turns out there is no API for this in C#, or even in the Windows C API, we have to call low level `Nt` functions to get the proper info. I was able to whip up a C# API for getting this info, as well as `DirectoryInfo` extension methods. You can check, change, and create directories with case sentivity of either type without having to go through native calls yourself.

## [WebScriptDisplay (Sep)](https://github.com/trigger-segfault/WebScriptDisplay)

{:align="center"}
![WebScriptDisplay Page](/blog/assets/img/webscriptdisplay.png)

I got a request from my Dad to write a small page to display the results of cgi scripts on an [OpenVMS](https://en.wikipedia.org/wiki/OpenVMS) server for his work. I took the specifications and created a basic HTML page with Javascript that is easily modified to extend or add support for more scripts. The CSS style came later, but it was definitely an improvement over that of no CSS style. Apparently it's still on the server and in use today by other people, which is nice to hear.

## [Visual Novel List for a Stats Freak (Oct - present)](/anime/visualnovellist/)

{:align="center"}
![Visual Novel List Page](/blog/assets/img/vnlist.png)

By this point in time, I had played a decent number of visual novels, and keeping a blog post in MAL with all the data up to date was getting to be a hastle. I disassembled the MAL list page and recreated it for visual novel display. All visual novel data is now stored in a json file that keeps stores all information needed to display the VN entry. This list made things so much easier to view, enter in, and compare.

You can follow updates to this list by subscribing to the endless *Update vnlist.jsonc, Update vnlist.jsonc, Update vnlist.jsonc* commits, that are absolutely flooding the commit history and burrying out anything meaningful.

## [Grisaia Sprite Viewer (Nov - present)](https://github.com/trigger-segfault/GrisaiaSpriteViewer)

{:align="center" .figure-text}
The first public post displaying the progress of the sprite viewer in alpha. A heaping mess that *just works*.

{:align="center"}
![Grisaia Sprite Viewer Alpha](/blog/assets/img/grisaia-sprite-viewer-alpha.png)

The Grisaia Sprite Viewer is an ongoing project to create a program to view and manipulate in-game Grisaia sprites by taking all image parts and combining them into a single image. CatSystem2 games like Grisaia store their image parts in thounsands of different images that only get more and more specific as you go down the list of lighting, distance, pose, and blush level. Added with the fact that many characters use sprite parts differently, an entire data file was needed to keep track of how image parts are used and what they're called. The Sprite Viewer didn't make its first release until 2019, so more coverge of that will be shown in next year's blog post.

## [This Website Upgrade (Nov - present)](/)

{:align="center"}
![Site Header](/blog/assets/img/site-header-small-2018.png)

Before now, my personal GitHub Pages site was terribly underutilized and outright ignored most of the time. *It still is now,* but at least it gets some updates besides *Update vnlist.jsonc*. The previous iteration made use of my ancient Julia set Fractal Viewer program for the header so I decided to keep with this tradition, but go for a more minimal effect. The entire website's theme is pretty much a copy of the Jekyll's default Minima theme, but with some improvements and changes. There are also a few pages from the old site that stayed almost identical as they already had their own unique theme, such as the [RCT2 Tools](/tools/rct2-tools/) and the [TriggerCookies (dead) mod](/mods/trigger-cookies/).
