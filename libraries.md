---
layout: projects
title: Libraries
permalink: /libraries/
description: A list of all notable programming libraries developed by trigger_segfault.
date_edited: 2019-05-18 11:00:00 -0400
projects:
  -
    title: "TriggersTools.FileFind"
    url: https://github.com/trigger-segfault/TriggersTools.FileFind
    image: /libraries/previews/file-find-128.png
    description: "An improvement on Window's existing .NET Framework API for finding files. Enumeration no longer fails when encountering a secure file. File numeration is a little bit faster. Added support for matching file names by Regex."
  -
    title: "TriggersTools.DirectoryCaseSensitivity"
    url: https://github.com/trigger-segfault/TriggersTools.DirectoryCaseSensitivity
    image: /libraries/previews/directory-case-sensitivity-128.png
    description: "A library for working with Windows 10, April 2018 Update's addition of per-directory case sensitivity. Although Windows now supports case-sensitive folders, most programs still do not, and will not behave properly when files with matching case-insensitive names exist. Only use DirectoryCaseSensitivity.SetCaseSensitive() when appropriate."
  -
    title: "TriggersTools.Build.BuildTime"
    url: https://github.com/trigger-segfault/TriggersTools.Build
    image: /libraries/previews/build-time-128.png
    description: "Automatically assigns an AssemblyBuildTimeAttribute to the assembly during the beginning of the build. Build time can be acquired through extension methods such as Assembly.GetBuildTime() with AssemblyBuildTimeExtensions in the namespace TriggersTools.Build. Unlike relying on the linker time, (which already no longer works in .NET Core 1.1 and later), this method guarantees that the build time will be present as long as it was compiled with MSBuild."
  -
    title: "TriggersTools.Build.CopyrightYear"
    url: https://github.com/trigger-segfault/TriggersTools.Build
    image: /libraries/previews/copyright-year-128.png
    description: "Replaces all instances of {YEAR} in copyrights with the current year. Works with the MSBuild $(Copyright) property and the AssemblyCopyrightAttribute. Assign the $(CopyrightYearAssemblyInfo) property in your project file as your input assembly info file if you're using one different from Properties\\AssemblyInfo.cs. Assembly files are local to $(ProjectDir) unless rooted."
  -
    title: "TriggersTools.SteinsGate.Divergence"
    url: https://github.com/trigger-segfault/TriggersTools.SteinsGate
    image: /libraries/previews/steinsgate-divergence-128.png
    description: "Allows you to programmatically draw Divergence Meter nixie tubes from the visual novel & anime: Steins;Gate. Divergence uses graphics taken from the Steins;Gate visual novel for drawing the tubes, digits, and decimal point. The rest of the available characters are drawn with the Oslo II font, by Antonio Rodrigues Jr. This font was chosen as it had a similar style as well as perfect aspect ratio for each character."
  -
    title: "TriggersTools.Asciify (WIP)"
    url: https://github.com/trigger-segfault/TriggersTools.Asciify
    image: /libraries/previews/asciify-128.png
    description: "An asciifier library for C# Base asciifier implementations based off of Spektre's Stack Overflow Post, but with added color capabilities. This project is nowhere near finished and the classes are pretty poorly setup at the moment, but it still works. I would not recommend using this anywhere until it's actually cleaned up."
  -
    title: "TriggersTools.ILPatching (WIP)"
    url: https://github.com/trigger-segfault/TriggersTools.ILPatching
    image: /libraries/previews/ilpatching-128.png
    description: "A library with helpful methods for scanning and patching CIL instructions with Mono.Cecil. This was designed around a custom Regular Expression implementation that works specifically for IL opcodes and operands. The result is an easy to use API for locating the code that needs to be patched and extracting the operands that need to be known via capturing."
  -
    title: "TriggersTools.CatSystem2 (WIP)"
    url: https://github.com/trigger-segfault/TriggersTools.CatSystem2
    image: /libraries/previews/catsystem2-128.png
    description: "A library for extracting resources from, decompiling scripts from, and working with the CatSystem2 visual novel game engine. The repo contains a Documentation Wiki for ongoing documentation of CatSystem2 file specifications, undocumented features, debugging, decompiling scripts, and more. This library was split and isolated from the Grisaia Extract Sprite Viewer tool so that it could have use elsewhere."
  -
    title: "TriggersTools.SharpUtils (WIP)"
    url: https://github.com/trigger-segfault/TriggersTools.SharpUtils
    image: /libraries/previews/default-128.png
    description: "A personal NuGet package library for often-used utility functions and classes. This library has only been deployed as NuGet prereleases so that people do not expect to rely on the API to stay the same forever."
  -
    title: "TriggersTools.Windows.Resources (WIP)"
    url: https://github.com/trigger-segfault/TriggersTools.Windows.Resources
    image: /libraries/previews/default-128.png
    description: "A library for working with and modifying Windows executable resources. This is based off of the existing ClrPlus.Windows.PeBinary.ResourceLib library and modified for better functionality, and faster resource saving. Menu and Dialog resources have a proper API for them that relies much less on hacking things to get them to save properly."
---
