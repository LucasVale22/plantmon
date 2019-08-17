module.exports = function(application){
	application.get('/home', function(req, res){
		application.app.controllers.home.home(application, req, res);
	});
}