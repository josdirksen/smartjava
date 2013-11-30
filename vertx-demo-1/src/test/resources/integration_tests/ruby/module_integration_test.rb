# Example JavaScript integration test that deploys the module that this project builds.
# Quite often in integration tests you want to deploy the same module for all tests and you don't want tests
# to start before the module has been deployed.
# This test demonstrates how to do that.

# Always require "vertx_tests" at the top of your test script
require "vertx_tests"
require "vertx"
include Vertx

# The test methods must begin with "test"

def test_ping
  EventBus.send('ping-address', 'ping!') do |reply|
    VertxAssert.assertEquals('pong!', reply.body)
    #If we get here, the test is complete
    #You must always call `testComplete()` at the end. Remember that testing is *asynchronous* so
    #we cannot assume the test is complete by the time the test method has finished executing like
    #in standard synchronous tests
    VertxAssert.testComplete()
  end
end

def test_something_else
  VertxAssert.assertEquals('foo', 'foo')
  VertxAssert.testComplete()
end

script = self;
# The script is execute for each test, so this will deploy the module for each one
# Deploy the module - the System property `vertx.modulename` will contain the name of the module so you
# don't have to hardecode it in your tests
Vertx.deploy_module(java.lang.System.getProperty("vertx.modulename")) { |err, dep_id|
  # Deployment is asynchronous and this this handler will be called when it's complete (or failed)
  VertxAssert.assertNull(err)
  # If deployed correctly then start the tests!
  start_tests(script)
}



