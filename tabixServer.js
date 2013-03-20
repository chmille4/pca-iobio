#!/usr/bin/env node

// temporary until i understand why freebayes seg faults on the stream
process.on('uncaughtException', function (exception) {
   // handle or ignore error
});

var minion = require('../minion/minion'),
    http = require('http'),
    app = minion(),
    server = http.createServer(app);
    

// setup socket
var io = require('socket.io').listen(server);

// start server
server.listen(7090);

// define tool
var tool = {
   apiVersion : "0.1",
   name : 'tabix',
   path: '/Users/chase/Tools/tabix-0.2.6/tabix',
   json : function(data) {
      data = String(data);      
      var lines = data.split("\n");
      var numLines = lines.length;
      var results = [];
      for (var i=0; i < numLines; i++) {
         var line = lines[i];
         if (line && line.charAt(0) != '#') {
            var values = line.split("\t");
            results.push ({
                chrom    : values[0],
                pos      : values[1],
                id       : values[2],
                ref      : values[3],
                alt      : values[4],
                qual     : values[5],
                filter   : values[6],
                info     : values[7],
                format   : values[8],
                genotypes: values.slice(9, values.length)
            });
         }
      }
      return JSON.stringify(results);
   }};

// add tool to minion server
minion.addTool(tool);

// start minion socket
minion.listen(io);
