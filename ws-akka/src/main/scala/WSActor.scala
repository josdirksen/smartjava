package org.smartjava

import akka.actor._
import org.smartjava.EchoActor.{StopListening, Listen}
import org.smartjava.ListenActor.ReceiveUpdate
import org.smartjava.WSServer._
import reactivemongo.bson.BSONDocument
import scala.collection._
import org.java_websocket.WebSocket
import reactivemongo.api.{DefaultCursor, Cursor}

/**
 * Companion object for the findactor. Here we define the
 * case classes used by this actor.
 */
object EchoActor {

  // Messages send specifically by this actor to another instance of this actor.
  sealed trait EchoMessage

  case class Unregister(ws : WebSocket) extends EchoMessage
  case class Listen() extends EchoMessage;
  case class StopListening() extends EchoMessage

  def props(db: DB): Props = Props(new EchoActor(db))
}

/**
 * Actor that handles the websocket request
 */
class EchoActor(db: DB) extends Actor with ActorLogging {
  import EchoActor._

  val clients = mutable.ListBuffer[WebSocket]()
  val socketActorMapping = mutable.Map[WebSocket, ActorRef]()

  override def receive = {

    // receive the open request
    case Open(ws, hs) => {
      log.debug("Received open request. Start listening for ", ws)
      clients += ws

      // create the child actor that handles the db listening
      val targetActor = context.actorOf(ListenActor.props(ws, db));

      socketActorMapping(ws) = targetActor;
      targetActor ! Listen
    }

    // recieve the close request
    case Close(ws, code, reason, ext) => {
      log.debug("Received close request. Unregisting actor for url {}", ws.getResourceDescriptor)

      // send a message to self to unregister
      self ! Unregister(ws)
      socketActorMapping(ws) ! StopListening
    }

    // recieves an error message
    case Error(ws, ex) => self ! Unregister(ws)

    // receives a text message
    case Message(ws, msg) => {
      log.debug("url {} received msg '{}'", ws.getResourceDescriptor, msg)
      ws.send("You send:" + msg);
    }

    // unregister the websocket listener
    case Unregister(ws) => {
      if (null != ws) {
        log.debug("unregister monitor")
        clients -= ws
      }
    }
  }
}

object ListenActor {
  case class ReceiveUpdate(msg: String);
  def props(ws: WebSocket, db: DB): Props = Props(new ListenActor(ws, db))
}
class ListenActor(ws: WebSocket, db: DB) extends Actor with ActorLogging {

  var predicateResult = true;

  override def receive = {
    case Listen => {

      log.info("{} , {} , {}", ws, db)

      // function to call when we receive a message from the reactive mongo
      // we pass this to the DB cursor
      val func = ( doc: BSONDocument) => {
        self ! ReceiveUpdate(BSONDocument.pretty(doc));
      }

      // the predicate that determines how long we want to retrieve stuff
      // we do this while the predicateResult is true.
      val predicate = (d: BSONDocument) => {predicateResult} :Boolean
      Some(db.listenToCollection(func, predicate))
    }

    // when we recieve an update we just send it over the websocket
    case ReceiveUpdate(msg) => {
      ws.send(msg);
    }

    case StopListening => {
      predicateResult = false;

      // and kill ourselves
      self ! PoisonPill
    }
  }
}