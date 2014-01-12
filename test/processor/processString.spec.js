/*
 * Copyright 2014 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var processString = require("../../processor/processString");
var expect = require("expect.js");
var vm = require("vm");
var jsonObserve = require("../../runtime/json-observe");

describe("Processor", function() {

  function runJsCode(code) {
    return vm.runInNewContext(code, {
      require: function(requiredFile) {
        expect(requiredFile).to.equal("json-observe");
        return jsonObserve;
      }
    });
  }

  it("tests processed code", function() {
    var mySourceFunction = function(a) {
      a.a = 1;
      a.a += 1;
      a.b = ++a.a;
      a.c = a.a++;
      a.d = 10;
      a.e = --a.d;
      a.f = a.d--;
      a.d -= 10;
      a.g = "ok";
      delete a.g;
    };
    var result = processString("(" + mySourceFunction.toString() + ")");
    expect(result.changed).to.equal(true);
    var myProcessedFunction = runJsCode(result.jsCode);

    var a1 = {};
    var a2 = {};
    var expectedChgList = [{
      type: "new",
      name: "a",
      newValue: 1,
      oldValue: undefined
    }, {
      type: "updated",
      name: "a",
      newValue: 2,
      oldValue: 1
    }, {
      type: "updated",
      name: "a",
      newValue: 3,
      oldValue: 2
    }, {
      type: "new",
      name: "b",
      newValue: 3,
      oldValue: undefined
    }, {
      type: "updated",
      name: "a",
      newValue: 4,
      oldValue: 3
    }, {
      type: "new",
      name: "c",
      newValue: 3,
      oldValue: undefined
    }, {
      type: "new",
      name: "d",
      newValue: 10,
      oldValue: undefined
    }, {
      type: "updated",
      name: "d",
      newValue: 9,
      oldValue: 10
    }, {
      type: "new",
      name: "e",
      newValue: 9,
      oldValue: undefined
    }, {
      type: "updated",
      name: "d",
      newValue: 8,
      oldValue: 9
    }, {
      type: "new",
      name: "f",
      newValue: 9,
      oldValue: undefined
    }, {
      type: "updated",
      name: "d",
      newValue: -2,
      oldValue: 8
    }, {
      type: "new",
      name: "g",
      newValue: "ok",
      oldValue: undefined
    }, {
      type: "deleted",
      name: "g",
      newValue: undefined,
      oldValue: "ok"
    }];
    var observer = function(chgList) {
      expect(chgList.length).to.equal(1);
      var chg = chgList[0];
      expect(chg.object).to.be(a1);
      delete chg.object;
      var item = expectedChgList.shift();
      expect(chg).to.eql(item);
    };
    jsonObserve.observe(a1, observer);
    myProcessedFunction(a1);
    mySourceFunction(a2);
    jsonObserve.unobserve(a1, observer);
    expect(a1).to.eql(a2);
    expect(expectedChgList.length).to.equal(0);
  });
});
