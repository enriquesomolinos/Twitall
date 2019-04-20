const twitall = require('twitall');

(async () => {
    const username = "imausername";
    const password = "imapassword";

    await twitall.login(username, password, "1900 614 321");
    setTimeout(async () => {
        const trends = await twitall.getTrends();
        console.log(trends); // ['Joker', 'Joaquin Phoenix', '#HukuktanKorkma',...]
    }, 10000);
})();
