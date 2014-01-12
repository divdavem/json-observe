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

module.exports = function(grunt) {
  grunt.registerMultiTask("jsonObserve", "jsonObserve processor", function() {
    var processString = require("../processor/processString");
    this.files.forEach(function(file) {
      if (file.src.length != 1) {
        grunt.log.warn("jsonObserve only supports one source file per destination file.");
        return;
      }
      var filePath = file.src[0];
      var fileContent = grunt.file.read(filePath);
      var result = processString(fileContent, filePath);
      grunt.file.write(file.dest, result.content);
    }, this);

  });
};
