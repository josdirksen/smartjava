package org.smartjava.integration.groovy;
/*
 * Copyright 2013 Red Hat, Inc.
 *
 * Red Hat licenses this file to you under the Apache License, version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License.  You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * @author <a href="http://tfox.org">Tim Fox</a>
 */

import org.junit.Test;
import org.junit.runner.RunWith;
import org.vertx.testtools.ScriptClassRunner;
import org.vertx.testtools.TestVerticleInfo;

/**
 * This is dummy JUnit test class which is used to run any Groovy test scripts as JUnit tests.
 *
 * The scripts by default go in src/test/resources.
 *
 * If you don't have any Groovy tests in your project you can delete this
 *
 * Do need to edit this file unless you want it to look for tests elsewhere
 */
@TestVerticleInfo(filenameFilter=".+\\.groovy", funcRegex="def[\\s]+(test[^\\s(]+)")
@RunWith(ScriptClassRunner.class)
public class GroovyIntegrationTests {
  @Test
  public void __vertxDummy() {
  }
}
