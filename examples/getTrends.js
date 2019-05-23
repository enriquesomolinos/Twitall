const twitall = require('twitall');

(async () => {
    const username = "testusername";
    const password = "testpassword";

    await twitall.login(username, password);
    const trends = await twitall.getTrends();
    console.log(trends); // ['Joker', 'Joaquin Phoenix', '#HukuktanKorkma',...]
})();
