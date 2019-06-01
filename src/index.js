const puppeteer = require("puppeteer");
let browser, page;

module.exports = {
    async setup() {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36");
        await page.setViewport({ width: 1920, height: 1080 });
    },
    async login(username_or_email, password) {
        await this.setup();
        await page.goto("https://twitter.com/login", { waitUntil: "networkidle2" });
        await page.evaluate(() => {
            document.cookie = "rweb_optin=top_no_out; path=/"
        });

        await page.evaluate((username, password) => {
            document.getElementsByClassName("email-input")[1].value = username;
            document.getElementsByClassName("js-password-field")[0].value = password;
        }, username_or_email, password);

        await page.click("button.submit");
        await page.waitForNavigation();

        if (page.url().includes("error")) {
            console.log("Couldn't login");
            console.log(`Error: ${page.url().split(".com/")[1]}`);
            process.exit();
        }

        if (page.url().includes("username_disabled=true")) {
            console.log("Login with username got blocked, please enter your email instead of the username");
            process.exit();
        }

        console.log("Logged in");
    },
    async getTrends() {
        await page.goto("https://twitter.com/explore", { waitUntil: "networkidle2" });

        const trends = await page.evaluate(() => {
            let trends = [];

            for (let i = 2; i < 7; i++) {
                trends.push(document.querySelectorAll(`[style="padding-bottom: 0px;"] > div > div`)[i].querySelectorAll(`[dir="auto"]`)[4].innerText);
            }

            return trends;
        });

        console.log(`Got trends, 1.: ${trends[0]}`);
        return trends;
    },
    async tweet(text) {
        if (text.length < 265) {
            await page.goto("https://twitter.com/compose/tweet", { waitUntil: "networkidle2" });

            await page.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", text, { delay: 20 });
            await page.click(`[role="button"][tabindex="0"] > div > span > span`);

            console.log(`Tweeted "${text}"`);
        }
    },
    async query(advancedSearchURL) {
        await page.goto(advancedSearchURL, { waitUntil: "networkidle2" });

        await page.evaluate(() => { window.scrollTo(0, 9000); });

        await new Promise(resolve => setTimeout(resolve, 5000));

        return await page.evaluate(() => {
            let tweets = [];

            for (let i = 0; i < document.querySelectorAll("article").length; i++) {
                const username = document.querySelectorAll("article")[i].querySelector("div").children[1].querySelector("div").innerText.split("@")[1].split("\n")[0];
                const text = document.querySelectorAll("article")[i].querySelector(`[lang]`).innerText;
                const tweetID = btoa(document.querySelectorAll("article")[0].querySelector("[href*='/status/']").getAttribute("href"));

                tweets.push({
                    tweetID: tweetID,
                    username: username,
                    text: text
                });
            }

            return tweets;
        });
    },
    async follow(username) {
        await page.goto(`https://twitter.com/${username}`, { waitUntil: "networkidle2" });

        await page.click(`[style="min-width: 79px;"] > [role="button"]`);

        console.log(`Followed '${username}'`);
    },
    async answer(text, tweetID) {
        tweetID = Buffer.from(tweetID, "base64").toString();

        await page.goto("https://twitter.com" + tweetID, { waitUntil: "networkidle2" });
        if ((await page.evaluate(() => { return document.querySelector("article"); })) === null) {
            console.log("Tweet doesn't exist");
            return;
        }

        await page.click(`article [role="group"] [role="button"]`);

        await new Promise(async resolve => {
            setTimeout(async () => {
                await page.type(".public-DraftStyleDefault-block.public-DraftStyleDefault-ltr", text, { delay: 20 });
                await page.click(`[role="button"][tabindex="0"] > div > span > span`);
                resolve();
            }, 5000);
        });

        console.log(`Sent answer "${text}"`);
    },
    async like(tweetID) {
        tweetID = Buffer.from(tweetID, "base64").toString();

        await page.goto("https://twitter.com" + tweetID, { waitUntil: "networkidle2" });
        if ((await page.evaluate(() => { return document.querySelector("article"); })) === null) {
            console.log("Tweet doesn't exist");
            return;
        }

        await page.evaluate(() => {
            document.querySelector(`article [role="group"] [role="button"] [d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"]`).parentElement.parentElement.parentElement.parentElement.parentElement.click();
        });
        console.log(`Liked tweet`);
    },
    async retweet(tweetID) {
        tweetID = Buffer.from(tweetID, "base64").toString();

        await page.goto("https://twitter.com" + tweetID, { waitUntil: "networkidle2" });
        if ((await page.evaluate(() => { return document.querySelector("article"); })) === null) {
            console.log("Tweet doesn't exist");
            return;
        }

        await page.evaluate(() => {
            document.querySelector(`article [role="group"] [role="button"] [d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"]`).parentElement.parentElement.parentElement.parentElement.parentElement.click();
        });

        await new Promise(async resolve => {
            setTimeout(async () => {
                await page.click(`[role="menuitem"]`);
                resolve();
            }, 2500);
        });

        console.log(`Retweeted tweet`);
    }
};
