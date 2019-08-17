function UsuariosDAO(connection) {
	this._connection = connection();
}

UsuariosDAO.prototype.cadastrarUsuario = function(usuario){
    this._connection.open(function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){

			collection.insert(usuario);

			mongoclient.close();

		});
	});
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open(function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){

			collection.find(usuario).toArray(function(err, result){
				
				if(result[0] != undefined){
					req.session.autorizado = true;
					req.session.usuario = result[0].usuario;
				}
				if(req.session.autorizado) {
					res.redirect('home');
				} else {
					res.redirect('/');
				}
			});

			mongoclient.close();

		});
	});
}

module.exports = function() {
	return UsuariosDAO;
}