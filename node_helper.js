/* Magic Mirror
 * Module: MMM-XKCD
 *
 * By jupadin
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const request = require('request');

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
        const self = this;
        const comicJSONURL = self.config.dailyJSONURL;

        request(comicJSONURL, function(error, response, body) {
            if (error || (response.statusCode != 200)) {
                return;
            }
            
            // If we are not replacing "old" comics with random ones
            if (!self.config.randomComic) {
                self.sendSocketNotification("COMIC", JSON.parse(body));
                return;
            }

            const date = new Date();
            const dayOfWeek = date.getDay();

            // Otherwise select a random comic based on the day of week (Since there are only new comics on specific days)
            // New comics appear on Monday, Wednesday and Friday.
            if (!self.config.alwaysRandom && (dayOfWeek == 1 || dayOfWeek == 3 || dayOfWeek == 5)) {
                self.sendSocketNotification("COMIC", JSON.parse(body));
                return;
            } else {
                const comic = JSON.parse(body);
                // Math.random() returns a number between 0 and 1 (exclusive),
                // multiplied by the current comic number to get a "real" random number,
                // increased by 1 before rounding the number
                // - Since a number below 1 may multiplied by 1, would still be below 1 and floored to 0 (which would be the current comic).
                const randomNumber = Math.floor((Math.random() * comic.num) + 1);
                const randomURL = "https://xkcd.com/" + randomNumber + "/info.0.json";
                request(randomURL, function (error, response, body) {
                    if (error || (response.statusCode != 200)) {
                        return;
                    }
                    self.sendSocketNotification("COMIC", JSON.parse(body));
                    return;
                });
            }
        });
        setTimeout(self.getComic, self.config.updateInterval);
    },
})