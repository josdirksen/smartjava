# Simple integration test which shows tests deploying other verticles, using the Vert.x API etc
from org.vertx.testtools import VertxAssert
import vertx_tests
from core.event_bus import EventBus
import vertx

# The test methods must begin with "test"

def test_http():
    # Create an HTTP server which just sends back OK response immediately

    def req_handler(req):
        req.response.end()

    def resp_handler(resp):
        VertxAssert.assertTrue(200 == resp.status_code)
        # If we get here, the test is complete
        # You must always call `testComplete()` at the end. Remember that testing is *asynchronous* so
        # we cannot assume the test is complete by the time the test method has finished executing like
        # in standard synchronous tests
        VertxAssert.testComplete()

    def listen_handler(err, server):
        VertxAssert.assertNull(err)
        # The server is listening so send an HTTP request
        vertx.create_http_client().set_port(8181).get_now("/", resp_handler)

    vertx.create_http_server().request_handler(req_handler).listen(8181, "0.0.0.0", listen_handler)

# This test deploys some arbitrary verticle - note that the call to testComplete() is inside the Verticle `SomeVerticle`
def test_deploy_arbitrary_verticle():
    vertx.deploy_verticle('org.smartjava.integration.java.SomeVerticle')

# This demonstrates how tests are asynchronous - the timer does not fire until 1 second later -
# which is almost certainly after the test method has completed.
def test_complete_on_timer():
    def handler(timer_id):
        VertxAssert.assertNotNull(timer_id)
        VertxAssert.testComplete()
    vertx.set_timer(1000, handler)

vertx_tests.start_tests(locals())
