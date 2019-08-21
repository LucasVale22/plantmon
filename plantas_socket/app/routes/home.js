module.exports = function(application){
	application.get('/home', function(req, res){
		application.app.controllers.home.home(application, req, res);
	});
	application.get('/relatorio', function(req, res){
		application.app.controllers.home.relatorio(application, req, res);
	});
}