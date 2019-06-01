![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)<br>
[![shields.io](https://img.shields.io/badge/twitall-1.0.30-brightgreen.svg?style=for-the-badge)](https://www.npmjs.com/package/twitall)<br><br>

**Twitall is the better Twitter API.**<br>
Free to use, **Open Source** & no Twitter developer account required.<br>
_Compatible with the new Twitter_
<br><br>

**What's possible?**
````javascript
twitall.login(username_or_email, password)
twitall.tweet(text)
twitall.follow(username)
twitall.query(advancedSearchURL) // You can create the advanced search url here: https://twitter.com/search-advanced
twitall.getTrends()
twitall.answer(text, tweetID) // tweetID gets returned from the query function
twitall.like(tweetID) // tweetID gets returned from the query function
twitall.retweet(tweetID) // tweetID gets returned from the query function
````
<br>

**Let's go!**<br>
_Just type `npm i twitall` & start!_
````javascript
const twitall = require('twitall');

(async () => {
    const username = 'helloworld';
    const password = 'world123';

    await twitall.login(username, password); // "Logged in"
})();
````
<br>

**More Examples**

You can find more examples [here](https://github.com/l2ig/Twitall/tree/master/examples).
