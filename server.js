//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var kue = require('kue');
var ui = require('kue-ui');
var cors = require('cors');

var jobs = kue.createQueue();
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

function create() {
    var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
    jobs.create('video conversion', {
        title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
    }).save();
    setTimeout(create, Math.random() * 3000 | 0);
}

create();
function create2() {
    var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
    jobs.create('email', {
        title: 'emailing ' + name + '', body: 'hello'
    }).save();
    setTimeout(create2, Math.random() * 1000 | 0);
}

//aqui invoca para que se ejecute de una la de arriba
create2();
jobs.process('email', 10, function (job, done) {
    console.log('email');
    setTimeout(done, Math.random() * 2000);
});

var app = express();
app.use(cors());

ui.setup({
    apiURL: '/api', // IMPORTANT: specify the api url
    baseURL: '/kue', // IMPORTANT: specify the base url
    updateInterval: 5000 // Optional: Fetches new data every 5000 ms
});

// Mount kue JSON api
app.use('/api', kue.app);
// Mount UI
app.use('/kue', ui.app);

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Builder on ", process.env.PORT);
});
