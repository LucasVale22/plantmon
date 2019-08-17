module.exports.home = function (application, req, res) {

	if(req.session.autorizado !== true) {
		res.send('Usuário precisa fazer login!');
		return;
	}

	var usuario = req.session.usuario;
	var planta = req.session.planta;

	var connection = application.config.dbConnection;
	var PlantasDAO = new application.app.models.PlantasDAO(connection);

	PlantasDAO.iniciaHome(usuario, planta);
	
	/*application.get('io').emit(
		'msgParaCliente',
		{nomeSensor: dadosSensor.nomeSensor, medida: ' está mandando medidas...'}
		);

	res.render('home', {dadosSensor: dadosSensor});*/

}