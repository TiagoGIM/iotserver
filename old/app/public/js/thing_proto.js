const key_thing = window.location.hash.replace('#', ''),
socket = io('/tiago_1234');


// $.get('/pins_avaliable')
//     .then(data => console.log(data)); 

let keyboard_buttons = [],
data_client = {
    auth_user: 'tiago_1234',
    auth_thing: key_thing,
    payload: {
        events: {}
    },
    sender: 'client'
};

$(document).ready(function () {
    //   Hide the border by commenting out the variable below
    var $on = 'section';
    $($on).css({
        'background': 'none',
        'border': 'none',
        'box-shadow': 'none'
    });
});

//Entra em sala exclusiva
socket.on('connect', function () {
    socket.emit('room', key_thing);
});

socket.on('message', function (data) {
    console.log('Incoming message:', data);
});

//recebe status de pins direto da coisa.
socket.on('get pins', function (msg) {
    console.log(msg);
});
//  exibe msg direto da coisa 
socket.on('msg on', function (msg) {
    console.log('payload', msg);
    $('#thing_msgs').text("thing msg: " + msg);
});


$criarTeclado = (label, state, pin) => {
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
        state: $('#button_state option:selected').val()
    };

    if (dataForm.label == '') {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Insira o nome do botão'
        });
        return;
    } else if (dataForm.state == '') {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Insira o estado do botão'
        });
        return;
    } else if (dataForm.pin == '') {
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


    $("#button_pin > option[value='"+ dataForm.pin +"']").remove();
   
    $("#keyboard_buttons").append($criarTeclado(dataForm.label, dataForm.state, dataForm.pin));

    $(`#${ dataForm.label }`).click(_ => {
        //change button state betwen 0 and 1.
        Object.keys(keyboard_buttons).forEach((key) => {
            //console.log(key, keyboard_buttons[key])
            if (dataForm.label == keyboard_buttons[key]['name']) {
                if (keyboard_buttons[key]['state'] == 1) {
                    keyboard_buttons[key].state = 0;
                } else {
                    keyboard_buttons[key].state = 1;
                }
            }
        });

        data_client['payload'] = {
            pin_on_client: keyboard_buttons
        }
        socket.emit('set pins', data_client);

    });

    // Limpar campos 
    $('#div_button_label').get(0).MaterialTextfield.change('');
    $('#button_state').val('');
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

    $('#keyboard_support_txt').append(`
        <button onclick="visu_form_show()" id="visu_form_show" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i class="material-icons">visibility</i>
        </button> 
    `);
};

visu_form_show = () => {
    $('#div_form').show();

    $('#visu_form_show').remove();
};

status = () => {
    socket.emit('load page', data_client);
};

set_pin = () => {
    /* data_client['payload'] = {
        pin_on_client: [{
            pin: '4',
            state: 0
        }, {
            pin: '2',
            state: 1
        }]
    } */

    console.log(data_client)
    //socket.emit('set pins', data_client);
};

hideCard = which => {
    $(`#${which}_card`).remove();

    $('#nav_drawer').append(`
        <a id="${which}_card" onclick="showCard('${which}_card');" class="mdl-navigation__link">
            <i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">
                ${which == 'graph' ? 'timeline': which}
            </i>
            ${which}
        </a>
    `);

};

showCard = which => {
    $('#dashboard').append(window[which]);

    $(`a#${which}`).remove();
};

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



/* // send msg for server whit event "msg_on"
$(() => {
    $('#chat_form').submit(function () {
        data_client['payload'] = {
            msg_on_client: $('#m').val()
        }
        socket.emit('msg on', data_client);
        $('#m').val('');
    });
}); */

