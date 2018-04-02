const net = require('net');
const mongoose = require('mongoose');
const Things = mongoose.model('Things');

exports.iniciarServidor = (io) => {

    const servidor = net.createServer(function (sock) {
        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
        // io.of(user_key).in(thing_key).emit('message', 'msg2');
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
                if (auth_user_stream(sock.user_key, sock.thing_key)) {
                    payload_for_thing.auth_thing = sock.thing_key;
                    payload_for_thing.auth_user = sock.user_key;
                    sock.status_auth = true;
                    let update_value = {status_socket_tcp:true , id_socket_tcp:sock.remoteAddress};
                    payload_for_thing['payload']['events'].set_pins = 'teste';
                    payload_for_thing['event'] = {
                        cmd: 'connect',
                        status: true
                    };
                    console.log(payload_for_thing)
                    sock.write(JSON.stringify(payload_for_thing));
                    att_thing_db_update(sock.thing_key,update_value);
                    //att_thing_db_update('update info sobre socket thing : socket.remoteAddress e statusTCP');

                } else {
                    sock.status_auth = false;
                    console.log(' user not auth');
                    payload_for_thing['event'] = {
                        cmd: 'connect',
                        status: false
                    };
                    sock.write(JSON.stringify(payload_for_thing));

                }
                console.log(sock.status_auth);
            } else if ('data' == data['event'] && sock.status_auth) {
                if ('pin_on' in data['payload']['events']) {
                    pin_rcv = data['payload']['events']['pin_on'];

                    att_thing_db_update("user's thing { pin_on : { thing : pin_rcv} } ")
                    io.of(sock.user_key).emit('get pins', 'namespace');
                    io.of(sock.user_key).in(sock.thing_key).emit('message', 'sala');

                    //consulta banco para saber se tem pins pra enviar de client
                    payload_for_thing['payload']['events'].pin_on = 'teste'

                    sock.write(JSON.stringify(payload_for_thing));


                } else if ('msg_on' in data['payload']['events']) {
                    msg_rcv = data['payload']['events']['msg_on'];
                    att_thing_db_update("user's thing { msg_on : { thing : msg_rcv} } ")
                    io.of(user_key).emit('msg on', msg_rcv);
                }
                //}


            } else {
                sock.status_auth = false;
                console.log(' user not auth');
                payload_for_thing['event'] = {
                    cmd: 'connect',
                    status: false
                };
                sock.write(JSON.stringify(payload_for_thing)); //sock.end();
            }


        });
        // Add a 'close' event handler to this instance of socket
        sock.on('close', function (data) {
            sock.status_auth = false;
            let update_value = {status_socket_tcp:false};
            att_thing_db_update(sock.thing_key,update_value);
            console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });

        sock.on('error', function (err) {
            // integração firebase

            console.log(err);
        });
    });
    //-------------------------------------------TCP UP


    const EventEmitter = require('events');
    class ChatThings extends EventEmitter {}
    const chatThings = new ChatThings();

    var ios = {};

    chatThings.on('start namespace', function (key) {

        ios[key] = io.of('/' + key);
        ios[key].on('connection', function (socketio) {
            console.log('someone connected a ' + key + '\n' + " id " + socketio.id);
            socketio.on('room', function (room) {
                console.log('creat room ', room, ' in name space', key);
                socketio.join(room);
            });

            socketio.on('set pins', async (msg) => {
                const things = await Things.find({});
                console.log(things);
                console.log(msg);
            });

            socketio.on('msg on', function (msg) {
                console.log(msg);
            });

            socketio.on('start thing', function (msg) {
                console.log(msg);
            });
        });
        console.log('evento io', key);
    });

    chatThings.emit('start namespace', 'tiago-1234');



    return servidor;
}
att_thing_db_update = async (key, settingTo) => {
    console.log('try update ',key, '')
    console.log(settingTo)
    await Things.update({auth: key}, {$set: settingTo},function (err, data) {
        if (err) console.log(err);
        console.log('foi?')
    });
 }

auth_user_stream = async (user, key) => {
    const consultaThing = await Things.findOne({
        auth: key
    });
    if (consultaThing.proprietary == user) {
        return true;
    } else {
        return false;
    }
}



