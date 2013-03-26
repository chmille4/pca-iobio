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
server.listen(8010);

// define tool
var tool = {
   apiVersion : "0.1",
   name : 'pca',
   // path: '/Users/chase/Desktop/tmp_workspace/PCAminion/test.R'
   // path: 'cat'
   json: function(data) {
      data = String(data);
      var lines = data.split("\n");
      var results = []; 
      for (var i=0; i < lines.length; i++) {
         results.push(lines[i].split(","));
      }
      return JSON.stringify(results);
   },
   path: '/Users/chase/Tools/snpRelate/pcaStream2.R'
};

// add tool to minion server
minion.addTool(tool);

// start minion socket
minion.listen(io);
