const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// exports.usersBets = functions.firestore
//   .document("users/{userId}/bets")
//   .onWrite((change, context) => {
//     console.log("change", change);
//     console.log("context", context);
//   });
exports.userDoc = functions.firestore
  .document("users/{userId}")
  .onWrite((change, context) => {
    console.log("change", change);
    console.log("change", context);
  });

exports.userBetsReader = functions.firestore
  .document("users/{userId}/bets/{betId}")
  .onWrite((change, context) => {
    console.log("change", change);
    const beforData = change?.before;
    const afterData = change?.after;

    console.log("before data", beforData?.exists);

    // Meaning the document has been created
    if (!beforData?.exists && afterData?.exists) {
    }
    if (beforData?.exists && afterData?.exists) {
      //meaning the document exists already and it is an update
    }

    // this means the document has been deleted
    if (beforData?.exists && !afterData?.exists) {
    }
    console.log("after data", afterData);
    console.log("context ", context);
  });

/**
 * This function will update the user data with the location data based on the user city
 */
exports.updateUserGeolocalisation = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    
  });
