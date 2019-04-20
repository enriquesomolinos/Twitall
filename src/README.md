**Twitall is the better Twitter API.**<br>
Free to use, **Open Source** & no Twitter developer account required.<br>
_Searching for tweets has never been that easy!_
<br><br>

**What's possible?**
````javascript
twitall.login(username, password, verificationMethod) // The verification method is most likely the phone number of the account but it could also be the email
twitall.tweet(text)
twitall.deleteTweet(identifier, username) // The identifier gets returned from the tweet function
twitall.query(advancedSearchURL) // You can create the advanced search url here: https://twitter.com/search-advanced
twitall.getTrends()
````
<br>

**Let's go!**<br>
_Just type `npm i twitall` & start!_
````javascript
const twitall = require('twitall');

(async () => {
    const username = 'helloworld';
    const password = 'world123';
    
    /*
    The verification method depends on your account settings,
    it could be your email or your phone number.
    */
    const verificationMethod = '202-555-0114';

    await twitall.login(username, password, verificationMethod); // "Logged in"
})();
````
<br>

**More Examples**

You can find more examples [here](https://github.com/l2ig/Twitall/tree/master/examples).
