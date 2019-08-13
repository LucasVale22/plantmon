/*importando as configurações do servidor*/
var app = require('./config/server');
var http = require('http');
var path = require('path');

/*criando um servidor*/
const server = http.createServer(app);//create a server

/*regastando o ip local do servidor node.js (este ip deve estar do lado do cliente)*/
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
});

/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const s = new WebSocket.Server({ server });

//*************************************************************************************************************************
//***************************ws chat server********************************************************************************

//app.ws('/echo', function(ws, req) {
s.on('connection',function(ws,req){

    /******* when server receives messsage from client trigger function with argument message *****/
    ws.on('message',function(message){
        console.log("Received: "+message);
        s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
            if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
                client.send("broadcast: " +message);
            }
        });
    // ws.send("From Server only to sender: "+ message); //send to client where message is from
    });
    ws.on('close', function(){
        console.log("lost one client");
    });
    //ws.send("new client connected");
    console.log("new client connected");
});


/*parametrizando a porta de escuta*/
server.listen(3000, function(){
    console.log('**---> SERVIDOR ONLINE <---**');
});
