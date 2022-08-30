/*
 * This file contains the functions which listen for the deletion of a dev,
 * and deletes the respective devs' subcollections.
 *
 * Functions:
 *
 * deleteDevSubcollections -> deletes subcollections from deleted devs to prevent orphaned documents.
 * Listens for changes to -> devs
 *
 * updateDevsLocation -> adds location fields to devs upon their addition to the devs collection.
 * Listens for changes to -> devs
 *
 * updateDevsRates -> This function generates rate documents based upon rate ranges.
 * Listens for changes to -> devs/{devsDocID}/rateRanges/{rateRangesID}
 *
 */

/*
 * Requirements:
 * admin -> Required for accessing the database.
 * enums -> Required for enums.
 * functions -> Required for listening for changes.
 * got -> Required for fetching from Google Places API.
 * utils -> Required for utility functions to support the main functions.
 *
 * Consts:
 * db -> The database, instantiated.
 */
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const db = admin.firestore();

module.exports.updateBet = functions.firestore
  .document("users/{userId}/userBets/{betId}")
  .onWrite((change, context) => {
    const beforData = change?.before;
    const afterData = change?.after;
    const betId = context.params.betId;

    // Meaning the document has been created
    if (!beforData?.exists && afterData?.exists) {
      // TODO
      // Update the beter count by incrementing it with 1
      db.collection("bets")
        .doc(`${betId}`)
        .update({
          beters: admin.firestore.FieldValue.increment(1),
        })
        .catch((e) => console.log(e));
    }
    if (beforData?.exists && afterData?.exists) {
      //meaning the document exists already and it is an update
      return;
    }

    // this means the document has been deleted
    if (beforData?.exists && !afterData?.exists) {
      // When a user delete a bets
      // Update the beter count by decrementing it with 1

      db.collection("bets")
        .doc(`${betId}`)
        .update({
          beters: admin.firestore.FieldValue.increment(-1),
        })
        .catch((e) => console.log(e));
    }
  });
