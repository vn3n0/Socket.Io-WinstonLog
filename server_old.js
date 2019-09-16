var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('Comet v1 listening on *:3000');
});

var clients = {};

io.on('connection', function(socket){

  console.log('a user connected.');

  socket.on('add-user', function(userdata){
    var nombre =JSON.stringify(userdata);
    //var nombre = userdata["RealAISUser"];
    clients[userdata.username] = { usuario: { socket: socket.id, RealAISUser : 'blisboa' } };
    var userok = {usuariook : { realaisuser:nombre, estado:'ok' }};

    io.sockets.connected[clients[userdata.username].usuario.socket].emit("add-user-ok", userok);
  });

  socket.on('get-approval', function(data){
    console.log('solicitud de aprobacion.' +  data);
    io.sockets.connected[clients[data.username].usuario.socket].emit("pending-approval", 'Su aprobacion está pendiente:' + JSON.stringify(clients) + data );
    io.emit("need-approval", 'Se necesita su aprobacion para la operacion:' + JSON.stringify(clients) + data );

  });

});


