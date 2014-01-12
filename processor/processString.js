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

var UglifyJS = require("uglify-js");
var processAST = require("./processAST")(UglifyJS);
var formatAST = require("./formatAST")(UglifyJS);

module.exports = function(fileContent, fileName) {
  var ast = UglifyJS.parse(fileContent, {
    filename: fileName
  });
  var changed = processAST(ast);
  return {
    changed: changed,
    jsCode: changed ? formatAST(ast, fileContent) : fileContent
  };
};
