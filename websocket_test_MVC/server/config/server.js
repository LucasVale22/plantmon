/*framework express: facilita a criação de uma API com recursos robustos e flexíveis, incluindo métodos utilitários e middlewares */
var express = require('express');

/*módulo consign: permite e facilita o autoload dos scripts com arquivos separados logicamente, seguindo a MVC */
var consign = require('consign');

/*middleware body-parser: analisa e fornece o resgate de body de um requisição*/
var bodyParser = require('body-parser');

/*módulo express-validator: middleware que facilita a validação de formulários e afins*/
//var expressValidator = require('express-validator');

/*iniciando um objeto do express*/
var app = express();

/*setando as configurações de renderização do express através de views em ejs (template que permite e faciliya a inserçaõ de javascript no html)*/
app.set('view engine', 'ejs');
app.set('views', './app/views');

/*configurando o middleware express.static para entrega de arquivos estáticos na pasta public*/
app.use(express.static('./app/public'));

/*middleware body-parser trata a urls como*/
app.use(bodyParser.urlencoded({extended: true}));
/*trata apenas jsons permitindo apenas requisições onde o content-type esteja definido como tal*/
app.use(bodyParser.json());

/* configurar o middleware express-validator */
//app.use(expressValidator());

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	.then('app/models')
	.then('app/controllers')
    .into(app);
    
/*exportando o objeto da aplicação*/    
module.exports = app;

