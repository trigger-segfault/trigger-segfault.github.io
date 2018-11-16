---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: projects
title: Libraries
permalink: /libraries/
projects:
  -
    title: "TriggersTools.FileFind"
    url: https://github.com/trigger-death/TriggersTools.FileFind
    image: /libraries/previews/file-find-128.png
    description: "An improvement on Window's existing .NET Framework API for finding files. Enumeration no longer fails when encountering a secure file. File numeration is a little bit faster. Added support for matching file names by Regex."
  -
    title: "TriggersTools.DirectoryCaseSensitivity"
    url: https://github.com/trigger-death/TriggersTools.DirectoryCaseSensitivity
    image: /libraries/previews/directory-case-sensitivity-128.png
    description: "A library for working with Windows 10, April 2018 Update's addition of per-directory case sensitivity. Although Windows now supports case-sensitive folders, most programs still do not, and will not behave properly when files with matching case-insensitive names exist. Only use DirectoryCaseSensitivity.SetCaseSensitive() when appropriate."
  -
    title: "TriggersTools.Build.BuildTime"
    url: https://github.com/trigger-death/TriggersTools.Build
    image: /libraries/previews/build-time-128.png
    description: "Automatically assigns an AssemblyBuildTimeAttribute to the assembly during the beginning of the build. Build time can be aquired through extension methods such as Assembly.GetBuildTime() with AssemblyBuildTimeExtensions in the namespace TriggersTools.Build. Unlike relying on the linker time, (which already no longer works in .NET Core 1.1 and later), this method guarantees that the build time will be present as long as it was compiled with MSBuild."
  -
    title: "TriggersTools.Build.CopyrightYear"
    url: https://github.com/trigger-death/TriggersTools.Build
    image: /libraries/previews/copyright-year-128.png
    description: "Replaces all instances of {YEAR} in copyrights with the current year. Works with the MSBuild $(Copyright) property and the AssemblyCopyrightAttribute. Assign the $(CopyrightYearAssemblyInfo) property in your project file as your input assembly info file if you're using one different from Properties\\AssemblyInfo.cs. Assembly files are local to $(ProjectDir) unless rooted."
  -
    title: "TriggersTools.SteinsGate.Divergence"
    url: https://github.com/trigger-death/TriggersTools.SteinsGate
    image: /libraries/previews/steinsgate-divergence-128.png
    description: "Allows you to programatically draw Divergence Meter nixie tubes from the visual novel & anime: Steins;Gate. Divergence uses graphics taken from the Steins;Gate visual novel for drawing the tubes, digits, and decimal point. The rest of the available characters are drawn with the Oslo II font, by Antonio Rodrigues Jr. This font was chosen as it had a similar style as well as perfect aspect ratio for each character."
  -
    title: "TriggersTools.Asciify (WIP)"
    url: https://github.com/trigger-death/TriggersTools.Asciify
    image: /libraries/previews/asciify-128.png
    description: "An asciifier library for C# Base asciifier implementations based off of Spektre's Stack Overflow Post, but with added color capabilities. This project is nowhere near finished and the classes are pretty poorly setup at the moment, but it still works. I would not recommend using this anywhere until it's actually cleaned up."
---
