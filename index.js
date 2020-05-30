var express = require('express'); 
var http = require('http');
var socket = require('socket.io');

var app = express();
app.use(express.static('public'));
var server = http.createServer(app);


var users = [];

server.listen(3000, function(){
    console.log("Corriendo en el puerto 3000");
})

var io = socket.listen(server);

app.get('/', function(llamado, respuesta){
    respuesta.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    socket.on('new-user', function(user, callback){
        if(exitUser(user)){
            callback(false);
        }
        else{
            callback(true);
            socket.user = user;
            users.push(user);
            updateUser();
            io.emit('message', {message: 'Se ha conectado', user : socket.user})
        }
    })
    
    socket.on('new-message', function(message){
        io.emit('message', {message: message , user : socket.user})
    })

    socket.on("disconnect", function(data){
        users.splice(users.indexOf(socket.user),1);
        io.emit('message', {message: 'Se ha desconectado', user : socket.user})
        updateUser();
    })

    function exitUser(user){
        if(users.indexOf(user) != -1){
            return true;
        }
     
        return false;
     }
     
     function updateUser(){
         io.emit('update-users', users);
     }
})

