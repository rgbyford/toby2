// Initialize Firebase

const firebase = require("firebase");

const config = {
    apiKey: "AIzaSyCsDh3ra7faSCJycuwelMipu-6biTdqFMM",
    authDomain: "rgb-rps.firebaseapp.com",
    databaseURL: "https://rgb-rps.firebaseio.com",
    projectId: "rgb-rps",
    storageBucket: "rgb-rps.appspot.com",
    messagingSenderId: "277284413470"
};
firebase.initializeApp(config);
const firestore = firebase.firestore();
// the next four lines stop a firebase error message
const settings = {
    timestampsInSnapshots: true
};
firestore.settings(settings);

const collRef = firestore.collection("Contacts");

module.exports = collRef;