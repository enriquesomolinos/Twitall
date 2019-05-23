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

            document.querySelectorAll("button.submit")[0].click();
        }, username_or_email, password);

        await page.waitForNavigation();

        if (page.url().includes("error")) {
            console.log("Couldn't login.");
            console.log(`Error: ${page.url().split(".com/")[1]}`);
            process.exit();
        }

        if (page.url().includes("username_disabled=true")) {
            console.log("Login with username got blocked, please enter your email instead of the username.");
            process.exit();
        }

        console.log("Logged in");
    },
    async getTrends() {
        await page.goto("https://twitter.com/explore", { waitUntil: "networkidle2" });

        await page.screenshot({ path: "evidence.png" });

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
            await page.evaluate(() => {
                document.querySelectorAll(`[role="button"][tabindex="0"] > div > span > span`)[0].click();
            });

            console.log(`Tweeted "${text}"`);
        }
    },
    async query(advancedSearchURL) {
        await page.goto(advancedSearchURL, { waitUntil: "networkidle2" });

        return await page.evaluate(() => {
            let tweets = [];

            for (let i = 0; i < document.querySelectorAll("article").length; i++) {
                let username = document.querySelectorAll("article")[i].querySelector("div").children[1].querySelector("div").innerText.split("@")[1].split("\n")[0];
                let text = document.querySelectorAll("article")[i].querySelector("div").children[1].querySelector("div").lastElementChild.innerText;

                tweets.push({username: username, text: text})
            }

            return tweets;
        });
    },
    async follow(username) {
        await page.goto(`https://twitter.com/${username}`, { waitUntil: "networkidle2" });

        await page.click(`[style="min-width: 79px;"] > [role="button"]`);

        console.log(`Followed '${username}'`);
    }
};
