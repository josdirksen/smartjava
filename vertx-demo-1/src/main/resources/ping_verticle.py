import vertx
from core.event_bus import EventBus

def handler(msg):
    msg.reply('pong!')
    print 'sent back pong Python!'

EventBus.register_handler('ping-address', handler=handler)