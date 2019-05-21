const puppeteer = require("puppeteer");
let browser, page;

module.exports = {
    async setup() {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        page.setUserAgent("Mozilla/5.0 (Windows NT 4.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2049.0 Safari/537.36");
        await page.setViewport({ width: 1920, height: 1080 });
    },
    async login(username, password, verificationMethod) {
        await this.setup();
        await page.goto("https://twitter.com/login", { waitUntil: "networkidle2" });

        await page.evaluate((username, password) => {
            document.getElementsByClassName("email-input")[1].value = username;
            document.getElementsByClassName("js-password-field")[0].value = password;

            setTimeout(() => {
                document.querySelectorAll("button.submit")[0].click();
            }, 500);
        }, username, password);

        setTimeout(async () => {
            await page.evaluate((verificationMethod) => {
                if (document.querySelectorAll("#challenge_response").length > 0) {
                    document.querySelectorAll("#challenge_response")[0].value = verificationMethod;

                    setTimeout(() => {
                        document.querySelectorAll("#email_challenge_submit")[0].click();
                    }, 500);
                }
            }, verificationMethod);

            if (page.url().includes("error")) {
                console.log("Couldn't login.");
                return;
            }

            console.log("Logged in");
        }, 5000);
    },
    async getTrends() {
        await page.goto("https://twitter.com/", { waitUntil: "networkidle2" });

        const trends = await page.evaluate(() => {
            let trends = [];

            for (let i = 0; i < document.querySelectorAll(".trend-name").length; i++) {
                if (!document.querySelectorAll(".trend-name")[i].parentElement.classList.toString().includes("promoted")) {
                    trends.push(document.querySelectorAll(".trend-name")[i].innerText);
                }
            }

            return trends;
        });

        console.log(`Got trends, 1.: ${trends[0]}`);
        return trends;
    },
    async tweet(text) {
        if (text.length < 265) {
            await page.goto("https://twitter.com/", { waitUntil: "networkidle2" });

            await page.evaluate(function(text) {
                document.querySelectorAll("#global-new-tweet-button")[0].click();

                setTimeout(() => {
                    document.querySelectorAll("div[name='tweet'] > div")[1].innerText = text;

                    setTimeout(() => {
                        document.querySelectorAll(".SendTweetsButton")[0].click();
                    }, 500);
                }, 500);
            }, text);
            console.log(`Tweeted '${text}'`);
            return Buffer.from(text).toString("base64");
        }
    },
    async deleteTweet(identifier, username) {
        identifier = Buffer.from(identifier, "base64").toString("ascii");

        await page.goto(`https://twitter.com/${username}/with_replies`, { waitUntil: "networkidle2" });

        await page.evaluate((identifier) => {
            let id = null;
            for (let i = 0; i < document.querySelectorAll(".TweetTextSize").length; i++) {
                if (document.querySelectorAll(".TweetTextSize")[i].innerText === identifier) {
                    id = i;
                }
            }

            if (id != null) {
                document.querySelectorAll(".TweetTextSize")[id].parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild.firstElementChild.click();

                setTimeout(() => {
                    document.querySelectorAll(".TweetTextSize")[id].parentElement.parentElement.firstElementChild.lastElementChild.firstElementChild.lastElementChild.children[2].children[5].click();

                    setTimeout(() => {
                        document.querySelectorAll(".modal-content .delete-action")[0].click();
                    }, 2000);
                }, 1000);
            }else {
                console.log(`Coudn't find tweet '${identifier}'`);
            }
        }, identifier);

        console.log(`Deleted tweet '${identifier}'`);
    },
    async query(advancedSearchURL) {
        await page.goto(advancedSearchURL, { waitUntil: "networkidle2" });

        return await page.evaluate(() => {
            let tweets = [];

            for (let i = 0; i < document.querySelectorAll("#timeline .stream-item-header .account-group > span.username").length; i++) {
                let username = document.querySelectorAll("#timeline .stream-item-header .account-group > span.username")[i].innerText;
                let text = document.querySelectorAll("#timeline .stream-item-header .account-group > span.username")[i].parentElement.parentElement.parentElement.getElementsByClassName("js-tweet-text-container")[0].innerText;

                tweets.push({username: username, text: text})
            }

            return tweets;
        });
    },
    async follow(username) {
        await page.goto(`https://twitter.com/${username}`, { waitUntil: "networkidle2" });

        await page.evaluate(() => {
            document.querySelector(".follow-text").click();
        });

        console.log(`Followed '${username}'`);
    },
    async getUserFollowers(username) {
        await page.goto(`https://twitter.com/${username}/followers`, { waitUntil: "networkidle2" });

        return await page.evaluate(() => {
            let usernames = [];

            for (let i = 0; i < document.querySelectorAll(".ProfileCard-screennameLink .username").length; i++) {
                usernames.push(document.querySelectorAll(".ProfileCard-screennameLink .username")[i].innerText);
            }

            return usernames;
        });
    }
};
