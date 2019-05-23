const twitall = require('twitall');

(async () => {
    const username = "testusername";
    const password = "testpassword";

    await twitall.login(username, password);
    await twitall.tweet("Hello World");
})();
