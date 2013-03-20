#!/usr/bin/env node

// temporary until i understand why freebayes seg faults on the stream
// process.on('uncaughtException', function (exception) {
//    // handle or ignore error
// });

var minion = require('../minion/minion'),
    http = require('http'),
    app = minion(),
    server = http.createServer(app);
    

// setup socket
var io = require('socket.io').listen(server);

// start server
server.listen(8000);

// define tool
var tool = {
   apiVersion : "0.1",
   name : 'gds2pca',
   path: '/Users/chase/Tools/snpRelate/pca.R'
};

// add tool to minion server
minion.addTool(tool);

// start minion socket
minion.listen(io);
