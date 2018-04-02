import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

function open_room(key) {
    socket.emit('open_room', key);
}

function sendMsg(msg) {
    socket.emit('message', msg);
}

function getPins() {
    socket.emit('get_pins');
}

function saveKeyboard(keyboard) {
    socket.emit('save_keyboard', keyboard);
}

export {
    open_room,
    sendMsg,
    getPins,
    saveKeyboard
};