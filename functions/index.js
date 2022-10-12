// const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const updateBet = require("./updateBets");
const userFunctions = require("./updateUsers");
// const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.userBetsReader = updateBet.updateBet;
exports.chooseWinner = updateBet.chooseWinners;

exports.onDeleteUser = userFunctions.onUserDelete;
exports.onUserCreate = userFunctions.createUser;

/**
 * This function will update the user data with the location data based on the user city
 */
// exports.updateUserGeolocalisation = functions.firestore
//   .document("users/{userId}")
//   .onCreate((snap, context) => {});
