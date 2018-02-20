/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
var expressValidator = require('express-validator');

/* Importar o módulo do express-session. */
var expressSession = require('express-session');

const mongoose = require('mongoose');

/* iniciar o objeto do express */
var app = express();

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* configurar o middleware express-validator */
app.use(expressValidator());

/* Configurar o middleware express-session */
app.use(expressSession({
	secret: '80d499cac5e64c17620654587ec37dc5',
	resave: false,
	saveUninitialized: false
}));

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/schemas')
	.then('app/routes')
	.then('app/models')
	.then('app/controllers')
	.into(app);
/* exportar o objeto app */

/* middleware que configura páginas de status */
app.use(function(req, res, next){
	res.status(404).send('page not found 404');
	next();
});

/* middleware que configura msgs de erro internos */
app.use(function(err, req, res, next){
	res.status(500).send('errors/500');
	next();
});

// Conecta com o banco de dados e lida com problemas de conexão
mongoose.connect('mongodb://127.0.0.1:27017/iotretasdb');
mongoose.Promise = global.Promise; // → queremos que o mongoose utilize promises ES6
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 → ${err.message}`);
});

module.exports = app;