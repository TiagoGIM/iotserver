const io = require('socket.io')();

io.on('connection', (client) => {

  client.on('open_room', key => {
    console.log(`Open new room with ID='${key}'`);
  });
  
  client.on('message', msg => {
    console.log(`Recived: '${msg}'`);
  });

  client.on('get_pins', pins => {
    let a_pins = [1, 2, 3, 4, 5];
    console.log(`Available pins: ${a_pins}`);
  });

  client.on('save_keyboard', keyboard => {
    console.log(`Salvar o keyboard: \n`, keyboard);
  });

});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
