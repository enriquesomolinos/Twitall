const twitall = require('twitall');

(async () => {
    const username = "imausername";
    const password = "imapassword";

    await twitall.login(username, password, "1900 614 321");
    setTimeout(async () => {
        await twitall.tweet("Hello World");
    }, 10000);
})();
