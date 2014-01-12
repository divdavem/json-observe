/*
 * openarms: manage distribution of food for people with low income.
 * Copyright (C) 2013 DivDE <divde@free.fr>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      sources: ["**/*.json", "**/*.js", "!node_modules/**"],
      options: {
        debug: true,
        unused: true,
        eqnull: true,
        quotmark: "double"
      }
    },
    jsbeautifier: {
      update: {
        src: "<%= jshint.sources %>"
      },
      check: {
        src: "<%= jshint.sources %>",
        options: {
          mode: "VERIFY_ONLY"
        }
      },
      options: {
        js: {
          indentSize: 2
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: "spec"
        },
        src: [
          "test/**/*.spec.js"
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-test");

  grunt.registerTask("beautify", ["jsbeautifier:update"]);
  grunt.registerTask("build", []);
  grunt.registerTask("test", ["jsbeautifier:check", "jshint:sources", "mochaTest"]);
  grunt.registerTask("default", ["build", "test"]);

};
