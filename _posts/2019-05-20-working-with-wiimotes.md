---
layout: post
title:  "Working with Wiimotes"
date:   2019-05-20 19:10:00 -0400
#date_edited: 2019-05-20 19:10:00 -0400
categories: [dev, gaming]
category: [dev, gaming]
tags: [wiimote, wii remote, wii, nintendo, controller, hid, bluetooth]
excerpt: I started fiddling around with Wiimote control to enable playing games from a couch with an easier-to-use controller. It began with looking at existing libraries and how they communicated with the Wiimote.
image: /blog/assets/img/wiimote-article.png
preview: /blog/assets/img/wiimote-article.png
---

This post is a more in-depth coverage of the Wiimote Experimentation in the [2018: End of Year Wrap-Up (Part 2)]({% post_url 2019-05-05-end-of-year-wrapup-2018-part-2 %}). The unorganized source code can be [found here](https://github.com/trigger-segfault/WiimoteLib.Net).

{:align="center"}
![Wiimote Controller Overlay](/blog/assets/img/wiimote-fade.png)

I started fiddling around with Wiimote control to enable playing games from a couch with an easier-to-use controller. It began with looking at existing libraries and how they communicated with the Wiimote. The current system for Wiimote Bluetooth pairing in Windows 7 was a huge hassle of removing and re-adding the device every time it was needed. Wiimotes that have been turned off *must* be removed from the device list and then re-added in order to be detected, it's a big chore to manually do this every time so there needed to be an automatic method. This was one of the goals of this project: To create a better system for easily pairing the Wiimote.

Getting Windows 7's Bluetooth to cooperate with Wiimote connection and disconnection was a huge headache and ended up as a bit of a hack. In the end I succeeded in creating a system to handle this for the user. No more manually removing and re-adding your Wiimote device! The system revolved around asynchronously checking for available Wiimotes every so often and comparing them with the list of registered Wiimotes. During this phase, we also check to see if any registered Wiimotes are no longer detectable. For new Wiimotes, and no-longer-detectable Wiimotes, we manually remove them from the system's device list. This ensures that we can quickly add them again when we want to connect, or are about to connect.

{:align="center" .figure-text}
The bindings display overlay for the Wiimote controller program I created to replace the Xbox 360 controller using this project.

{:align="center"}
![Wiimote Controller Overlay](/blog/assets/img/wiimote-controller-2.png)

So this task was accomplished, but the hard part wasn't removing and re-adding the device, the hard part was determining the *correct* way to remove re-add the device. When searching for answers, there were many different implementations for connecting the Wiimote to Bluetooth automatically, but they were inconsistent and unreliable, some just not working at all. Some did this through the Windows API, while others recommended installing different Bluetooth drivers just for the sake of your Wiimotes. The Toshiba Bluetooth stack wasn't that great to work with and I decided that it was not the best approach to solving the problem. I only managed to create a stable system after mashing together different Windows Bluetooth API commands over the course of a week or more.

The answer was to:
* Remove the device. `BluetoothRemoveDevice`
* Ask Windows for all services usable by the device. `BluetoothEnumerateInstalledServices`
* Set the device's service state to *enabled*. `BluetoothSetServiceState`
* Then for some reason, list the device's services again. `BluetoothEnumerateInstalledServices`

`BluetoothAuthenticateDevice` was often a method present in Wiimote connection examples, but it turned out this method was not only unneeded, but actually made things worse. `WSA` functions are also necessary to determine if the device is discoverable, and unfortunately as of writing this, it seems this method does *not* work for Windows 10. Although I primarily connect the Wiimote via the [DolphinBar](https://dolphin-emu.org/blog/2014/08/23/dolphinbar-review/) for best connectivity, I should look into finding out why it doesn't work and what has changed. It's likely a difference in the Windows 10 Bluetooth stack. This just goes to show how big of a headache the Bluetooth programming is in Windows.

{:align="center" .figure-text}
The only world this poor test laptop knew of.

{:align="center"}
![BSOD: Windows 10th Edition](/blog/assets/img/bsod-10.png)

One interesting thing I attempted during the lifetime of the project was to modify the existing [HID-Wiimote](https://github.com/jloehr/HID-Wiimote) drivers to help support better pairing and passthrough so that the original controls could be retained without registering it as a different controller. It was interesting to learn how difficult it is to develop drivers, but it was also pretty fun. The two main goals of using custom drivers would be potentially better audio playback, and properly handling connecting and disconnecting of the Wiimote without the extra steps.

I took an old unused laptop and managed to hook it up to my main system with a debugger. Then I proceeded to-*Your PC ran into a problem and needs to restart*, to-*Your PC ran into a problem and needs to restart*... I crashed the laptop quite a lot. Although in the end I did learn a bit about HID descriptors and how USB devices work. I never made any usable progress with the drivers.

{:align="center" .figure-text}
A report inspector used to read logs of Wiimote reports saved from Dolphin, and translate them into something *semi-human-readable*.

{:align="center"}
![Wiimote Report Inspector](/blog/assets/img/wiimote-report-inspector.png)

The most interesting part of working with the Wiimote was how communications were handled and how the Wiimote talked to the system over HID reports. The HID reports were pretty much already fully handled in the existing libraries, so I spent more time focusing on the contents of the reports sent by the Wiimote. Wiimote reports are either sent to or from the Wiimote with a report type, and a fixed buffer of data for that report type.

Not all of the Wiimote's report types were documented, so I had to do a bit of looking and experimenting. The biggest challenges were figuring out certain data types' units of measurement, and Wiimote extensions. Specifically the WiimotionPlus.

Wiimotion plus has very different behavior from the average Wiimote extension, like the Nunchuk or Classic Controller, because the WiimotionPlus extension could also have another extension attached to it. In order for the Wiimote to receive input from both the MotionPlus and other extension, something called a passthrough is used. In this mode, every other report is the WiimotionPlus data, and every *other* other report is the connected extension data.

{:align="center" .figure-text}
The audio player used to demo the Wiimote's speakers. Input sounds and music are downsampled and then can be played via real speakers or via the connected Wiimote.

{:align="center"}
![Wiimote Audio Player](/blog/assets/img/wiimote-audio-player.png)

After getting the library up and running, I wanted to start looking into Wiimote Speaker playback, which for a long time has been relatively impossible to do well. The first part was that I had to purchase the latest Wiimote type which actually had better audio support. I never got the original Wiimote to play anything identifiable. Because PCM playback never sounded right, the main task was getting the ADPCM format down. I eventually found what seems to be the right version of it, but even then, the audio sometimes fades out and in in the Wiimote, and conversion to lower sample rates in general is pretty destructive.

{:align="center" .figure-text}
A video demoing the demo for Wiimote speaker support. Showing the world that it is possible for the Wiimote to play user-input audio (under certain specific conditions).

{% include youtube.html id="vNItdVw6ONs" center="true" %}

I've been using the Wiimote controller application that resulted from this project ever since its inception. This paired with the [DolphinBar](https://dolphin-emu.org/blog/2014/08/23/dolphinbar-review/) has made the Wiimote Controller my personally most-used application to date.