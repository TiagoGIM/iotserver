var nome_coisa = window.location.hash.replace('#', '')

const socket = io('/tiago_1234');
var room = nome_coisa;
var data_client = 
{
    auth_user: 'tiago_1234',
    auth_thing: nome_coisa,
    payload: "",
    sender:'client'
}
socket.on('connect', function() {
    console.log('try connect');
   socket.emit('room', room);
 });
socket.on('message', function(data) {
    console.log('Incoming message:', data);
 });

socket.on('load page', function (msg) {
    socket.emit('start thing', ids);
    console.log('on',msg);
 });

socket.on('get pins', function (msg) {
    console.log(msg);
 });

socket.on('msg on', function(msg){
    console.log('payload',msg);
    $('#demo').text("thing msg: "+msg);
 });


 $( () => {
    $('form').submit(function () {
        data_client['payload'] = {msg_on_client : $('#m').val()}
        socket.emit('msg on',data_client );
        $('#demo').val('');
        return false;
    });
   // evento "nome da coisa"
});

criarTeclado = (id_key, buttonLabel) => {
    return (`  
        <button id = ${id_key} name = 'changPinState' >
        ${buttonLabel}
        </button>
       `);
  };

status = () =>{
    socket.emit('load page', data_client);
}
set_pin = () => {
        data_client['payload'] = { pin_on_client :[{pin:'4',state:0},{pin:'2',state:1}]}
        console.log(data_client)
        socket.emit('set pins', data_client);
    }
var bl = 0;
addButtonPin = () => {
    bl = bl+1
    $("#demo_3").append(criarTeclado(bl, bl));   
    var $btn = $("#demo_3").find("#" + bl + " button[name='changPinState']");
    $btn.click(function () {
      console.log('teste click');
    });
    console.log('btn bosta nao foi')
};

// initial time for plot chart
var valor_chart = [
    [0, 0]
]; // incial time for plot chart 
var start = Date.now() / 1000 | 0;
// coisas pro charts
google.charts.load('current', {
    packages: ['corechart', 'line']
});

start_grafic = () => 
{
    
    google.charts.load('current', {
        packages: ['corechart', 'line']
    });    
    
    socket.on('plot on',  (plot) => {
        console.log(plot)
        google.charts.setOnLoadCallback(drawBasic(plot));
    
        //google.charts.setOnLoadCallback(drawBasic(data['connections']));
    
    function drawBasic(dados) {
        var dado = new google.visualization.DataTable();
        dado.addColumn('number', 'X');
        dado.addColumn('number', 'Dogs');
        var time_stamp = -start + Date.now() / 1000 | 0;
        valor_chart.push([time_stamp, Number(dados)]);
        console.log('valor chart', valor_chart);
        dado.addRows(valor_chart);
        var options = {
            hAxis: {
                title: 'Time'
            },
            vAxis: {
                title: 'Popularity'
            },
            backgroundColor: '#425b5e'
        };
        var chart = new google.visualization.LineChart(document.getElementById('chart_graf'));
        chart.draw(dado, options);
    }
});    
}


$( document ).ready(function(){
    //   Hide the border by commenting out the variable below
        var $on = 'section';
        $($on).css({
          'background':'none',
          'border':'none',
          'box-shadow':'none'
        });
    }); 