/* Magic Mirror
 * Module: MMM-XKCD
 *
 * By jupadin
 * MIT Licensed.
 */

Module.register("MMM-XKCD", {
    // Default module config.
    defaults: {
        header: "xkcd",
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
        Log.info("Starting module: " + this.name);
        this.dailyComic = "";
        this.dailyComicTitle = "";
        this.animationSpeed = 2000;
        this.scrollProgress = 0;
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
            return this.config.header + " - " + this.dailyComicTitle;
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

        var comicWrapper = document.createElement("div");
        comicWrapper.id = "comicWrapper";
        
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

            // This updated section allows you to set a maximum for both the width and height and
            // scales the final size so the comic is no larger than either. Making either 0 will
            // still scale the entire comic to the max size of the other parameter.
            const height = this.height;
            let comicRatio = width / height;

            if (this.config.limitComicWidth != 0 &&
                this.config.limitComicHeight != 0) {
                if (width / this.config.limitComicWidth > height / this.config.limitComicHeight) {
                    comic.style.width = this.config.limitComicWidth + "px";
                    comic.style.height = this.config.limitComicWidth / comicRatio + "px";
                } else {
                    comic.style.height = this.config.limitComicHeight + "px";
                    comic.style.width = this.config.limitComicHeight * comicRatio + "px";
                }
            } else if (this.config.limitComicHeight > 0) {
                comic.style.height = this.config.limitComicHeight + "px";
                comic.style.width = "auto";
            } else {
                comic.style.width = this.config.limitComicWidth + "px";
                comic.style.height = "auto";
            }
        };

        comicWrapper.appendChild(comic);
        wrapper.appendChild(comicWrapper);

        return wrapper;
    },

    // Override socket notification handler.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "COMIC") {
            this.loaded = true;
            this.dailyComic = payload.img;
            // this.dailyComicTitle = payload.safe_title;
            this.dailyComicTitle = payload.title;
            this.updateDom(this.animationSpeed);
        }
    }
});
