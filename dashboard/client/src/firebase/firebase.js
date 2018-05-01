import * as firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB83J8lFNxFdcbTFS50bb3qwQjzv4z7smc",
    authDomain: "iotretas-666.firebaseapp.com",
    databaseURL: "https://iotretas-666.firebaseio.com",
    projectId: "iotretas-666",
    storageBucket: "iotretas-666.appspot.com",
    messagingSenderId: "441016955201"
};

firebase.initializeApp(config);

const auth = firebase.auth();

export {
  auth,
  firebase
}