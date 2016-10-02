# Buildkite Build Status Monitor

A node.js-based web monitor for Buildkite projects.

![A screenshot of the monitor](http://i.imgur.com/TF21hK8.png "A screenshot of the monitor")

So that's pretty much the idea. The monitor stretches to the entirety of the screen and fits as many builds as you have. Don't add _too many_ though, or it'll look crammed.

## Installing

The thing works using node.js, so make sure you have that sucker installed. Then, just clone the repo (or download the files), perform the obligatory `npm install` and configure as desired, by duplicating `app/config.sample.json` to `config.json` and filling it out with suitable values.

You will need a Build Kite API Access Token with the `read_builds` permission.

## Running

The monitor works with a whitelist approach, whereby you configure the `whitelist` value in `config.json` with the project names that you want to track, i.e.,

```json
"whitelist": ["A Project", "Another project", "Yet Another Project"]
```
You can start the server by running `grunt sass` then `grunt express` and access it on your localhost on port 5005 `http://localhost:5005`.

## Other config values

You can change the colours by editing `public/sass/config.sass` and the number of builds per row on `public/scripts/buildkite.js` (yeah this kind of sucks. I'm working on it).

## Wanna help out?

About bloody time! Just fork the project and submit a pull request with your changes.

## Legalese

### MIT License

Copyright (c) 2014 Hooroo, Daniel Angel Bradford, Myles Eftos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

