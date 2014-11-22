import play.api.libs.iteratee.Step.Done
import play.api.libs.iteratee._
import reactivemongo.api.Collection
import reactivemongo.api.collections.default.BSONCollection

/**
 * Created by josdi on 14/11/14.
 */
object MongoTest {

  def main(args: Array[String]) {
    connect();
  }

  def connect() {
    import reactivemongo.api._
    import scala.concurrent.ExecutionContext.Implicits.global

    // gets an instance of the driver
    // (creates an actor system)
    val driver = new MongoDriver
    val connection = driver.connection(List("localhost"))

    // Gets a reference to the database "plugin"
    val db = connection("scala")

    // Gets a reference to the collection "acoll"
    // By default, you get a BSONCollection.
    val collection = db("rmongo")

    listDocs(collection);
  }

  def listDocs(collection: BSONCollection) = {
    import reactivemongo.api._
    import reactivemongo.bson._
    import scala.concurrent.Future

    import scala.concurrent.ExecutionContext.Implicits.global

    // Select only the documents which field 'firstName' equals 'Jack'
//    val query = BSONDocument("firstName" -> "Jack")
    // select only the fields 'lastName' and '_id'
//    val filter = BSONDocument(
//      "lastName" -> 1,
//      "_id" -> 1)

    val query = BSONDocument(
      "currentDate" -> BSONDocument(
        "$gte" -> BSONDateTime(System.currentTimeMillis())
      ));

    // we enumerate over a capped collection
    val cursor = collection.find(query)
      .options(QueryOpts().tailable.awaitData)
      .cursor[BSONDocument]

    val enum = cursor.enumerate();

    val iter = Iteratee.foreach { doc:BSONDocument =>
      println("found document: " + BSONDocument.pretty(doc))
    };

//    val iter2 = Iteratee.foreach { doc:BSONDocument =>
//      println("found another document: " + BSONDocument.pretty(doc))
//    };
//    val it = enum.apply(iter)
//    val eof = Enumerator.eof[BSONDocument];
//    val enum2 = Enumerator[BSONDocument](BSONDocument(),BSONDocument(),BSONDocument());

//    val enum3 = enum.interleave(enum2)
//    val promise = enum.apply(iter);
//    enum.apply(iter2);
//    enum.apply(Iteratee.ignore[BSONDocument]);

    // met enumeratee doen while predicate
    val iter4 = Enumeratee.take(5).transform(iter);


  }
}

