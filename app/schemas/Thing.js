const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var thingSchema = Schema({
    proprietary: {
        type: String,
        ref: 'User'
    },

    name_thing: String,
    auth: String,

    socket_io_name_space: String,
    socket_io_room: String,
    status_io_room: Boolean,

    id_socket_tcp: String,
    status_socket_tcp: Boolean,

    pin_on_client: Object,
    pin_on_thing: Object,
    
    msg_on_thing: String,
    msg_on_client: String,
    
    plot_on: [],
    
    pins_setup:Object,

    client_dashboard: [{
        type: Schema.Types.ObjectId,
        ref: 'Dashboard' // ainda vou criar esse schema
    }]
});

module.export = mongoose.model('Things', thingSchema);