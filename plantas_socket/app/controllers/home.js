module.exports.exibeRelatorio = function (application, req, res) {

	var dadosUsuario = req.body;
	console.log(dadosUsuario.usuario);
	
	/*application.get('io').emit(
		'msgParaCliente',
		{nomeSensor: dadosSensor.nomeSensor, medida: ' está mandando medidas...'}
		);

	res.render('home', {dadosSensor: dadosSensor});*/
	res.render('home');

}