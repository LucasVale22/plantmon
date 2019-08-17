function PlantasDAO(connection) {
    this._connection = connection();
}

/*Por enquanto, por simplicidADE, os dados dos sensores serão carregados e atualizados ao iniciar a página home*/
/*O ideal é sejam gerados quando se cadastra um usuário, e só sejam atualizados na home*/
PlantasDAO.prototype.iniciaHome = function(usuario, planta) {
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

            mongoclient.close();
        
        });
    });
} 

module.exports = function() {
    return PlantasDAO;
}