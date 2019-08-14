module.exports.mostraRelatorio = function (application, req, res) {
	
	var dadosSensor = req.body;

	req.assert('nomeSensor', 'Nome do sensor é obrigatório.').notEmpty(); //nome do campo que está sendo transitado no input (form) do chat.ejs (view)
	req.assert('nomeSensor', 'Nome deve conter entre 3 e 15 caracteres.').len(3,15);

	var erros = req.validationErrors();

	if(erros){
		res.render('index', {validacao: erros}); //o proprio send já finaliza nosso processamento
		return; //só é obrigatório pra outra coisa que não seja send, pois o bloco abaixo do if continuará sendo procesaado
	}

	application.get('io').emit(
		'msgParaCliente',
		{nomeSensor: dadosSensor.nomeSensor, medida: ' está mandando medidas...'}
		);

	res.render('luminosidade', {dadosSensor: dadosSensor});
}