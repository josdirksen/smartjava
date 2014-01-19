/*
 * Example JavaScript integration test that deploys the module that this project builds.
 *
 * Quite often in integration tests you want to deploy the same module for all tests and you don't want tests
 * to start before the module has been deployed.
 *
 * This test demonstrates how to do that.
 */

var container = require("vertx/container");
var vertx = require("vertx");
var vertxTests = require("vertx_tests");
var vassert = require("vertx_assert");

// The test methods must begin with "test"

function testPing() {
  vertx.eventBus.send("ping-address", "ping!", function(reply) {
    vassert.assertEquals("pong!", reply);
    /*
     If we get here, the test is complete
     You must always call `testComplete()` at the end. Remember that testing is *asynchronous* so
     we cannot assume the test is complete by the time the test method has finished executing like
     in standard synchronous tests
     */
    vassert.testComplete();
  });
}

function testSomethingElse() {
  vassert.assertEquals("foo", "foo")
  vassert.testComplete()
}

var script = this;
// The script is execute for each test, so this will deploy the module for each one
// Deploy the module - the System property `vertx.modulename` will contain the name of the module so you
// don't have to hardecode it in your tests
container.deployModule(java.lang.System.getProperty("vertx.modulename"), function(err, depID) {
  // Deployment is asynchronous and this this handler will be called when it's complete (or failed)
  vassert.assertNull(err);
  // If deployed correctly then start the tests!
  vertxTests.startTests(script);
});


