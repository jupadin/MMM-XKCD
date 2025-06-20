/* Magic Mirror
 * Module: MMM-XKCD
 *
 * By jupadin
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;
        if (notification === "SET_CONFIG") {
            self.config = payload;
        }
        if (self.config.dailyJSONURL) {
            self.getComic();
        }
    },

    getComic: function() {
        // console.log(`${this.name}: Calling getComic.`);
        const self = this;
        const comicJSONURL = self.config.dailyJSONURL;
        const requestOptions = {};

        const date = new Date();
        const dayOfWeek = date.getDay();

        // If we are not replacing "old" comics with random ones
        if (!self.config.randomComic) {
            fetch(comicJSONURL, requestOptions)
            .then(response => {
                // console.log(`${this.name}: Fetching todays xkcd comic...`);
                if (response.status != 200) {
                    throw `Error with status != 200": ${response.status}`
                }
                return response.json();
            })
            .then(data => {
                self.sendSocketNotification("COMIC", data);
                return;
            })
            .catch(error => {
                console.error(`${this.name}: ${error}`);
                return;
            })
        }

        else if (!self.config.alwaysRandom && (dayOfWeek == 1 || dayOfWeek == 3 || dayOfWeek == 5)) {
            fetch(comicJSONURL, requestOptions)
            .then(response => {
                // console.log(`${this.name}: Fetching random xkcd comic, since there is no new one...`);
                if (response.status != 200) {
                    throw `Error with status != 200": ${response.status}`
                }
                return response.json();
            })
            .then(data => {
                self.sendSocketNotification("COMIC", data);
                return;
            })
            .catch(error => {
                console.error(`${this.name}: ${error}`);
                return;
            })
        } else {
            // Math.random() returns a number between 0 and 1 (exclusive) and increased by 1 before rounding the number,
            // since a number below 1 may multiplied by 1, would still be below 1 and floored to 0 (which would be the current comic).
            const randomNumber = Math.floor(Math.random() * 10);
            console.log(randomNumber);
            const url = "https://xkcd.com/" + randomNumber + "/info.0.json";
            
            fetch(url, requestOptions)
            .then(response => {
                // console.log(`${this.name}: Fetching random xkcd comic...`);
                if (response.status != 200) {
                    throw `Error with status != 200": ${response.status}.`
                }
                return response.json()
            })
            .then(data => {
                self.sendSocketNotification("COMIC", data);
                return;
            })
            .catch(error => {
                console.error(`${this.name}: ${error}`)
                self.sendSocketNotification("ERROR");
                return;
            })
        }

        setTimeout(function() { self.getComic(); }, self.config.updateInterval);
    },
})