var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//var winston = require('winston');
var  logger = require('./utils/logger');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('Comet v1 listening on *:3000');
  logger.info('Server running');
});

var clients = {};

io.on('connection', function(socket){

  console.log('a user connected.');

  socket.on('add-user', function(userdata){

    var datos =JSON.parse(userdata);
    
    clients[userdata.username] = { socket: socket.id };
    var userok =  { nombre:datos.username , estado:'ok' };

    io.sockets.connected[clients[userdata.username].socket].emit("add-user-ok", JSON.stringify( userok));
  });

  socket.on('get-approval', function(data){
    var datos =JSON.parse(data);
    console.log('solicitud de aprobacion.' +  datos.operacion );
    var pending = { nombre:datos.username , operacion:datos.operacion, estado:'pending' };
//    io.sockets.connected[clients[data.username].socket].emit("pending-approval", 'Su aprobacion está pendiente:' + datos.operacion );
    io.sockets.connected[clients[data.username].socket].emit("pending-approval",JSON.stringify(pending ));
    var supervisor = { nombre:datos.username , operacion:datos.operacion, estado:'need-approval' };
    io.emit("need-approval",  JSON.stringify(supervisor) );
    
  });

});


