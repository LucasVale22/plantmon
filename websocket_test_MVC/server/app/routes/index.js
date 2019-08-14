module.exports = function(application){

	application.post('/index', function(req, res){ //rota recebe o chat via post, executando a propriedade do modulo chat iniciaChat
		application.app.controllers.index.showSensorData(application, req, res)
	});

	application.get('/index', function(req, res){
		application.app.controllers.index.showSensorData(application, req, res);
	});

}