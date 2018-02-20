/* importar as configurações do servidor */
var app = require('./config/server');
const servidorTcp = require('./app/models/socketTcp');

/* parametrizar a porta de escuta */
const http = app.listen(3000, function(){
	console.log('Servidor online');
});

var io = require('socket.io')(http);

servidorTcp.iniciarServidor(io).listen(5000,function(){
	console.log('Server tcp listening on ' + 5000);
});



