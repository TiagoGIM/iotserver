const home = require('../controllers/home.js');
module.exports = (application) => {
	application.get('/', (req, res) => home.index(application, req, res));
	application.get('/thing',(req,res)=> home.thing(application,req,res));
};