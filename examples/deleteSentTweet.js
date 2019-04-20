const twitall = require('twitall');

(async () => {
    const username = "imausername";
    const password = "imapassword";

    await twitall.login(username, password, "1900 614 321");
    setTimeout(async () => {
        const id = await twitall.tweet("Hello World");

        setTimeout(async () => {
            await twitall.deleteTweet(id, username);
        }, 300000); // gets deleted after 5 minutes
    }, 10000);
})();
