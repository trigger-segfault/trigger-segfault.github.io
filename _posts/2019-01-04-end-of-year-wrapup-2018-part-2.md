---
published: false
layout: post
title:  "2018: End of Year Wrap-Up (Part 2)"
date:   2019-01-04 11:00:00 -0500
#date_edited: 2019-01-04 12:00:00 -0500
categories: [meta, dev, anime, gaming]
category: [meta, dev, anime, gaming]
tags: [wrap-up, pic]
excerpt: Part 2 of my 2018 End of Year Wrap-Up, covering all of 2018.
image: /blog/assets/img/end-of-year-wrapup-2018.png
preview: /blog/assets/img/end-of-year-wrapup-2018.png
---
## 2018 Coverage

<img class="center-image" src="/blog/assets/img/end-of-year-wrapup-2018.png" alt="Preview of 2018">

Now that I have a blog and feel obligated to post things. Let's follow in [my friend's footsteps](https://blog.huguesross.net/2018/12/2018-end-of-year-wrap-up.html) and create a wrap-up of this years development (and a little bit of last year's since a lot went on then too).

# 2018

## [Zelda Oracle Engine (Nov - Apr)](https://github.com/trigger-death/ZeldaOracle)

<img class="center-image" src="/blog/assets/img/zelda-oracle.png" alt="Zelda Oracle Engine logo">

The Zelda Oracle Engine is a pet project me and my [brother, cube_man](https://github.com/cubeman99) have had for a long time, crossing over many languages. In 2015, we gave it a good start in C# XNA and restarted then revived it in late November of 2017. During the revival we made many changes including transitioning to a WPF editor, *as that's what I specialize in*, it created a few headaches in same areas, but overall we got some improvements out of it, including a pretty nice script editor using AvalonEdit.

### Major Improvements: Everything

We have now surpassed any previous generations of this project (Java, and before that GameMaker). We transitioned to a paletted sprite system for maximum authenticity. We created an editor to feed and build `.conscript`'s in to get maximum representation of errors while compiling resources and checking that tiles were setup correctly. The new paletting system is a little overwhelming at first glance, although I did end up writing some tutorial conscripts.

<img class="center-image" src="/blog/assets/img/zelda-oracle-conscript-designer.png" alt="Conscript Designer Window">

The world editor saw some big improvements with an undo feature, which was pretty difficult to nail down. We also got a selection tool with different levels of layer support. My brother finally got the script API implemented, we decided to write the scripts in straight C#, with an API library for access to the game. The script editor uses Roslyn for much more advanced intellisense which is much nicer to work with than just an error message at the bottom of the window.

<img class="center-image" src="/blog/assets/img/zelda-oracle-world-editor.png" alt="World Editor Window">

The physics engine got an overhaul along with monster API. Pretty much every weapon got its implementation down. We also finally got side-scrolling view in, which is quite fun to play around in.

<p class="center-text">An example of a palette zone transition and making use of the game engine for memes.</p>

{% include gyfcat.html id="PartialMeaslyHoneyeater" id2="LimpJovialHusky" %}

<p class="center-text">We encountered a few <i>interesting</i> bugs along the way.</p>

{% include gyfcat.html id="MisguidedHealthyBaboon" id2="PaltryPartialHound" %}

It was great to get to work on this project again and great to work with my brother, who really knows what he's doing when he goes to implement something. The game wouldn't be even 1/10th as good as it is now without his help. cube_man worked mostly on the actual engine, while I worked more in the area of the editor and resource management. Most my time went to gathering and compiling the [tile list we see here](/blog/assets/img/zelda-oracle-tile-list.png). The project went on hiatus in April after slowly losing interest, but I have no doubt we'll pick it up again assuming we have the time.

## [Discord Bot: trigger_chan v1 (Apr - Oct)](https://github.com/trigger-death/TriggerChan)

<p class="center-text">The old avatar for Triggy before upgrading to my Bot Framework v2 with a new image.</p>

<img class="center-image" src="/blog/assets/img/trigger-chan-avatar-old.png" alt="trigger_chan Old Avatar">

On April 20th, a Discord server for an anime app I used opened up. We knew each other from another server so he gave me the go-ahead to setup a bot for the server to manage basic stuff such as MyAnimeList profile embeds. With this, I made my first treck into writing a Discord Bot, which ended up being a ton of fun. It was pretty basic at first, and the help embeds were *not very helpful*, but it got the job done.

I decided on the name *trigger_chan* to play off my own username of *trigger_death* as well as her being the mascot for Studio Trigger.

<img class="center-image" src="/blog/assets/img/postgresql-db.png" alt="PostgreSQL Database View">

Working on trigger_chan was also my first delve into really working with SQL databases as well as Entity Framework Core. I *did* work with SQLite databases for Trigger's PC back in 2016, but these were static and edited by hand, it's very different to work with ones that require changes being made. It was pretty difficult to get used to, especially while trying to get the hang of code-first implementation. I'm taking a databases class in this spring semester at college so I'm hoping that'll help improve my skills in this area.

<p class="center-text">The MAL embed is still relatively the same as when it first came out.</p>

<img class="center-image" src="/blog/assets/img/triggy-mal-old.png" alt="trigger_chan Old MAL Embed">

With v1 of the bot framework, each command was stored in it's own entry identified by name, so every subcommand of a command got its own entry. It was terrible and awful.

<p class="center-text">The help list goes on and on and on.</p>

<img class="center-image" src="/blog/assets/img/triggy-help-old.png" alt="trigger_chan Old Help Embed">

<p class="center-text">The command help embed was at least a bit more helpful, although it lacked examples.</p>

<img class="center-image" src="/blog/assets/img/triggy-help-command-old.png" alt="trigger_chan Old Help Command Embed">

Unfortunately, from the beginning and even now, Triggy is still hosted locally on my Computer, I'm still unsure of what the best method of hosting should be when I'm currently unemployed, but a student.

## [Discord Bot: trigger_chan v2 (Oct - present)](https://github.com/trigger-death/TriggerChan)

<p class="center-text">The new image for Triggy after upgrading to my Bot Framework v2. <a href="https://www.deviantart.com/zwimmy/art/Trigger-chan-711192608">The avatar is by Zwimmy</a>.</p>

<img class="center-image" src="/blog/assets/img/trigger-chan-avatar-new.png" alt="trigger_chan New Avatar">

Starting in October I began writing version two of my Discord.NET bot framework implementation. My goal was to fix a lot of the general flaws with the previous framework such as how commands are categorized, and how bad the help commands were. I also wanted to get Triggy up to standards to be Discord TOS complient, which requires that end user data in databases be encrypted.

During the upgrade, I switched from SQLite to PostgreSQL to allow more advanced database migrations.

One of the other big changes to Triggy was migrating the audio player to using Lavalink, which does most of the hard work for you when it comes to playing audio. It supports YouTube and SoundCloud searches, as well as BandCamp, Twitch, and Vimeo urls.

More in depth view on the current state of trigger_chan [can be found here](http://trigger-death.github.io/tools/trigger-chan/).