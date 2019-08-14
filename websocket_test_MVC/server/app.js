/*importando as configurações do servidor*/
var app = require('./config/server');

/*criando um servidor*/
const server = app.listen(3000, function(){
    console.log('**---> SERVIDOR ONLINE <---**');
});

/*regastando o ip local do servidor node.js (este ip deve estar do lado do cliente)*/
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
});

/*tanto requisições http ou websockets agora são recebidas e interpetadas*/
var io = require('socket.io').listen(server);

/*Cria a variável global io através da função set*/ 
app.set('io', io); 

/*----------Cria conexão por WebSocket-----------*/ 
/* A instância do objeto io vai buscar pelo evento connection chamado no lado do cliente */
io.on('connection', function(socket){
    
    console.log("Usuário Conectou!");

    socket.on('disconnect', function(){
        console.log("Usuário Desconectou!");
    });

    socket.on('msgToServer', function(sensorData){
        /*Disparo de evento de mensagem*/
        socket.emit(
            'msgToClient',
            {
                sensorName: sensorData.sensorName, 
                measure: sensorData.measure
            }
        );

        socket.broadcast.emit(
            'msgToClient',
            {
                sensorName: sensorData.sensorName, 
                measure: sensorData.measure
            }
        );

    });

});

