var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var userSchema = Schema({
    _id: {
        type: String
    },
    name: String,
    age: Number,
    auth: String,
    things: [{
        type: Schema.Types.ObjectId,
        ref: 'Things'
    }]
});

module.export = mongoose.model('User', userSchema);




