---
layout: post
title:  "trigger_death is now trigger_segfault"
date:   2019-05-14 11:10:00 -0400
#date_edited: 2019-05-14 11:10:00 -0400
categories: [dev, personal]
category: [dev, personal]
tags: [trigger_death, trigger_segfault, username, handle, change, rename, rebrand]
excerpt: I've been thinking about it over the last few months and decided it was time to rebrand myself from trigger_death to a new online username.
image: /blog/assets/img/trigger_segfault-avatar.png
preview: /blog/assets/img/trigger_segfault-avatar.png
---

{:align="center"}
![trigger Avatar](/blog/assets/img/trigger_segfault-avatar.png)

I've been thinking about it over the last few months and decided it was time to rebrand myself from *trigger_death* to a new online username. I've been using *trigger_death* for about 10 years now but I was starting to get recommendations to change things now that I'm looking to work in a professional environment. A *gamer tag* name from 10 years ago doesn't fare well in these times especially with the news lately.

## The Decision

It was already decided that I would keep the prefix *trigger_*, this has been an ongoing theme in my name and I've already played around with changing the postfix on Discord servers. Some posibilities were *trigger_segfault*, *trigger_source*, *trigger_dotnet*, and *trigger_desu*. Some of these names I ruled out due to conflicting search results. Others I ruled out due to the possibility of the name ever being taken, and one I ruled out because the name *was* already in use.

I ended up deciding on *trigger_segfault*, I was already leaning this way for awhile and decided that it hosted the most benefits and was easy enough to remember. The old name was straight forwards with what the Source SDK trigger_brush did, but the new name should have a story to it:

{:align="center"}
__trigger\_segfault__

{:align="center"}
*You walk into a room, there’s a mysterious corner with a health resupply kit.*<br>
*You walk over to it and then T̄̈̎h̥͛̄e̗̖͝ ̂ͣ͛g̿ͪͨå̪ͣm̊̋ͫe̹̥̦,̷̣̯ ̗̼͚tͩ͒͋h̓̀͌e͍̐͘ ͨ́̓u͒ͮ̃n̏ͮ͛҉͇̙͓i͈͍͂v̐ͤͫê͒́r͂ͪ̋s̍̽͑e̋̃͌,ͧ͋ͩ ͭͤ̈́aͪ̐̉n̹̭͗d͆ͨ̔ ̾̒̐ē̓ͣvͯͤͫě̏̌r̐̉̽y͆̾̅ṫ̎̓hͥ́ͨiͨ̆ͩnͥ̉ͪg̒͌̃ ̋ͨ̒i͋͐̔nͫ̔̽ ̀͆̒î̒ͮt͒͆̑ ̈́̄́҉̖́͞č͆̓rͮ͆ͮȧͬshes.*<br>
*Then your computer crashes.*<br>
*Then your electricity shuts off.*<br>
*Then Elon Musk tweets about genetically engineered catgirls.*<br>
*Then the whole internet infrastructure collapses and the world is sent into turmoil.*

**In Short:** All the trigger_brush really does is cause a memory access violation. *It's a feature!*

## The Process

I had to heavily weigh the pros and cons of performing this change. I've built up 5 years worth of search results for *trigger_death* and have already filled out the entire first page. This change would brutally kill my Search Engine Optimization score. The biggest hurdles were first making sure the change in GitHub username would not negatively impact the change of this GitHub Pages site's URL. I ended up creating a [GitHub organization for my old username](https://github.com/trigger-death) and setup a GitHub Pages site purely to redirect to the new GitHub pages URL. Sadly GitHub Pages does not support 301 redirects but there's nothing that can be done about that. It seems to work well so far, and I've read Google can handle redirects done the other way too, so I'm not terribly worried anymore.

For every site I can think of off the top of my head, I've gone and changed the username (if it supported it), or outright created a new account. This was a pain especially when I learned one site had a 15 character limit leaving me as *Triggersegfault* with no dash and enforced first letter capitalization. Some forums made things very easy, just a simple help request, and the username was changed, *and* all old URLs still worked because it relied on an ID at the end.

## The Results

The result is that many sites now 404 on my old username, many lead to a now-dead account (only some of which allow me to write out information to redirect people), and others are smart enough to support both names in URLs. Aside from GitHub pages, GitHub itself does an excellent job at redirecting old URLs and will automatically do this indefinitely unless the new *trigger_death* organization already has an existing repository for the same URL. What's amazing is even the API supports username changes, all [shields.io](https://shields.io/) badges are still functional and working properly!

{:align="center" .figure-text}
Hits are already being indexed for *trigger_segfault* by Google, just 24 hours into the change.

{:align="center"}
![Rebranding search results showing up](/blog/assets/img/rebrand-search-results.png)

The name change is definitely devastating, but at the same time it was becoming necissary. I have done this once now, and shall hopefully never have to do it again. Better late than never.

**One Final Note:** You will likely need to update your RSS feeds to be directed to the new [trigger_segfault.github.io](http://trigger-segfault.github.io/) domain. There isn't really a proper way to fix this.