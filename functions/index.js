const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const updateBet = require("./updateBets/index");
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

// exports.usersBets = functions.firestore
//   .document("users/{userId}/bets")
//   .onWrite((change, context) => {
//     console.log("change", change);
//     console.log("context", context);
//   });
// exports.userDoc = functions.firestore
//   .document("users/{userId}")
//   .onWrite((change, context) => {
//     console.log("change", change);
//     console.log("change", context);
//   });

exports.userBetsReader = updateBet.updateBet;

/**
 * This function will update the user data with the location data based on the user city
 */
// exports.updateUserGeolocalisation = functions.firestore
//   .document("users/{userId}")
//   .onCreate((snap, context) => {});
