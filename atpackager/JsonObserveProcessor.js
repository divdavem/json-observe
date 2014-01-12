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

module.exports = function(atpackager) {
  var process = require("../processor/process")(atpackager.uglify);
  var format = require("../processor/format")(atpackager.uglify);
  var grunt = atpackager.grunt;
  var uglifyContentProvider = atpackager.contentProviders.uglifyJS;
  var textContentProvider = atpackager.contentProviders.textContent;
  var alreadyDoneKey = "jsonObserveProcessor:processed:" + (new Date()).getTime();

  var JsonObserveProcessor = function(cfg) {
    cfg = cfg || {};
    this.files = cfg.files || ["**/*.js"];
    this.stringBased = "stringBased" in cfg ? cfg.stringBased : true;
  };

  JsonObserveProcessor.prototype._convertFile = function(packaging, inputFile) {
    if (inputFile[alreadyDoneKey]) {
      return;
    }
    if (!inputFile.isMatch(this.files)) {
      return;
    }
    inputFile[alreadyDoneKey] = true;
    var stringBased = this.stringBased && (inputFile.contentProvider !== uglifyContentProvider);
    var textContent = stringBased ? inputFile.getTextContent() : null;
    var ast = uglifyContentProvider.getAST(inputFile, textContent);
    if (ast) {
      try {
        var changes = process(ast);
        if (!changes) {
          return;
        }
        inputFile.clearContent(); // content has changed, clear everything
        uglifyContentProvider.setAST(inputFile, ast);
        if (stringBased) {
          textContentProvider.setTextContent(inputFile, format(ast));
          inputFile.contentProvider = textContentProvider;
        } else {
          inputFile.contentProvider = uglifyContentProvider;
        }
        grunt.verbose.writeln("[JsonObserveProcessor] Processed " + inputFile.logicalPath.yellow + " successfully.");
      } catch (e) {
        grunt.log.error("[JsonObserveProcessor] Could not process " + inputFile.logicalPath.yellow + ": " + e);
      }
    }
  };

  JsonObserveProcessor.prototype.computeDependencies = function(packaging, inputFile) {
    this._convertFile(packaging, inputFile);
  };

  JsonObserveProcessor.prototype.onWriteInputFile = function(packaging, outputFile, inputFile) {
    this._convertFile(packaging, inputFile);
  };
  return JsonObserveProcessor;
};
