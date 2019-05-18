---
layout: post
title:  "2018: End of Year Wrap-Up (Part 1)"
date:   2019-01-03 13:50:00 -0500
date_edited: 2019-05-05 16:00:00 -0400
categories: [meta, dev, gaming]
category: [meta, dev, gaming]
tags: [wrap-up, pic]
excerpt: Following in my friend's footsteps, I'm creating my own end of the year wrap-up, covering what I've done over what feels like an extremely long time period. This covers the second half a 2017 where a lot went on.
image: /blog/assets/img/end-of-year-wrapup-2018.png
preview: /blog/assets/img/end-of-year-wrapup-2018.png
---
## *With special guest:* Second half of 2017

{:align="center"}
![Preview of 2018](/blog/assets/img/end-of-year-wrapup-2018.png)

Now that I have a blog and feel obligated to post things. Let's follow in [my friend's footsteps](https://blog.huguesross.net/2018/12/2018-end-of-year-wrap-up.html) and create a wrap-up of this years development (and a little bit of last year's since a lot went on then too).

# 2017

## Terraria Tools (Aug - September)

In late 2017, I pumped out 7 different Terraira tools with different functionality. Although they were built in released in quick succession, I don't feel that any of them were really rushed.

### [Terraria Midi Player (Aug 9th)](https://forums.terraria.org/index.php?threads/terraria-midi-player-play-songs-through-terrarian-instruments.61257/)

{:align="center"}
![Terraria Midi Player Window](/blog/assets/img/terraria-midi-player.png)

Starting in July of 2017, I got the idea of playing midi's through Terraria's instruments. These instruments function by playing a note based on the distance of the mouse click from the player, which a range of 2 octaves and a high C. I originally looked into doing it through TSA tools but realized programming my own solution would be a lot easier. Through the development of the tool I made 3 videos presenting the potential of the tool, including multiple-musician performances.

{:align="center" .figure-text}
Below are the tools in their early stages before they were anywhere close to complete.

{% include youtube.html id="NsOI2k8nKbQ" id2="BAXK9uwE_BI" %}

{:align="center" .figure-text}
The culmination of the tool was creating a performance of one of my favorite retro songs, Tal Tal Heights.

{% include youtube.html id="rP4O6BsBEh0" center=true %}

### [Terraria Item Modifier (Aug 23rd)](https://forums.terraria.org/index.php?threads/terraria-item-modifier-a-patch-for-advanced-item-customization.61419/)

{:align="center"}
![Terraria Item Modifier Window](/blog/assets/img/terraria-item-modifier.png)

In accordance with playing faster notes with Terraria Midi Player, I created a patcher for the purpose of decreasing instrument use-time. I based my code off of [TerrariaPatcher](https://forums.terraria.org/index.php?threads/1-3-terrariapatcher-plugins-and-more-works-with-tmodloader-now.24615/) and continued from there. Aside from the terrible choice in name due to [Item Modifiers](https://terraria.gamepedia.com/Modifiers) being a thing in-game. This tool does its job well.

### [TConvert (Aug 30th)](https://forums.terraria.org/index.php?threads/tconvert-extract-content-files-and-convert-them-back.61706/)

{:align="center"}
![TConvert Window](/blog/assets/img/tconvert.png)

TConvert was my attempt to take the existing tool, TExtract, and add an extra layer of being able to convert images and assets back to the original `.xnb` format. TExtract had been experiencing bugs for awhile with no contact from the author, so eventually TConvert was replaced in the Tools & Modifications pinned posts section.

{:align="center" .figure-text}
Using TConvert and Terraria Item Modifier (for placing pots), I created the assets to make this video.

{% include youtube.html id="n8VMKrh0Bsc" center=true %}

### [Quick Wave Bank (Sep 7th)](https://forums.terraria.org/index.php?threads/quick-wave-bank-an-easy-no-hassle-wave-bank-creator.61813/)

{:align="center"}
![Quick Wave Bank Window](/blog/assets/img/quick-wave-bank.png)

In the past, creating Wave Banks for Terraria was a long and tiresome project. There were tons of prerequisites to install and even then, adding and ordering songs was tough. This tool simplified the process by taking the underlying tool `XactBld3.exe` and running it through the program after generating a project file automatically.

I'm currently unhappy with the UI layout for how to add songs to the list. They can be reorganized, but songs can't be put at, say, index 30 if you only have 20 tracks added.

### [Terraria Rupee Replacer (Sep 10th)](https://forums.terraria.org/index.php?threads/rupee-replacer-change-coins-into-rupees-vanilla-tmodloader.61916/)

{:align="center"}
![Terraria Rupee Replacer Window](/blog/assets/img/terraria-rupee-replacer.png)

By far my favorite Terraria Tool created: Terraria Rupee Replacer does what it says on the tin, it replaces all instances of coins with Rupees. You have the ability to choose your own color set and optionally modify other assets that mention coins. Any mention of coins in the language packs has been replaced. This was a much more difficult patcher to implement than Terraria Item Modifier. There were many more functions that required hooking into, and getting the coin glow was especially tough.

{:style="display: flex; justify-content: center; flex-wrap: wrap;"}
![Rupee Pickup](/blog/assets/img/rupee-pickup.gif)&nbsp;![Rupee Coin Portal](/blog/assets/img/rupee-coin-portal.gif)

### [Terraria Localization Packer (Sep 13th)](https://forums.terraria.org/index.php?threads/localization-packer-unpack-and-repack-terraria-translation-files.61972/)

{:align="center"}
![Terraria Localization Packer Window](/blog/assets/img/terraria-localization-packer.png)

This was a small little tool I decided to create after Terraria Rupee Replacer thanks to my experience in delving into the localization files for replacing all mentions of coins with Rupees.

### [Terra Launcher (Sep 24th)](https://forums.terraria.org/index.php?threads/terra-launcher-a-hub-terraria-games-servers-tools-with-save-folder-modification.62315/)

{:align="center"}
![Terra Launcher Window](/blog/assets/img/terra-launcher.png)

Because of my patcher programs that relied on modifying the game and associated saves, I wanted a way to access *different Terrarias* without having to shift around my save folders all the time. The solution was a launcher where you just enter in the versions of Terraria you have and enter the save directory (which gets set through command line arguments). I also added the option for storing different server configurations as well as tools for the game. With the tool feature even having the ability to open up a project file for that tool if you have that path entered in.

## RollerCoaster Tycoon 2 Work

I got back into RollerCoaster Tycoon 2 again by tackling the upgrading of my existing RCT2 Tools with WPF variants. This later lead me back to my second round of OpenRCT2 contributions.

### RCT2 Tools: WPF Edition (Oct - Nov)

I created a whole new library for WPF controls that looked like RCT2 controls. It works terribly in the designer, but well during runtime. These tools were never finished, or released, but I may as well upload what *has* been done to GitHub. I tried to rebuild them today and found out that the Pixel Shader BuildTask extension for Visual Studio was gone from CodePlex. Thankfully I managed to extract it from the archive, thanks to the help of [CodePlexArchiveExtractor](https://github.com/galatrash/CodePlexArchiveExtractor). Seriously this tool is a life saver.

{:align="center"}
![WPF Maze Generator Window](/blog/assets/img/wpf-maze-generator.png)

The maze generator was by far the most difficult tool to build because WPF refuses to perform pixel graphics operations efficiently with a passion. I included a ton of new features, my favorite being the maze and entrance textures.

{:align="center"}
![WPF Water Creator Window](/blog/assets/img/wpf-water-creator.png)

The water creator went through an overhaul of its own with Paint.NET like color sliders and color shifting to help quickly bang out new water colors without much trouble.

{:align="center"}
![WPF Steam Stub Window](/blog/assets/img/wpf-steam-stub.png)

The Steam stub added support for all RollerCoaster Tycoon games, including classic. Along with the ability to customize the launcher setup.

### [OpenRCT2 Contributions: part 2 (Oct - Nov)](/games/openrct2#contributions-2017)

For the second time, I ended up adding my own contributions to OpenRCT2 and fixing a few bugs (most notably viewport scrolling). I spent a heavy amount of time on the Title Sequence Editor since I had left it a mess previously.

Because this information is already well documented, [all contributions in 2017 can be found here.](/games/openrct2/#contributions-2017)

{:align="center"}
![OpenRCT2 Place Path over Entrances](/games/openrct2/assets/img/park-entrance-path.gif)

# 2018

2018's coverage is continued in the *long overdue* [2018: End of Year Wrap-Up (Part 2)]({% post_url 2019-05-05-end-of-year-wrapup-2018-part-2 %}).