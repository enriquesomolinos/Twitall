const twitall = require('twitall');

(async () => {
    const username = "imausername";
    const password = "imapassword";

    await twitall.login(username, password, "1900 614 321");
    setTimeout(async () => {
        const tweets = await twitall.query("https://twitter.com/search?l=&q=%22hello%20world%22&src=typd");

        console.log(tweets); // [{ username: '@cra1zer', text: 'hello world!' }, { username: '@Carissa_lovee', text: 'Hello world ' },...]
    }, 10000);
})();
