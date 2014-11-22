package org.smartjava

import akka.actor.{ActorSystem, ActorRef}
import java.net.InetSocketAddress
import org.java_websocket.WebSocket
import org.java_websocket.framing.CloseFrame
import org.java_websocket.handshake.ClientHandshake
import org.java_websocket.server.WebSocketServer
import scala.collection.mutable.Map
import akka.event.Logging

/**
 * The WSserver companion objects defines a number of distinct messages sendable by this component
 */
object WSServer {
  sealed trait WSMessage
  case class Message(ws : WebSocket, msg : String) extends WSMessage
  case class Open(ws : WebSocket, hs : ClientHandshake) extends WSMessage
  case class Close(ws : WebSocket, code : Int, reason : String, external : Boolean) extends WSMessage
  case class Error(ws : WebSocket, ex : Exception) extends WSMessage
}

/**
 * Create a websocket server that listens on a specific address.
 *
 * @param port
 */
class WSServer(val port : Int)(implicit system : ActorSystem, db: DB ) extends WebSocketServer(new InetSocketAddress(port)) {

  // maps the path to a specific actor.
  private val reactors = Map[String, ActorRef]()
  // setup some logging based on the implicit passed in actorsystem
  private val log = Logging.getLogger(system, this);

  // Call this function to bind an actor to a specific path. All incoming
  // connections to a specific path will be routed to that specific actor.
  final def forResource(descriptor : String, reactor : Option[ActorRef]) {
    log.debug("Registring actor:" + reactor + " to " + descriptor);
    reactor match {
      case Some(actor) => reactors += ((descriptor, actor))
      case None => reactors -= descriptor
    }
  }

  // onMessage is called when a websocket message is recieved.
  // in this method we check whether we can find a listening
  // actor and forward the call to that.
  final override def onMessage(ws : WebSocket, msg : String) {

    if (null != ws) {
      reactors.get(ws.getResourceDescriptor) match {
        case Some(actor) => actor ! WSServer.Message(ws, msg)
        case None => ws.close(CloseFrame.REFUSE)
      }
    }
  }

  final override def onOpen(ws : WebSocket, hs : ClientHandshake) {
    log.debug("OnOpen called {} :: {}", ws, hs);
    if (null != ws) {
      reactors.get(ws.getResourceDescriptor) match {
        case Some(actor) => actor ! WSServer.Open(ws, hs)
        case None => ws.close(CloseFrame.REFUSE)
      }
    }
  }

  final override def onClose(ws : WebSocket, code : Int, reason : String, external : Boolean) {
    log.debug("Close called {} :: {} :: {} :: {}", ws, code, reason, external);
    if (null != ws) {
      reactors.get(ws.getResourceDescriptor) match {
        case Some(actor) => actor ! WSServer.Close(ws, code, reason, external)
        case None => ws.close(CloseFrame.REFUSE)
      }
    }
  }
  final override def onError(ws : WebSocket, ex : Exception) {
    log.debug("onError called {} :: {}", ws, ex);
    if (null != ws) {
      reactors.get(ws.getResourceDescriptor) match {
        case Some(actor) => actor ! WSServer.Error(ws, ex)
        case None => ws.close(CloseFrame.REFUSE)
      }
    }
  }
}
