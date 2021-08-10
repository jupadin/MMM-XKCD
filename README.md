# MMM-XKCD

<p style="text-align: center">
    <a href="https://david-dm.org/jupadin/MMM-RNV"><img src="https://david-dm.org/jupadin/MMM-RNV.svg" alt ="Dependency Status"></a>
    <a href="https://choosealicense.com/licenses/mit"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

This module is an extention for the [MagicMirror](https://github.com/MichMich/MagicMirror).

The module is based on the work of [Blastitt](https://github.com/Blastitt/DailyXKCD) with simplified configuration options and cleaner user interface.

## Installation

Open a terminal session, navigate to your MagicMirror's `modules` folder and execute `git clone https://github.com/jupadin/MMM-XKCD.git`, such that a new folder called MMM-XKCD will be created.

Activate the module by adding it to the `config.js` file of the MagicMirror as shown below.

The table below lists all possible configuration options.

## Using the module
````javascript
    modules: [
        {
            module: 'MMM-XKCD',
            position: 'top_right',
            config: {
                header: "xkcd",
                updateInterval: 10 * 60 * 60 * 1000,
                grayScale: false,
                invertColors: false,
                limitComicWidth: 400,
                limitComicHeight: 0,
                randomComic: false,
                alwaysRandom: false,
                showTitle: true,
            }
        }
    ]
````

## Configuration options

The following configuration options can be set and/or changed:

| Option | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| `header` | `string` | `xkcd` | Header, which will be displayed |
| `updateInterval` | `int` | `36000000` | Update interval of comic [milliseconds] (10 hours) |
| `grayScale` | `bool` | `false` | Desaturate colors of the comic to grayscale |
| `invertedColors` | `bool` | `false` | Invert colors of the comic to create a darker feeling |
| `limitComicWidth` | `int` | `400` | Limit the maximum width of the comic (0 implies to use the maximal width of the comic) |
| `limitComicHeight` | `int` | `0` | Limit the maximum height of the comic (0 implies to use the maximal height of the comic) |
| `randomComic` | `bool` | `false` | Display a random comic, where no new comic is available. |
| `alwaysRandom` | `bool` | `false` | If you always want to see a random comic, even on days where a new comic is available. **Note: Only effective if `randomComic` is set to `true`**. |
| `showTitle` | `bool` | `true` | Display the title of the comic with given header |
