// LOGIN 
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    $(".login-cover").hide();
    var dialog = document.querySelector('dialog');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    dialog.close();

  } else {
    $(".login-cover").show();
    var dialog = document.querySelector('dialog');
    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    dialog.showModal();
    dialog.show();
  }
});


$.get('/esp-info')
  .then(data => console.log(data));


// Criação dos Card

var criar_card_ouvinte = firebase.database().ref('/users/tiago_1234');

criar_card_ouvinte.on("child_added", function (esp, prevChildKey) {
  var novoEsp = esp.val();
  console.log(esp.key);
  console.log("Author: " + novoEsp.Nome);
  console.log("Previous Post ID: " + esp.key);

  $("#container").append(criarCard(esp.key, novoEsp.Nome, "Coisa"));

  var $btn_1 = $("#container").find("#" + esp.key + " button[name='ligarDados']");
  var $btn_2 = $("#container").find("#" + esp.key + " button[name='desligarDados']");

  $btn_1.click(function () {
    window.location = "http://192.168.43.224:3000/thing#" + esp.key;

  });

  $btn_2.click(function () {
    firebase.database().ref('users/tiago_1234' + esp.key).update({
      "Send": "Off"
    });
  });



  // ouvintes individuais de card

  var reff = '/users/tiago_1234' + esp.key;

  firebase.database().ref(reff).on('value', function (esp) {
    var $espCard = $("#container").find('#' + esp.key);
    console.log(esp.val());

    $espCard.find("#nome").text(esp.child('Nome').val());
    $espCard.find("#bad").attr("data-badge", esp.child('connections').val());
    $espCard.find("#dados").text(esp.child('Status').val());

  });
});


$("#CreatThing").click( //simple put value  
  function writeUserData() {
    var newref = '/users/'
    var postData = {
      Nome: "Coisa nova"
    };
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref(newref).child('tiago_1234').push().key;

    console.log(newPostKey)
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    postData['Nome'] = newPostKey;
    postData['idIO'] = "";
    postData['idTCP'] = "";
    postData['statusIO'] = false;
    postData['statusTCP'] = false;
    postData['data'] = {
      pin_on: {
        thing: "",
        client: ""
      },
      msg_on: {
        thing: "",
        client: ""
      }
    };
    updates[newPostKey] = postData;
    console.log(updates)

    return firebase.database().ref('users/tiago_1234').update(updates);

  }
);


$("dontsend").click( //simple put value  
  function writeUserData() {

    firebase.database().ref('users/' + key_id).update({
      "Send": "Off"
    });

  }
);



$("#loginButton").click(
  function () {
    var email = $("#loginEmail").val();
    var pw = $("#loginPassword").val();

    if (email != "" && pw != "") {
      $("#loginProgress").show();
      $("#loginButton").hide();

      firebase.auth().signInWithEmailAndPassword(email, pw).catch(function (error) {
        $("#erroLogin").show().text(error.message);
        $("#loginProgress").hide();
        $("#loginButton").show();

      });
    }
  }
);

// LOGOUT
$("#signOut").click(
  // User is signed in.
  function () {
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    firebase.auth().signOut().then(function () {
      $("#loginProgress").hide();
      $("#loginButton").show();
      // Sign-out successful.
    }).catch(function (error) {
      // An error happened.
    });
  }
);


// Fim 



function criarCard(id_key, nome_da_coisa, status_da_coisa) {
  return (`

  <div Class = "mdl-grid mdl-grid--no-spacing" id=${id_key}>
  
  <div class="demo-card-wide mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
          <h2 id="nome" class="mdl-card__title-text">${nome_da_coisa}</h2>
      </div>
      <div id="dados" class="mdl-card__supporting-text">
          ${status_da_coisa}
      </div>
      <div class="mdl-card__actions mdl-card--border">
          <div class="mdl-layout-spacer"></div>

          <i id="bad" class="material-icons mdl-badge mdl-badge--overlap" data-badge="">wifi_tethering</i>
          <button name ="desligarDados" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Stop
          </button>

          <button name ="ligarDados" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
              Try Send
              <i class="button-right-icon  material-icons">perm_scan_wifi</i>
          </button>
      </div>
  </div>
  
</div>


  `)
};