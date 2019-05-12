---
layout: post
title:  "Deciphering a Password Save System"
date:   2019-05-11 16:00:00 -0400
date_edited: 2019-05-11 16:10:00 -0400
categories: [dev, anime, gaming]
category: [dev, anime, gaming]
tags: [password, save, decipher, reverse engineering, visual novel, hourglass of summer]
excerpt: I've worked on reverse engineering binary file formats before, and it can be quite difficult at times. That said, I've never tried to decipher a text-based format, even if it was as small as an 8-letter password.
image: /blog/assets/img/hourglasspass.png
preview: /blog/assets/img/hourglasspass.png
---

{:align="center"}
![Example Password](/blog/assets/img/hourglasspass.png)

I've worked on reverse engineering binary file formats before, and it can be quite difficult at times. That said, I've never tried to decipher a text-based format, even if it was as small as an 8-letter password. The full documentation explained in this post can be found on the [Hourglass of Summer: Documentation Wiki](https://github.com/trigger-segfault/HourglassPassword/wiki).

Special thanks go to [Porcupine's Detailed Walkthrough](https://gamefaqs.gamespot.com/dvd/924699-hourglass-of-summer/faqs/35923) as it was essential in speeding up my work, thanks to it's extensive listing of passwords and scene Title-Chapters.

{:align="center" .figure-text}
An example fully uncovered password in-game. (Normally you can only view one letter at a time due to technical limitations)

{:align="center"}
![Example Password](/blog/assets/img/hourglass-password-full.png)

I started [Hourglass of Summer](https://vndb.org/v32) on DVD by request of a friend, and I was surprisingly hooked even though the lack of certain key features present in most VNs made things frustrating and slow at times. As a game built to run on a DVD player, there are no save slots, and you are forced to write down an 8-letter password that represents the current point in the game you're at combined with the relevant choices you have made up until now. By day two, I wanted to tackle the password system and see if I could learn how it works so I could remove a lot of the hassle from the game. I went in expecting to futz around for a bit and get absolutely nowhere. I came out having learned the entirety of the system, the ID for every scene in the game, every game flag operation, and even a handful of glitches surrounding the password input system.

# Discovery

The first thing I tried to do was determine how the password stored its data. Did each letter act as a base-26 digit, or was each letter independent from each other? After whipping up a program to calculate password values based on the base-26 theory, I quickly ruled out that this was unlikely, especially because there were often letters that did not change in the password, even after key decisions in the game. If this were base-26, then, changes to one bit in the password would likely change up all letters in the password up to this bit, this being due to the fact that base-26 has no relation to binary base-2. Just like changing a single bit in a number can change numerous digits in a decimal number.

### Writing Down Passwords

The first task to help with deciphering was to write down the password for every scene I encountered in the game as I progressed. This slowed down the game progression a bit, but a large pool of data is important to see how the password varies over time, and it certainly did vary over time more than I was expecting. It became apparent that a few letters were changing every scene, and by accident at one point, I looked at half the password and had to go back into the menu to read it again, only to discover that the password had changed without leaving the pause menu.

{:align="center" .figure-text}
Notes that were taken for Scene passwords as they were encountered during regular gameplay.

{:align="center"}
![Password Notes](/blog/assets/img/hourglass-password-notes.png)

To see how much the password could vary without any changes in game data, I kept closing and opening the password menu to see what changed each time, and what it changed to. It boiled down to 10 letters in the same spots that would freely change between one another whenever I opened the menu. There was one other spot in the password that had different letter randomization, but I only looked into that later. This led to the first discovery of the what I called **[Garbage Letters](https://github.com/trigger-segfault/HourglassPassword/wiki/Password-Structure#garbage-letters)**, which are letters that represent unused or uninitialized data. Because I doubt any real RNG existed in the game, I expected that this password randomization was based on the timestamp in the pause menu when opening the password menu.

{:align="center" .figure-text}
These are the letters determined to be Garbage Letters.

{:align="center" .bold-table}
|B|D|F|I|K|
|:-:|:-:|:-:|:-:|:-:|
|M|Q|S|V|Y|

This first discovery was very helpful, as it simplified writing down, and even inputting passwords. Once memorized, you could easily use a single letter to denote any garabge letter in a password without having to make the password more complex. I often used this to my advantage when inputting large amounts of passwords a day by inputting `---OZYYYY` (where the first 3 letters are irrelevant).

### What's What in the Password

With the knowledge of garbage letters, it was now possible to *properly* track what parts of the password changed every scene. The first obvious change was that every scene, the first letter in the password changed, so that was obviously responsible for directing the game to the correct scene. Because there has to be more than 16 or even 26 scenes in the game, it must mean that *at least* a second letter would be needed to track the scene. The assumption was that the second letter in the password was likely the *second letter* in the scene variable. This left the password at 2-3 letters for scene info, and 6-5 letters for flag data.

### Letter Values

Once I discovered that 10/26 letters had no meaning, it became very likely that the password Letters were a cipher for hexadecimal, with each non-garbage letter representing a value between 0 and 15. After isolating parts of the password by usage, my first method for determining the value for each letter was by seeing what *non-garbage letters* changed during KEY choices in the story, then changing the password and going back to the scene to see how the letters changed again. This is where the trouble started, because I failed to record the correct initial values of the flag letters before changing, this led to the issue where estimating the values of each letters based on flag operations always returned inconsistent results that didn't match up with any operation.

I gave up on the flags for a bit and tried to look more into the scene variable again. I recorded each scene's password from the beginning of the game as I encountered it while also taking into account choices leading to different scenes. It was still unclear if the Title, Chapter format of DVD sections were used internally in the password, or mapped by the game outside of the password, but after following the progression of the first letter of the password, it seemed like the scene was incrementing the value by one every time, this meant the Scene was stored as an ID instead of Title-Chapter, unlike what I had hoped, but it also gave away the value of every *non-garbage letter* in the password. Not only did this pattern continue onto the second letter, but that second letter helped enforce the possible values of the letters.

{:align="center" .figure-text}
This is the uncovered pattern to the order of the early-game Scene IDs, which uncovers each letter's numeric order.

```txt
A-U? -G-W? -H-N? -T-O?       -CA-GA-*-WA-JA-LA?      -XA-ZU...
| |-E   |-J   |-P   |-X--ZA?        |       |-HA           
| +-C   +-L   +-R   +-AA |          |       +-NA-PA?       
|                        |-UA    Anime OP        |-RA      
Start of Game            +-EA                    |-TA      
                                                 +-OA      
```

### Password Input Glitch

While I was trying to work with the early-game scene IDs I discovered and dreaded the fact that early-game passwords were not accepted by the Password Input Menu. I followed the Scene IDs until it did work (which was at scene **ZA**) and tried replacing the pattern `-G-X----` <sup>(where **G** is a garbage letter)</sup> with `-Z-O----` based on the assumption that **Z** was the letter for zero. I got the **O** based on what was used in later scene IDs. I didn't fully understand why this worked, or why the glitch occurred until the final days working on the documentation, the only thing I really understood was that the fourth letter of **X** did not make the Password Input Menu a happy camper. My original assumption was also that garbage letters were presented as such, but were not actually a valid second Scene ID letter, although that was changed when I later learned that later IDs did not like **Z** for some reason.

{:align="center" .figure-text}
You reach this screen and are presented with *flawless English* when the password you have entered in is considered invalid.

{:align="center"}
![Invalid Password Screen](/blog/assets/img/hourglass-invalid-password.png)

### Determined Letter Values

The following **[Valid Letters](https://github.com/trigger-segfault/HourglassPassword/wiki/Password-Structure#valid-letters)** were then tested and confirmed to represent these values. I was correct in the assumption that **Z** stood for zero although most of my other guesses were proven wrong.

{:align="center"}
|  #  |Bin   |Hex|Dec
|:---:|:----:|:-:|:--:
|**Z**|`0000`|`0`|`0` 
|**A**|`0001`|`1`|`1` 
|**U**|`0010`|`2`|`2` 
|**E**|`0011`|`3`|`3` 
|**C**|`0100`|`4`|`4` 
|**G**|`0101`|`5`|`5` 
|**W**|`0110`|`6`|`6` 
|**J**|`0111`|`7`|`7` 
|**L**|`1000`|`8`|`8` 
|**H**|`1001`|`9`|`9` 
|**N**|`1010`|`A`|`10`
|**P**|`1011`|`B`|`11`
|**R**|`1100`|`C`|`12`
|**T**|`1101`|`D`|`13`
|**O**|`1110`|`E`|`14`
|**X**|`1111`|`F`|`15`

# Comprehension

At this point I was regularly updating the password Wiki to keep all knowledge up to date, and easy to access anywhere when I had an idea. The next few days were spent writing a framework for the Password structure and also collecting in-game flag operations and in-game Scene IDs for each Title-Chapter. With the letter values known, it was quickly determined that only bitwise OR and bitwise AND were used to modify flags which made uncovering the flags a bit <sup>(heh)</sup> easier.

### 3rd Scene ID Letter

After looking over my later written down passwords, I noticed that the normal 4 random letters that could be in place for the 3rd letter in the password changed. I looked into the values and noticed that each of these new 4 random letters were one higher than each of the previous 4. This finally explained the *other* mystery randomized letter in the password. I concluded that the first 2 bits in this letter determined the highest part of the Scene ID, while the last 2 bits were always randomized and could be safely ignored. This assumption turned out to be true right off the bat from testing. The Scene ID was now guessed to be the first 3 letters of the password, and the Flag Data was assumed to be the last 5.

{:align="center" .figure-text}
Below are the real letter values, and what other letters can represent them. **E** and friends are crossed out because there are not enough Scene IDs in the game to reach these high values, *and* they are not accepted by the Password Input Menu.

{:align="center"}
|   Z   |   A   |   U   |<del>   E   </del>
|:-----:|:-----:|:-----:|:----------------:
|Z C L R|A G H T|U W N O|<del>E J P X</del>

### Password Library

I had been updating the password library along with the discoveries I made and now I was finally able to analyze a password and output a coherent explanation of what was input. Garbage and Valid letters were automatically replaced with the proper type of letter, so even normally-invalid passwords could be converted to valid ones, this was more helpful for me as it saved time during input.

<!--{:align="center" .figure-text}
The password testing console program.

{:align="center"}
![Password Analyzer](/blog/assets/img/hourglass-analyzer.png)-->

{:align="center" .figure-text}
The in-progress graphical user interface program password.

{:align="center"}
![Password Analyzer](/blog/assets/img/hourglass-gui-analyzer.png)

### Making use of the Knowledge

The first time I tried to make use of everything I had learned, and the flags I had written down, was when trying to jump to the next character route to play. I had already seen all scenes that lead up to this route, so there was no reason I should need to play them again to get there. By combining 5 documented flag operations related to Tomomi, and knowing the Scene ID just before her route was initiated, I came up with the password `OEZLWLEB`. This worked correctly and put me right at the beginning of the route like I intended.

### Garbage Checksum and First Flag Letter

For now I had always assumed that the first flag letter (and 4th letter in the password) **F<sup>4</sup>** was a special letter where the operations of OR and AND are reversed. This letter started out as **X** (all bits set) and slowly lowered in value over time. Messing around with it also proved that it would trigger the Password Input Menu to reject the password. At this point I had no idea how complex the input validator was, but I wanted to fully understand how it worked. I tried seeing if it could function as some sort of checksum based on the rest of the letters in the password. After looking at its change in value through all of the recorded flag operations and scene passwords, I started noticing that it was often changed just during flag operations, but not always. Trying to figure out why it changed, I noticed that one letter was always being changed to or from a garbage letter during every change to the fourth letter.

After furthur investigation, I confirmed that this checksum letter had everything to do with the garbage letters. The next step was figuring out how it was generated and how to take it apart. After looking at the changes in the letter's bits, only one bit changed every time the checksum changed, this lead to the conclusion that each bit corresponded to a single potential garbage letter in the password. This was quickly confirmed by messing around with the Password Input Menu and generating valid passwords through changing the checksum and potential garbage letters. This is when the term **[Garbage Checksum](https://github.com/trigger-segfault/HourglassPassword/wiki/Password-Structure#garbage-checksum)** was coined to describe the letter's behavior. Each *nth* bit in the letter is set, when the *nth* potential garbage letter in the password is a garbage letter.

{:align="center" .figure-text}
Each bit in the Garbage Checksum is set when the specified letter is a garbage letter.

{:align="center"}
|Bit       |3|2|1|0
|---------:|-|-|-|-
|**Letter**|F<sup>8</sup>|F<sup>7</sup>|F<sup>6</sup>|S<sup>2</sup>

Although this didn't directly explain *how* the Password Input Glitch occurred, it did shed light on *why* the solution worked. **O** worked because the first potential garbage letter was **Z** instead of an actual garbage letter, this validated the garbage checksum without requiring the use of **X**. This brought on the final big discovery about the password structure...

### The End of Garbage Letters

Once I had discovered that **Z** was a valid replacement for the first potential garbage letter, and changing the garbage checksum actually produced a valid result, I tested if other letters could be **Z** instead of garbage letters. **Z** could replace *any* potential garbage letter! This meant that password input could be simplified **even more**, `AZZZZZZZ` was a completely valid password that would take you to the very beginning of the game! It complied with all of the rules, and even supplied the correct flags for that point in time. This was a game changer, as it opened up a whole new way to easily and lazily input passwords.

Once this point was reached, the documentation for the **[Password Structure](https://github.com/trigger-segfault/HourglassPassword/wiki/Password-Structure#structure-of-a-password)** was completed and corrected.

### Branching Scene IDs

While recording later Scene IDs, I soon discovered that certain IDs were skipped altogether with no real explanation for why that was necessary. After inputting these Scene IDs into the Password Input Menu, it took me to the next Scene ID. What I soon noticed was that the Scene ID I was taken to was a conditional scene. This scene was only hit if you had made certain decisions in the past that set the appropriate flags. By testing different flag combinations, it became clear that the sole purpose of these Scene IDs were to send the game to a different Scene based on a condition. Knowledge of these Scene IDs had very little benefit, but it was simply more information that explained the inner workings of the game.

{:align="center" .figure-text}
An example of how a Scene branches based on condition.

{:align="center"}
![Branch F/\\ jumps to the first choice if `flags & "ZZCZ"`, `else` the second choice.](/blog/assets/img/hourglass-branch-chart.png)

I later encountered a few branches in the story that did not make use of a locatable Scene ID which was strange. As the game strictly clamps the range of Scene IDs inputtable in the Password Input Menu, this is one mystery that will never be solved. If they do have Scene IDs, they are not accessible. If they do not have Scene IDs, then the previous scene is likely able to perform the same branching operations. It is also very possible that these are developer Scene IDs, but with no way to confirm this, it will be left as speculation.

### Misunderstanding

While testing the conditions for branching scenes, I noticed that conditions weren't being properly honored while entering in **X**. This occurred whenever I entered **X** into the last letter slot. For whatever reason, **X** in the last slot of the password would always direct you to the first result in a branching scene. The tests so far always brought the game to the positive outcome of a scene and this was incorrectly guessed to be a cheat or developer command to help skip through the story. It only become clear what was really going on near the very end of things.

# Mastery

The final stretch of documentation involved finishing the entirety of the game, recording every possible Scene ID's Title-Chapter, and logging every existing flag operation. This information needed to be done soon, as once the trial for the only software to play Hourglass of Summer was up, there would be no going back to running the game without forking over subscription money for a product that only has one specific use to me.

### Password Input Glitch Clarity

The final *AHAH* moment was when I discovered the truth of the many strange behaviors of the Password Input Menu. **X** had been known to cause problems or special behavior for a Input Menu in certain places and it was just assumed to be how things were. All of this actually stemmed from one single and annoying glitch with the Password Input Menu: Inputting **X** at letter **C<sup>4</sup>** or **F<sup>8</sup>** would retroactively overwrite the 3 previous letters the moment it was entered. This was actually discovered by chance while trying to document a known crash in the game by navigating a previously input password.

**X** *is and can* be used as a valid letter at **C<sup>4</sup>** or **F<sup>8</sup>**, but it turns out that the only way to do it right, is by entering it in *before* entering in the previous 3 letters. If the password input navigation arrows didn't exist, this would make the bug much more troublesome and impossible to fix in certain situations.

After encountering this, I learned how to trigger the crash. Apparently Garbage letters behave differently when overwritten by the *now labeled* **[Propagating X Input](https://github.com/trigger-segfault/HourglassPassword/wiki/Password-Input-Glitches#propagating-x-input-invalid-x)** glitch. This special behavior also helps because it keeps the garbage letters as such and allows the garbage checksum to stay valid. The problem with these garbage letters, is if you navigate to them in the Password Input Menu *after* Propagating X Input overwrites it, the game will crash (at least on the player I used).

{:align="center" .figure-text}
What the input looks like before Propagating X.

{:align="center"}
![Before Propogating X, the first 3 letters as previously input](/blog/assets/img/hourglass-propagating-x-before-sm.png)

{:align="center" .figure-text}
What the input looks like after Propagating X.<br>Navigating to **S<sup>2</sup>** will crash the game as it was previously input as a garbage letter.

{:align="center"}
![After Propogating X, the first 3 letters are all X](/blog/assets/img/hourglass-propagating-x-after-sm.png)

### Everything is Here

On April 30th, 13 days after starting the game, I had finished writing down every Scene ID Title-Chapter combination, every Branching Scene, every Scene of Interest, and every flag operation that took place in the game. It turned out some Scene IDs were observable, yet outside of the accepted range of the Password Input Menu.  The range is from **ZZZ** to **OAU**, leaving room for 542 valid Scene IDs. The game recycles flags a lot due to the limited number of available bits in the flag data (16). Often right before a choice, or before a major choice tree, a few or numerous flag bits are cleared or *freed* so that they can be set by a later choice. These clear operations are always hit to ensure that the flags are never misinterpreted by the game.

## Future Plans

Although the documentation is basically complete for Hourglass of Summer, there are a few areas that could use some extra oomph. A flowchart that visually represents the Scene tree in the game would make navigating more straight forwards, although it would be a big endeavor to undertake. Another goal is to take all of this documented information and shove it into a password generator/reader. An application or web app that will give you the password based on supplied conditions, or take apart a password and tell you what all of it means. If either of these are eventually finished, then they will be linked below.