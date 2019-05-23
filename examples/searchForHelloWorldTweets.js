const twitall = require('twitall');

(async () => {
    const username = "testusername";
    const password = "testpassword";

    await twitall.login(username, password);
    const tweets = await twitall.query("https://twitter.com/search?l=&q=%22hello%20world%22&src=typd");
    console.log(tweets); // [{ username: '@cra1zer', text: 'hello world!' }, { username: '@Carissa_lovee', text: 'Hello world ' },...]
})();
