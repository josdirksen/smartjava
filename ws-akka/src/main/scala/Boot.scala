package org.smartjava

import akka.actor.{Props, ActorSystem}


/**
 * This class launches the system.
 */
object Boot extends App {
  // create the actor system
  implicit lazy val system = ActorSystem("ws-system")
  // setup the mongoreactive connection
  implicit lazy val db = new DB(Configuration.location, Configuration.dbname);

  // we'll use a simple actor which echo's everything it finds back to the client.
  // note that in this case all the requests are handled by the same actor
  // instance
  val echo = system.actorOf(EchoActor.props(db), "echo")

  // define the websocket routing and start a websocket listener
  private val wsServer = new WSServer(Configuration.port)
  wsServer.forResource("/echo", Some(echo))
  wsServer.start

  // make sure the actor system and the websocket server are shutdown when the client is
  // shutdown
  sys.addShutdownHook({system.shutdown;wsServer.stop})
}

// load configuration from external file
object Configuration {
  import com.typesafe.config.ConfigFactory

  private val config = ConfigFactory.load
  config.checkValid(ConfigFactory.defaultReference)

  val port = config.getInt("ws-server.port")
  val dbname = config.getString("mongo.db")
  val collection = config.getString("mongo.collection")
  val location = config.getString("mongo.location")
}