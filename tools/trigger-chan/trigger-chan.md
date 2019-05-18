---
layout: page
title: Trigger-chan Discord Bot
permalink: /tools/trigger-chan/
description: A walkthough of trigger_chan's discord bot abilities and features.
---
<style>
  /*.discord-center {
    border-radius: 6px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }*/
  .discord-center > img {
    border-radius: 6px;
    /*display: block;*/
  }
</style>

* **Version:**        v2.0
* **Source Code:**    [GitHub](https://github.com/trigger-segfault/TriggerChan)
* **Avatar:**         [Zwimmy 2017](https://www.deviantart.com/zwimmy/art/Trigger-chan-711192608)

Trigger-chan is a Discord bot I made for use in a small selection of Discord servers. Her selling features are spoilers, inserting claps between words, drawing Divergence Meters, and other fun or helpful commands. I decided to go with the theme of Trigger-chan as we both share the same name prefix. As such, her username is spelt like so: `trigger_chan`.

Trigger-chan was a pretty slapdash bot at first with a lot of the paint falling off, but she was upgraded to version 2 of my bot framework (which extends Discord.Net) in November 2018. The new framework hosts a much more intuitive help system, and more reflection to handle a wide variety of database situations, such as automatic conversion or encryption with an attribute. With framework version 2, Triggy finally was up to par with Discord TOS, which most small bots probably aren't, especially when they're just for small servers.

With version two of Triggy, I switched the avatar from official art, to one by [Zwimmy](https://www.deviantart.com/zwimmy/art/Trigger-chan-711192608), who draws some really cool and cute stuff.

## About

{:align="center"}
The `t/about` command shows a variety of statistics and other information on Trigger-chan. Most of these information tidbits have their own commands such as `t/prefix`, `t/stats`, and `t/uptime`.

{:align="center" .discord-center}
![About Command](/tools/trigger-chan/assets/img/cmd-about.png){:style="max-height: 500px"}

<!--<div class="center-text">The <code>t/about</code> command shows a variety of statistics and other information on Trigger-chan. Most of these information tidbits have their own commands such as <code>t/prefix</code>, <code>t/stats</code>, and <code>t/uptime</code>.</div>
<img class="discord-center" style="max-height: 500px;" src="/tools/trigger-chan/assets/img/cmd-about.png">-->

## Help Menu

The help menu before framework v2 was an absolute disaster. Every command had it's own entry, so you'd have the admin commands `t/talkback`, `t/talkback cooldown`, `t/talkback reset`, and so on all as separate command entries.

{:align="center"}
This help menu is displayed when no parameters are passed.

{:align="center" .discord-center}
![General Help Command](/tools/trigger-chan/assets/img/cmd-help-normal.png){:style="max-height: 400px"}

{:align="center"}
This help menu is displayed when you pass the name of the command.

{:align="center" .discord-center}
![General Help Command](/tools/trigger-chan/assets/img/cmd-help-spoiler.png){:style="max-height: 400px"}

## Spoilers

Spoilers were by far the biggest feature for Trigger-chan. They added something that Discord sorely needed, yet lacked, *like most features*. Spoilers are created with the `t/spoiler` command. The spoiler command supports attachments, but they must be uploaded in your DM with Trigger-chan after calling `t/spoiler upload`.

This command isn't really needed anymore thanks to Discord finally implementing real spoilers, but it still has some edge cases, and the system needs to remain active to keep all legacy spoilers alive.

{:align="center"}
Call the `t/spoiler` command and input the title of the spoiler between `{}`'s.

{:align="center" .discord-center}
![Spoiler Input Command](/tools/trigger-chan/assets/img/cmd-spoiler-1.png)

{:align="center"}
React to 🔍 on the spoiler to see the message.

{:align="center" .discord-center}
![Spoiler Output Embed](/tools/trigger-chan/assets/img/cmd-spoiler-2.png)

{:align="center"}
You will get a DM from Trigger-chan.

{:align="center" .discord-center}
![Trigger-chan DM Notification](/tools/trigger-chan/assets/img/cmd-spoiler-3.png)

{:align="center"}
View your DM to read the spoiler. The spoiler will be removed from your DM if you unreact to 🔍, so the spoiler is toggleable.

{:align="center" .discord-center}
![Trigger-chan DM Spoiler](/tools/trigger-chan/assets/img/cmd-spoiler-4.png)

## Profiles

Trigger-chan allows users to register the usernames of their public profiles for [MyAnimeList](https://myanimelist.net), [AniList](https://anilist.co/), and [MyFigureCollection](https://myfigurecollection.net/). She also allows registering your timezone so other users can compare their time to yours.

{:align="center"}
The `t/mal` command manages MyAnimeList profiles.

{:align="center" .discord-center}
![MyAnimeList Profile Embed](/tools/trigger-chan/assets/img/cmd-mal.png)

{:align="center"}
The `t/ani` command manages AniList profiles.

{:align="center" .discord-center}
![AniList Profile Embed](/tools/trigger-chan/assets/img/cmd-ani.png)

{:align="center"}
The `t/mfc` command manages MyFigureCollection profiles.

{:align="center" .discord-center}
![MyFigureCollection Profile Embed](/tools/trigger-chan/assets/img/cmd-mfc.png)

## Grisaia Images

Because Grisaia is my favorite visual novel series. In relation to a friend who also adds images of their favorite VN to their the bot, I added many Grisaia character sprites that you can call up.

{:align="center"}
This is called by the `t/michiru brag` command.

{:align="center" .discord-center}
![Michiru Brag Reaction Image](/tools/trigger-chan/assets/img/cmd-michiru.png)

## Talkback

There are a few scenarios where Triggy will talkback to the user. 1) is when the user declares their love for her in some form or another, as seen below. And 2) is when 1) is not fulfilled, and they write a long enough sentence with the name triggy, Trigger-chan will react with her own emote.

{:align="center" .discord-center}
![Trigger-chan abusing her users](/tools/trigger-chan/assets/img/talkback.png)

## Statuses

Triggy has built-in status rotation, so after a random interval of time she will change to a new status. I tried to include a large amount of choices in hopes that people point them out when they like them.

{:align="center" .discord-center}
![Trigger-chan Watching the Bee Movie, but every bee is replaced with a cute anime girl](/tools/trigger-chan/assets/img/statuses.png)

## Other Commands

Here are just a few of the other fun commands that Triggy comes with.

{:align="center"}
The `t/asciify` command allows you to convert an image into text using the pre-Windows 10 console font and palette.

{:align="center" .discord-center}
![Asciify in Progress](/tools/trigger-chan/assets/img/cmd-asciify-1.png)

{:align="center" .discord-center}
![Asciify Completed](/tools/trigger-chan/assets/img/cmd-asciify-2.png)

{:align="center"}
The `t/divergence` command draws a Divergence Meter from Steins;Gate with custom text. The `\` in this command allows the first space to be recognized.

{:align="center" .discord-center}
![Divergence Command to create an Omega Attractor Field worldline](/tools/trigger-chan/assets/img/cmd-divergence.png)

{:align="center"}
The `t/emotes` command shows all server emotes.

{:align="center" .discord-center}
![An image showcasing all server emotes](/tools/trigger-chan/assets/img/cmd-emotes.png)

{:align="center"}
The `t/downtime` command shows how long it's been since DeNA *or whoever owns MyAnimeList now* stopped caring.

{:align="center" .discord-center}
![177 days since the MAL API was sunk due to the GDPR](/tools/trigger-chan/assets/img/cmd-downtime.png)
