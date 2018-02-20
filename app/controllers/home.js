//instancia mongoose e schema para consulta no request
const mongoose = require('mongoose');
const Things = mongoose.model('Things');

exports.index = async (application,req,res) => {
	//quando o usuário faz um get no index o server exibe as coisas que existem no banco.
 	res.render('index');
};

exports.thing = async (application,req,res) => {
	const things = await Things.find({});
	console.log(things);
	res.render('thing_proto');
	console.log('get things')
};
