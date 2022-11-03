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
const utils = require("./utils");

// module.exports.chooseWinners = _firestore
//   .document("bets/{betId}")
//   .onUpdate(async (change, context) => {
//     const afterChange = change.after;
//     const beforeChange = change.before;

//     const newData = afterChange?.data();
//     const oldData = beforeChange?.data();
//     if (newData.status === "PLAYING" && oldData?.status !== "PLAYING") {
//       //   await utils
//       //     .runGame(afterChange.ref)
//       //     .catch((e) => console.log("error playing game ", e));
//     }
//   });

module.exports.createContact = functions.firestore
  .document("users/{userId}/transactions/{transactionId}")
  .onCreate(async (snap, context) => {
    const transactionData = snap.data();
    transactionData["ref"] = snap.ref;
    console.log(
      "🚀 ~ file: index.js ~ line 91 ~ .onCreate ~ transactionData",
      transactionData
    );
    const userId = context.params.userId;
    const transactionId = context.params.transactionId;
    console.log(
      "🚀 ~ file: index.js ~ line 93 ~ .onCreate ~ transactionId",
      transactionId
    );
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    userData["ref"] = userDoc.ref;

    //   if transaction type is deposit and isAddedContact false we will create a contact and update user doc with isAddedContact true
    if (transactionData?.type === "Deposit" && !userData?.isAddedContact) {
      await utils
        .onTransactionCreate(userData, transactionData)
        .catch((e) => console.log("error creating contact ", e));
    }

    if (transactionData?.type === "Withdraw") {
      await utils
        .onWithdrawal(userData, transactionData)
        .catch((e) => console.log("error creating contact ", e));
    }
    //   else we do nothing
    //   if transaction type is withdraw we will send a transfere request to cinetpay api   with the given contact and amount to withdraw
  });
