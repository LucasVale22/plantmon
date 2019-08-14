module.exports = function(application){
	application.post('/luminosidade', function(req, res){ 
		application.app.controllers.luminosidade.mostraRelatorio(application, req, res)
	});
	application.get('/luminosidade', function(req, res){
		application.app.controllers.luminosidade.mostraRelatorio(application, req, res)
	});
}