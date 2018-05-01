import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_CHECK } from 'admin-on-rest';
import { firebase } from './firebase'

export default (type, params) => {
    if (type === AUTH_LOGIN) {
        
        const { username, password } = params;

       return firebase.auth().signInWithEmailAndPassword(username, password)
            .then(user => {
                localStorage.setItem('UID', user.uid);
                Promise.resolve();
            })
            .catch(error => {
                const { message } = error;
                Promise.reject(message);
            });
    }

   if (type === AUTH_LOGOUT) {

        localStorage.removeItem('UID');

        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // An error happened.
           console.log(error);
        });

        return Promise.resolve(); 

    }
     
    if (type === AUTH_CHECK) {
        return localStorage.getItem('UID') ? Promise.resolve() : Promise.reject();
    } 

    //return Promise.reject();
}

