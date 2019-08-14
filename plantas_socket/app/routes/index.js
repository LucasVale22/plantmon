module.exports = function(application){
	application.get('/', function(req, res){
		application.app.controllers.index.home(application, req, res) /*formato: objeto_do_express.diretório_dos_controllers.arquivo_com_propriedades_exportáveis.função_associada_à_propriedade_index*/
	});
}