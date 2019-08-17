function PlantasDAO(connection) {
    this._connection = connection();
}

/*Por enquanto, por simplicidADE, os dados dos sensores serão carregados e atualizados ao iniciar a página home*/
/*O ideal é sejam gerados quando se cadastra um usuário, e só sejam atualizados na home*/
PlantasDAO.prototype.iniciaHome = function(application, res, usuario, planta) {
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("plantas", function(err, collection){

            collection.insert({
                usuario : usuario,
                planta : planta,
                luminosidadeLida : 0,
                temperaturaLida : 0,
                umidadeDoArLida : 0,
                umidadeDoSoloLida : 0
            });

            collection.find({planta : planta}).toArray(function(err, result){

                var nomeDispositivo = "NodeMCU";
                /*Isto aqui provavelmente tem que acontecer dentro do nodemcu, para que na home.ejs ele receba os dados do sensor*/
                /*senão funcionar, quando for testar o nodemcu, por causa de alguma incompatibilidade entre a websocket e a socket.io, tentar usar a recepção de dados com websocket, e depois tentar dar esse emit com io em algum lugar adequado*/
                application.get('io').emit(
                    'msgParaCliente',
                    {nomeDispositivo: nomeDispositivo, statusPlanta: {}}
                );

                res.render('home', {nomeDispositivo : nomeDispositivo, dadosSensoresIniciais : result[0]});

            });

            mongoclient.close();
        
        });
    });
} 

module.exports = function() {
    return PlantasDAO;
}