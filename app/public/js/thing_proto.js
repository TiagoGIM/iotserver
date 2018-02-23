$(document).ready(function () {
    //   Hide the border by commenting out the variable below
    var $on = 'section';
    $($on).css({
        'background': 'none',
        'border': 'none',
        'box-shadow': 'none'
    });

});

const nome_coisa = window.location.hash.replace('#', ''),
socket = io('/tiago_1234');

var room = nome_coisa;

let data_client = {
    auth_user: 'tiago_1234',
    auth_thing: nome_coisa,
    payload: {
        events: {}
    },
    sender: 'client'
}, keyboard_buttons = [];

socket.on('connect', function () {
    //console.log('try connect');
    socket.emit('room', room);
});

socket.on('message', function (data) {
    console.log('Incoming message:', data);
});

socket.on('load page', function (msg) {
    socket.emit('start thing', ids);
    console.log('on', msg);
});

socket.on('get pins', function (msg) {
    console.log(msg);
});

socket.on('msg on', function (msg) {
    console.log('payload', msg);
    $('#demo').text("thing msg: " + msg);
});

criarTeclado = (label, state, pin) => {
    return (`  
        <button id="${label}" state="${ state }" pin="${ pin }" class="mdl-button mdl-js-button mdl-button--raised">
            ${label}
        </button>
    `);
};

addButtonPin = () => {
    const dataForm = {
        label: $('#button_label').val(),
        pin: $('#button_pin option:selected').val(),
        state: $('#button_state').val()
    };

    if (dataForm.label == '') {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Insira um nome para do botão'
        });
        return;
    }else if (dataForm.state == '') {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Insira o estado do botão'
        });
        return;
    }else if (dataForm.pin == '') {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Insira o pino do botão'
        });
        return;
    }
    
    keyboard_buttons.push({
        name: dataForm.label,
        pin: dataForm.pin,
        state: dataForm.state
    });

    $("#keyboard_buttons").append( criarTeclado(dataForm.label, dataForm.state, dataForm.pin) );

    $(`#${ dataForm.label }`).click( _ => {
        
        console.log(`Clicou`);

    });

    // Limpar campos 
    $('#div_button_label').get(0).MaterialTextfield.change('');
    $('#div_button_state').get(0).MaterialTextfield.change('');
    $('#button_pin').val('');  
};

keyboard_save = () => {
    
   data_client.payload.events = {
        pin_on: keyboard_buttons
    };  

    console.log(data_client.payload.events);

    //socket.emit('dashboard', data_client);
};

visu_form_hide = () => {
    $('#div_form').hide();
};

status = () => {
    socket.emit('load page', data_client);
}

/* set_pin = () => {
    data_client['payload'] = {
        pin_on_client: [{
            pin: '4',
            state: 0
        }, {
            pin: '2',
            state: 1
        }]
    }
    console.log(data_client)
    socket.emit('set pins', data_client);
} */


// initial time for plot chart
var valor_chart = [
    [0, 0]
];

// incial time for plot chart 
var start = Date.now() / 1000 | 0;

// coisas pro charts
google.charts.load('current', {
    packages: ['corechart', 'line']
});

start_grafic = () => {

    google.charts.load('current', {
        packages: ['corechart', 'line']
    });

    socket.on('plot on', (plot) => {
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
