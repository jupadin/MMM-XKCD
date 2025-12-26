/* Magic Mirror
 * Module: MMM-XKCD
 *
 * By jupadin
 * MIT Licensed.
 */

Module.register("MMM-XKCD", {
    // Default module config.
    defaults: {
        header: "MMM-xkcd",
        dailyJSONURL: "https://xkcd.com/info.0.json",
        updateInterval: 10 * 60 * 60 * 1000, // 10 hours
        grayScale: false,
        invertColors: false,
        limitComicWidth: 400,
        limitComicHeight: 0,
        randomComic: false,
        alwaysRandom: false,
        showTitle: true,
    },

    // Define start sequence.
    start: function() {
        // Log.info("Starting module: " + this.name);
        
        this.dailyComic = "";
        this.dailyComicTitle = "";

        this.numComic = null;
        this.comicYear = null;
        this.comicMonth = null;

        this.animationSpeed = 2000;
        // this.scrollProgress = 0;
        this.loaded = false;
        this.sendSocketNotification("SET_CONFIG", this.config);
    },

    // Define required styles.
    getStyles: function() {
        return ["MMM-XKCD.css"];
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    // Define header.
    getHeader: function() {
        if (this.config.showTitle && !this.dailyComicTitle == "") {
            const title = document.createElement('div');
            title.className = 'title';
            title.innerText = this.config.header;

            const text = document.createElement('div')
            text.className = 'text';
            text.innerText = this.dailyComicTitle;

            const number = document.createElement('div');
            number.className = 'number';
            number.innerText = "(" + this.numComic + ")" + " | " + this.comicMonth.padStart(2, '0') + "." + this.comicYear + ")";

            return `${title.innerHTML} - ${text.innerHTML} ${number.innerHTML}`;
            // return `${title.outerHTML} ${text.outerHTML} ${number.outerHTML}`;
        } else {
            return this.config.header;
        }
    },

    // Override dom geneartor.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.id = "wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading...";
            wrapper.className = "light small dimmed";
            return wrapper;
        }
        
        var comic = document.createElement("img");
        comic.id = "comic"
        comic.src = this.dailyComic;

        if (this.config.grayScale || this.config.invertColors) {
            comic.setAttribute("style", "-webkit-filter: " +
                (this.config.grayScale ? "grayscale(100%) " : "") +
                (this.config.invertColors ? "invert(100%) " : "") +
                ";");
        }

        comic.config = this.config;

        // Limit width or height of comic on load
        comic.onload = function() {
            const width = this.width;
            if (this.config.limitComicHeight > 0) {
                comic.style.height = this.config.limitComicHeight + "px";
                comic.style.width = "auto";
            } else if (this.config.limitComicWidth > 0 && width > this.config.limitComicWidth) {
                comic.style.width = this.config.limitComicWidth + "px";
                comic.style.height = "auto";
            }
        };

        wrapper.appendChild(comic);

        return wrapper;
    },

    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {
        // console.log(payload);
        if (notification === "COMIC") {
            this.loaded = true;
            this.dailyComic = payload.img;
            // this.dailyComicTitle = payload.safe_title;
            console.log(payload.title.length);
            this.dailyComicTitle = payload.title.substring(0, 15);
            this.numComic = payload.num;
            this.comicYear = payload.year;
            this.comicMonth = payload.month;
            this.updateDom(this.animationSpeed);
        }
    }
});