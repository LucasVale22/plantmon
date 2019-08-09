/*importando as configurações do servidor*/
var app = require('./config/server');
var http = require('http');
var path = require('path');
var address;

/*criando um servidor*/
const server = http.createServer(app);//create a server

/*regastando o ip local do servidor node.js (este ip deve estar do lado do cliente)*/
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
    address = add;
});

/*parametrizando a porta de escuta*/
server.listen(3000, function(){
    console.log('**---> SERVIDOR ONLINE <---**');
});

module.exports = address;