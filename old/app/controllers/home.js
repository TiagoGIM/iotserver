//instancia mongoose e schema para consulta no request
const mongoose = require('mongoose');
const Things = mongoose.model('Things');

exports.index = async (application,req,res) => {
	//quando o usuário faz um get no index o server exibe as coisas que existem no banco.
 	res.render('index');
};

exports.thing = async (application,req,res) => {
	getThingAttribute('-L4CFqSZHb3PyVUjs4xf', 'pin_on_thing').then((atributo) =>{
    console.log(atributo)
});

	res.render('thing_proto', {pins_avaliable:{pins: [1,2,3,4,5]}});
	console.log('get things')
};

var getThingAttribute = async (thing_token,attribute) =>{
    return  await Things
                .findOne({
                    auth: thing_token
                })
                .then((thing)=>{
                    return thing[attribute]
                })
                .catch((err)=>{
                    console.log(err);
                    return false
                });  
};

