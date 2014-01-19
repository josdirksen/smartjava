# Simple integration test which shows tests deploying other verticles, using the Vert.x API etc

# Always require "vertx_tests" at the top of your test script
require "vertx_tests"
require "vertx"
include Vertx

# The test methods must begin with "test"

def test_http
  # Create an HTTP server which just sends back OK response immediately
  HttpServer.new.request_handler do |req|
    req.response.end;
  end.listen(8181) do |err|
    VertxAssert.assertNull(err)
    # The server is listening so send an HTTP request
    HttpClient.new.port(8181).get_now("/") do |resp|
      VertxAssert.assertTrue(200 == resp.status_code)
      # If we get here, the test is complete
      # You must always call `testComplete()` at the end. Remember that testing is *asynchronous* so
      # we cannot assume the test is complete by the time the test method has finished executing like
      # in standard synchronous tests
      VertxAssert.testComplete()
    end
  end
end

# This test deploys some arbitrary verticle - note that the call to testComplete() is inside the Verticle `SomeVerticle`
def test_deploy_arbitrary_verticle
  Vertx.deploy_verticle('org.smartjava.integration.java.SomeVerticle')
end

# This demonstrates how tests are asynchronous - the timer does not fire until 1 second later -
# which is almost certainly after the test method has completed.
def test_complete_on_timer
  Vertx.set_timer(1000) do |timer_id|
    VertxAssert.assertNotNull(timer_id)
    VertxAssert.testComplete()
  end
end

start_tests(self)




