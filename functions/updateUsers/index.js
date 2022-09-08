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
const utils = require("../utils");

module.exports.onUserDelete = functions.firestore
  .document("users/{userId}")
  .onDelete(async (change, context) => {
    utils.recursiveCollectionDelete(change.ref).catch((e) => {
      console.log("error while deleting user... ", change.ref.path);
    });
  });

module.exports.createUser = functions.https.onCall(async (data, context) => {
  const { email, password } = data;
  const userRecord = await admin
    .auth()
    .createUser({ email: email, password: password })
    .catch((e) => console.log(e));
  return userRecord.uid;
});
