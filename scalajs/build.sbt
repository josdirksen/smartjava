enablePlugins(ScalaJSPlugin)

name := "scalajs"

version := "1.0"

scalaVersion := "2.11.5"

libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "0.8.0"
libraryDependencies += "com.greencatsoft" %%% "scalajs-angular" % "0.4-SNAPSHOT"

resolvers +=
  "Sonatype OSS Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"

jsDependencies += "org.webjars" % "angularjs" % "1.3.14" / "angular-route.js" dependsOn "angular.js"
jsDependencies += "org.webjars" % "angularjs" % "1.3.14" / "angular.js"
jsDependencies += "org.webjars" % "angular-foundation" % "0.3.0" / "mm-foundation.js"
jsDependencies += "org.webjars" % "angular-foundation" % "0.3.0" / "mm-foundation-tpls.js"

persistLauncher in Compile := true
persistLauncher in Test := false

skip in packageJSDependencies := false