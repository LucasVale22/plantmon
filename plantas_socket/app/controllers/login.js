module.exports.login = function(application, req, res) {
	res.render('login', {validacao: {}});
}

module.exports.autenticar = function(application, req, res) {

	var dadosFormulario = req.body;

	req.assert('usuario', 'Campo do usuário está vazio.').notEmpty();
	
	var errosAutenticacao = req.validationErrors();

	if(errosAutenticacao) {
		res.render('login', {validacao : errosAutenticacao});
		return;
	}

	/*var connection = application.config.dbConnection;
	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);*/

	console.log(dadosFormulario.usuario + ' entrou!');

	res.send(dadosFormulario);

	res.redirect('/home');

}