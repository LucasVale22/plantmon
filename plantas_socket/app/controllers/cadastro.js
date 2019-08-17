module.exports.cadastro = function(application, req, res){
    res.render('cadastro', {validacao: {}});
}

module.exports.cadastrar = function(application, req, res){
    
    var dadosFormulario = req.body;

    req.assert('usuario', 'Nome de usuário não pode ser vazio.').notEmpty();
    req.assert('usuario', 'Nome de usuário deve conter no máximo 10 caracteres.').len(0, 10);
    req.assert('senha', 'Senha de usuário não pode ser vazio!').notEmpty();
    req.assert('senha', 'Senha de usuário conter no máximo 4 caracteres!').len(0, 4);
    req.assert('planta', 'Nome/espécie da planta não pode ser vazio(a)!').notEmpty();
    req.assert('planta', 'Nome/espécie da planta no máximo 15 caracteres!').len(0, 15);

    var errosCadastro = req.validationErrors();

    if(errosCadastro) {
        res.render('cadastro', {validacao : errosCadastro});
        return;
    }

    var connection = application.config.dbConnection;
    var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

    UsuariosDAO.cadastrarUsuario(dadosFormulario);
    
    res.redirect('/');
}