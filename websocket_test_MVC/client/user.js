var http = require('http');
//var address = require('../server/app');

var opcoes = {
    hostname: '192.168.0.103',
    port: 3000,
    path: '/',
    method: 'get',
    headers: {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
    }
};

var html = 'nome=José'; //x-www-form-urlencoded
var json = {nome: 'José'};
var string_json = JSON.stringify(json);

var buffer_corpo_response = [];

var req = http.request(opcoes, function(res){
    res.on('data', function(pedaco){
        buffer_corpo_response.push(pedaco);
    });

    res.on('end', function(){
        var corpo_response = Buffer.concat(buffer_corpo_response).toString();
        console.log(corpo_response);
    });
});


//var sock=new WebSocket("ws://192.168.0.103:3000");

req.write(string_json);
req.end();