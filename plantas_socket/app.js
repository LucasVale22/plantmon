/* importar as cofigurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
var server = app.listen(3000, function(){ //porta padrão de todos os navegadores
	console.log('Servidor Online');
});

/*regastando o ip local do servidor node.js (este ip deve estar do lado do cliente)*/
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
});

var io = require('socket.io').listen(server); /*tanto requisições http ou websockets agora são recebidas e interpetadas*/

app.set('io', io); /*a função set tbm permite criar variáveis globais|criou uma variável io */

/*criar a conexão por websocket */
io.on('connection', function(socket){ /* a instância do objeto io vai buscar pelo evento connection chamado no lado do cliente */
	console.log('Usuário conectou');

	socket.on('disconnect', function(){
		console.log('Usuário desconectou');
	});

	socket.on('msgParaServidor', function(dadosDispositivo){
		/*disparo de evento de troca de medidas*/

		/*receber os dados e tentar colocar no banco de dados aqui*/

		socket.emit(
			'msgParaCliente', 
			{nomeDispositivo: dadosDispositivo.nomeDispositivo, statusPlanta: dadosDispositivo.statusPlanta}
		);

		socket.broadcast.emit(
			'msgParaCliente', 
			{nomeDispositivo: dadosDispositivo.nomeDispositivo, statusPlanta: dadosDispositivo.statusPlanta}
		);

		/*disparo de Dispositivoes*/
		if(parseInt(dadosDispositivo.dispositivo_atualizado_nos_clientes) == 0){
			socket.emit(
				'sensoresParaCliente', 
				{nomeDispositivo: dadosDispositivo.nomeDispositivo}
			);

			socket.broadcast.emit(
				'sensoresParaCliente', 
				{nomeDispositivo: dadosDispositivo.nomeDispositivo}
			);
		}
	});
}); 

