# How to setup a convenient logging system for your Node App ?
Ressources for the associated Medium article : https://medium.com/p/fa9039b8dfa6

In this article I show how I wrote my own dead simple logging module.

You can `require` the `log.js` module and use the custom `logger` instance, or access the original `winstonLogger` instance.

```
const {logger, winstonLogger} = require('./utils/log');

logger.info("I‘m a message"); //output: info: I‘m a message
winstonLogger.log('info', "I‘m a message");  //output: info: I‘m a message
```

This module also creates a global instance `_logger` that can be used anywhere. You just have to `require` the module only once in the entry point of your project (typically in the server’s `server.js` or `index.js` file for a website) ad call it like :

```
_logger.verbose("I‘m a message"); //output: verbose: I‘m a message
```