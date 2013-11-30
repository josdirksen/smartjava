# Example JavaScript integration test that deploys the module that this project builds.
# Quite often in integration tests you want to deploy the same module for all tests and you don't want tests
# to start before the module has been deployed.
# This test demonstrates how to do that.

# Import the VertxAssert class - this has the exact same API as JUnit
from org.vertx.testtools import VertxAssert
import java.lang.System
import vertx_tests
from core.event_bus import EventBus

import vertx

# The test methods must begin with "test"

def test_ping() :
    def handler(msg):
        VertxAssert.assertEquals('pong!', msg.body)
        VertxAssert.testComplete()
    EventBus.send('ping-address', 'ping!', handler)

def test_something_else() :
    VertxAssert.testComplete()

script = locals()

# The script is execute for each test, so this will deploy the module for each one
def handler(err, depID):
    # Deployment is asynchronous and this this handler will be called when it's complete (or failed)
    VertxAssert.assertNull(err)
    # If deployed correctly then start the tests!
    vertx_tests.start_tests(script)

# Deploy the module - the System property `vertx.modulename` will contain the name of the module so you
# don't have to hardecode it in your tests
vertx.deploy_module(java.lang.System.getProperty("vertx.modulename"), None, 1, handler)

