---
layout: page
title: Trigger-chan Discord Bot
permalink: /tools/trigger-chan/
---
<style>
  .discord-center {
    border-radius: 6px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
</style>

* **Version:**        v2.0
* **Source Code:**    [GitHub](https://github.com/trigger-segfault/TriggerChan)
* **Avatar:**         [Zwimmy 2017](https://www.deviantart.com/zwimmy/art/Trigger-chan-711192608)


Trigger-chan is a Discord bot I made for use in a small selection of Discord servers. Her selling features are spoilers, inserting claps between words, drawing Divergence Meters, and other fun or helpful commands. I decided to go with the theme of Trigger-chan as we both share the same name prefix. As such, her username is spelt like so: `trigger_chan`.

Trigger-chan was a pretty slapdash bot at first with a lot of the paint falling off, but she was upgraded to version 2 of my bot framework (which extends Discord.Net) in November 2018. The new framework hosts a much more intuitive help system, and more reflection to handle a wide variety of database situations, such as automatic conversion or encryption with an attribute. With framework version 2, Triggy finally was up to par with Discord TOS, which most small bots probably aren't, especially when they're just for small servers.

With version two of Triggy, I switched the avatar from official art, to one by [Zwimmy](https://www.deviantart.com/zwimmy/art/Trigger-chan-711192608), who draws some really cool and cute stuff.

## About

<div class="center-text">The <code>t/about</code> command shows a variety of statistics and other information on Trigger-chan. Most of these information tidbits have their own commands such as <code>t/prefix</code>, <code>t/stats</code>, and <code>t/uptime</code>.</div>
<img class="discord-center" style="max-height: 500px;" src="/tools/trigger-chan/assets/img/cmd-about.png">

## Help Menu

The help menu before framework v2 was an absolute disaster. Every command had it's own entry, so you'd have the admin commands `t/talkback`, `t/talkback cooldown`, `t/talkback reset`, and so on all as separate command entries.

<div class="center-text">This help menu is displayed when no parameters are passed.</div>
<img class="discord-center" style="max-height: 400px;" src="/tools/trigger-chan/assets/img/cmd-help-normal.png">

<div class="center-text">This help menu is displayed when you pass the name of the command.</div>
<img class="discord-center" style="max-height: 400px;" src="/tools/trigger-chan/assets/img/cmd-help-spoiler.png">

## Spoilers

Spoilers are by far the biggest feature for Trigger-chan. They add something that Discord sorely needs, yet lacks, *like most features*. Spoilers are created with the `t/spoiler` command. The spoiler command supports attachments, but they must be uploaded in your DM with Trigger-chan after calling `t/spoiler upload`.

<div class="center-text">Call the <code>t/spoiler</code> command and input the title of the spoiler between <code>{}</code>'s.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-spoiler-1.png">

<div class="center-text">React to 🔍 on the spoiler to see the message.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-spoiler-2.png">

<div class="center-text">You will get a DM from Trigger-chan.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-spoiler-3.png">

<div class="center-text">View your DM to read the spoiler. The spoiler will be removed from your DM if you unreact to 🔍.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-spoiler-4.png">

## Profiles

Trigger-chan allows users to register the usernames of their public profiles for [MyAnimeList](https://myanimelist.net), [AniList](https://anilist.co/), and [MyFigureCollection](https://myfigurecollection.net/). She also allows registering your timezone so other users can compare their time to yours.

<div class="center-text">The <code>t/mal</code> command manages MyAnimeList profiles.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-mal.png">

<div class="center-text">The <code>t/ani</code> command manages AniList profiles.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-ani.png">

<div class="center-text">The <code>t/mfc</code> command manages MyFigureCollection profiles.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-mfc.png">

## Grisaia Images

Because Grisaia is my favorite visual novel series. In relation to a friend who also adds images of their favorite VN their the bot, I added many Grisaia character sprites that you can call up.

<div class="center-text">This is called by the <code>t/michiru brag</code> command.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-michiru.png">

## Talkback

There are a few scenarios where Triggy will talkback to the user. 1) is when the user declares their love for her in some form or another, as seen below. And 2) is when 1) is not fulfilled, and they write a long enough sentence with the name triggy, Trigger-chan will react with her own emote.

<img class="discord-center" src="/tools/trigger-chan/assets/img/talkback.png">

## Statuses

Triggy has built-in status rotation, so after a random interval of time she will change to a new status. I tried to include a large amount of choices in hopes that people point them out when they like them.

<img class="discord-center" src="/tools/trigger-chan/assets/img/statuses.png">

## Other Commands

Here are just a few of the other fun commands that Triggy comes with.

<div class="center-text">The <code>t/asciify</code> command allows you to convert an image into text using the pre-Windows 10 console font and palette.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-asciify-1.png">

<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-asciify-2.png">

<div class="center-text">The <code>t/divergence</code> command draws a Divergence Meter from Steins;Gate with custom text. The <code>\</code> in this command allows the first space to be recognized.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-divergence.png">

<div class="center-text">The <code>t/emotes</code> command shows all server emotes.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-emotes.png">

<div class="center-text">The <code>t/downtime</code> command shows how long it's been since MyAnimeList (DeNA) stopped giving a shit.</div>
<img class="discord-center" src="/tools/trigger-chan/assets/img/cmd-downtime.png">
