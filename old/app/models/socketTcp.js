const net = require('net');
const mongoose = require('mongoose');
//mongod --dbpath /data/db --repair    use this comand in terminal linux in trouble case
const Things = mongoose.model('Things');
const User = mongoose.model('User');

exports.iniciarServidor = (io) => {
// //cria primeiro user no banco.
//     var tiago = new User({
//         _id: 'tiago_1234', //token para autenticar o usuario
//         auth: true, //permissão para usar o sistema
//         name: 'Tiago Herique',
//         age: 27,
//         email: "herique.sa@gmail.com",
//         things: []
//     });   
    const servidor = net.createServer(function (sock) {
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        // Add a 'data' event handler to this instance of socket
        sock.status_auth = false;
        const payload_for_thing = {
            auth_user: '',
            auth_thing: '',
            event: {
                cmd: 'connect',
                status: false
            }, //cmd : connect or data, status : true or false
            payload: {
                events: {
                    pin_on: {},
                    msg_on: {},
                    set_pins: {
                        parametres: {}
                    }
                }
            }
        }
        sock.on('data', async (data) => {
            var data = JSON.parse(data);
            console.log(data);
            sock.user_key = data['auth_user'];
            sock.thing_key = data['auth_thing'];

            if ('connect' == data['event']) {
                console.log('connect')
                authUsersThing(sock.user_key,sock.thing_key).
                then((auth)=>{
                    if (auth){
                        payload_for_thing.auth_thing = sock.thing_key;
                        payload_for_thing.auth_user = sock.user_key;
                        sock.status_auth = true;
                        payload_for_thing['payload']['events'].set_pins = 'teste';
                        payload_for_thing['event'] = {
                            cmd: 'connect',
                            status: true
                        };
                        sock.write(JSON.stringify(payload_for_thing));
                        let update_value = {
                            status_socket_tcp: true,
                            id_socket_tcp: sock.remoteAddress
                        };
                        att_thing_db_update(sock.thing_key, update_value);
                        io.of(sock.user_key).emit('message', 'Thing is connectd');
                        io.of(sock.user_key).in(sock.thing_key).emit('message', 'Thing is connectd');
                    }else{
                            sock.status_auth = false;
                            console.log(' user not auth');
                            payload_for_thing['event'] = {
                                cmd: 'connect',
                                status: false
                            };
                            sock.write(JSON.stringify(payload_for_thing));
                    }
                });                 

            } else if ('data' == data['event'] && sock.status_auth) {
                console.log('data payload events', data['payload']['events'])                
                if ('pin_on' in data['payload']['events']) {

                    console.log('log pin_on rcv');
                    let pin_rcv = data['payload']['events']['pin_on'];
                    let update_value = {
                        pin_on_thing: pin_rcv  
                                      };
                    att_thing_db_update(sock.thing_key, update_value);

                    io.of(sock.user_key).in(sock.thing_key).emit('get pins','pin rcv '+pin_rcv);

                    getThingAttribute(sock.thing_key, 'pin_on_client').then((atributo) =>{
                        payload_for_thing['payload']['events'].pin_on = atributo;
                        sock.write(JSON.stringify(payload_for_thing));
                    });
                }
                if ('msg_on' in data['payload']['events']) {
                    console.log('msg rvc');

                    let msg_rcv = data['payload']['events']['msg_on'];
                    
                    let update_value = {
                        msg_on_thing:  msg_rcv                        
                    };
                    att_thing_db_update(sock.thing_key, update_value);

                    io.of(sock.user_key).emit('msg on', msg_rcv);
                    io.of(sock.user_key).in(sock.thing_key).emit('msg on',msg_rcv);

                    getThingAttribute(sock.thing_key, 'msg_on_client')
                    .then((atributo) =>{
                        payload_for_thing['payload']['events'].msg_on = atributo;
                        sock.write(JSON.stringify(payload_for_thing));
                    });
                }
                if ('plot_on' in data['payload']['events']) {
                    console.log('plot vezes')
                    let plot_rcv = data['payload']['events']['plot_on'];
                    io.of(sock.user_key).in(sock.thing_key).emit('plot on', plot_rcv);
                    let update_value = {
                        plot_on: plot_rcv
                        };                    
                    //pushThingElementList(sock.thing_key, update_value);                    
                    getThingAttribute(sock.thing_key, 'plot_on')
                    .then((atributo) =>{
                        console.log(atributo);
                        sock.write(JSON.stringify(payload_for_thing));
                    });
                }
            } else {
                sock.status_auth = false;
                console.log(" user not auth or event don't existe");
                payload_for_thing['event'] = {
                    cmd: 'connect',
                    status: false,
                    error: "maybe your msg is wrote wrong."
                };
                sock.write(JSON.stringify(payload_for_thing));
                sock.end();
            }
        });
        // Add a 'close' event handler to this instance of socket
        sock.on('close', function (data) {
            sock.status_auth = false;
            let update_value = {
                status_socket_tcp: false
            };
            att_thing_db_update(sock.thing_key, update_value);
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

        sock.on('error', function (err) {
            console.log(err);
        });
    });
    //-------------------------------------------TCP UP-------------------------
    const EventEmitter = require('events');
    class ChatThings extends EventEmitter {}
    const chatThings = new ChatThings();
    var ios = {};

    chatThings.on('start namespace', function (key) {
        //creat namespace for each user 
        ios[key] = io.of('/' + key);
        ios[key].on('connection', function (socketio) {
            console.log('someone connected a ' + key + '\n' + " id " + socketio.id);
            //creat a room for each thing 
            socketio.on('room', (room) => {
                console.log('creat room ', room, ' in name space', key);
                socketio.join(room);
            });

            socketio.on('set pins', async (msg) => {
                console.log(msg['payload']);
                let update_value = msg['payload'];
                att_thing_db_update(msg['auth_thing'], update_value)
            });

            socketio.on('msg on', async (msg) => {
                let update_value = msg['payload'];
                att_thing_db_update(msg['auth_thing'], update_value)
                });

            socketio.on('keyboard update', async(msg)=>{
                let update_value = msg['payload'];
                console.log(update_value);
                // att_thing_db_update(msg['auth_thing'], update_value);
                });

            //desnecessary event
            socketio.on('start thing', (msg) => {
                let update_value = {status_io_room:true};
                att_thing_db_update(msg['auth_thing'], update_value)
                console.log(msg);
            });
        });
        console.log('namespace', key,' criado');
    });
    chatThings.emit('start namespace', 'tiago_1234');
    return servidor;
}

authUsersThing = async (user, thing_token) => {
    return await Things
    .findOne({
        auth: thing_token
    })
    .then((auth_thing) =>{
        console.log()
        if (auth_thing.proprietary == user) {
            return true;
        }else{
            return false;
        }
    })
    .catch((err) => {
        console.log(err);
    });
};
getThingAttribute = async (thing_token,attribute) =>{
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
att_thing_db_update = async (key, settingTo) => {
    console.log('try update ', key, '')
    console.log(settingTo)
    await Things.update({
        auth: key
    }, {
        $set: settingTo
    }, (err, data) => {
        if (err) console.log(err);
        console.log('seted ')
    });
};
pushThingElementList = async (thing_token, settingTo) => {
    console.log('try push ', thing_token, '')
    console.log(settingTo)
    await Things.update({
        auth: thing_token
    }, {
        $push: settingTo
    }, (err, data) => {
        if (err) console.log(err);
        console.log('pushed');
    });
};
//creator for a sample of user 
creatUserAndFirstThing = (user_creat) => {
    //saving the user
    user_creat.save(function (err) {
        //creat a first thing for user
        var newThing = new Things({
            name_thing: 'token 1 coisa',
            proprietary: user_creat._id,
            socket_io_name_space: user_creat._id,
            socket_io_room: '',
            status_io_room: false,
            id_socket_tcp: '',
            status_tcp: false,
            status_socket_tcp:false,
            pin_on_client: {1:'2'},
            pin_on_thing: {1:'3'},
            auth: '-L4CFqSZHb3PyVUjs4xf',
            
            msg_on_thing: 'teste',
            msg_on_client:'teste',

            pins_setup: {},
            plot_on: [],
            client_dashboard: [],
        });
        //add the new thing in collection user's thing
        user_creat.things.push(newThing);
        user_creat.save();
        newThing.save(function (err) {
            //if (err) return handleError(err);
            console.log('save first thing for user');
        });
        console.log('save user');
        //if (err) return handleError(err);
    });
};
// getThingAttribute('-L4CFqSZHb3PyVUjs4xf', 'pin_on_thing').then((atributo) =>{
//     console.log(atributo)
// });