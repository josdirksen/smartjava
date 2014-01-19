var vertx = require('vertx')
var console = require('vertx/console')

vertx.eventBus.registerHandler('ping-address', function(message, replier) {
  replier('pong!');
  console.log('Sent back pong JavaScript!')
});