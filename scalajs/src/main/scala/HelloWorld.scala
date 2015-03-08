package helloworld

import com.greencatsoft.angularjs.core._
import org.scalajs.dom.Element
import org.scalajs.dom.raw.HTMLElement

import scala.concurrent.{ExecutionContext, Future}
import scala.scalajs.js
import scala.scalajs.js.JSApp
import com.greencatsoft.angularjs._

import ExecutionContext.Implicits.global
import scala.scalajs.js.annotation.JSExportAll

import scala.util.{Failure, Success}

/**
 * Main app launcher. Initializes the angular module and
 * used controller, filters and services
 */
object HelloWorld extends JSApp {

  def main(): Unit = {
    val module = Angular.module("helloworld",Seq("ngRoute","mm.foundation"))
    module.controller(HomeController)
    module.config(RoutingConfig)
    module.filter(ToUpperFilter)
    module.filter(IntDoublerFilter)
    module.directive(SimpleDirective)
  }
}

/**
 * Define the route mapping between url and controller
 */
object RoutingConfig extends Config {

  @inject
  var routeProvider: RouteProvider = _

  override def initialize() {
    routeProvider
      .when("/home", Route(HomeController))
  }
}

/**
 * Controller for a specific page
 */
object HomeController extends PageController {

  import js.JSConverters._

  val templateUrl = "templates/home.html"
  override type ScopeType = ControllerData

  @inject
  var service: Interval = _

  override def initialize(scope: ScopeType): Unit = {
    scope.title = "This is the title"
    scope.subTitle = "Make Me Big"

    scope.anotherScope = 1 to 12 toJSArray

    service.apply( () => scope.count = System.currentTimeMillis() % 10000, 100)
  }

  /**
   * The specific scope data used in this controller
   */
  trait ControllerData extends Scope {
    var title: String = js.native
    var subTitle: String = js.native
    var count: Double = js.native

    var anotherScope: js.Array[Int] = js.native
  }
}

/**
 * Simple filter: text to uppercase
 */
object ToUpperFilter extends Filter {
  override val name = "upper"
  override def filter(text: String): String = text.toUpperCase
}

/**
 * Simple filter: double a value
 */
object IntDoublerFilter extends Filter {
  override val name = "double"
  override def filter(text: String): String = text.toInt*2 toString
}

/**
 * Directive which just sets some text
 */
object SimpleDirective extends AttributeDirective {

  override val name = "simpleDirective"

  @JSExportAll
  case class Address(ip : String)

  override def link(scope: ScopeType, elems: Seq[Element], attrs: Attributes, controller: Controller*) = {
    val elem = elems.head.asInstanceOf[HTMLElement]
    elem.textContent = "Some content set from the directive"
  }
}