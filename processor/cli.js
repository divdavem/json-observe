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

var process = exports.process = function(inputFile, outputFile) {
  var fs = require("fs");
  var processString = require("./processString");
  var fileContent = fs.readFileSync(inputFile, "utf8");
  var res = processString(fileContent, inputFile);
  fs.writeFileSync(outputFile, res.jsCode);
  console.log("Successfully created " + outputFile);
};

exports.cli = function() {
  var optimist = require("optimist").usage("jsonObserveProcessor -i [input file] -o [output file]").options({
    "help": {
      description: "Displays this help message and exits."
    },
    "version": {
      description: "Displays the version number and exits."
    },
    "input-file": {
      alias: "i",
      description: "Input file [required]."
    },
    "output-file": {
      alias: "o",
      description: "Output file [required]."
    }

  });
  var argv = optimist.argv;

  if (argv.help) {
    optimist.showHelp();
  } else if (argv.version) {
    console.log(require("../package.json").version);
  } else if (!(argv["input-file"] && argv["output-file"])) {
    optimist.showHelp();
    console.log("Missing one or more mandatory parameter(s).");
  } else {
    process(argv["input-file"], argv["output-file"]);
  }
};
