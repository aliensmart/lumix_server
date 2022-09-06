const admin = require("firebase-admin");
// const functions = require("firebase-functions");
const utils = require("../utils");
const db = admin.firestore();
// https://stackoverflow.com/questions/58577984/how-to-prevent-firebase-firestore-emulator-from-clearing-the-database-at-exit
/**
 * This will check from the database and finds all users that have played this paries
 * @param {string} gameId
 * @return array of objects containing the user Id and the amount he has played
 */
const getAllPlayedUser = async (gameId) => {
  let playersIds = [];
  let maxEl = 0;
  const playersDocs = await db
    .collectionGroup("userBets")
    .where("betId", "==", gameId)
    .get();
  const dataArr = playersDocs?.docs?.map((doc) => {
    const singleObj = {
      userId: "", // id of the user
      amountPlayed: 0, // total amount the user has played
      numberInArray: 0, // this is the amount the user has played divided by 500
    };

    let data = doc?.data();
    let userId = doc.ref.parent.parent.id;
    singleObj.amountPlayed = data.amountPlayed;
    singleObj.userId = userId;
    singleObj.numberInArray = Math.floor(data.amountPlayed / 500);
    maxEl = maxEl < singleObj.numberInArray ? singleObj.numberInArray : maxEl;
    for (let i = 0; i < singleObj.numberInArray; i++) {
      playersIds.push(userId);
    }
    return singleObj;
  });
  return { usersData: dataArr, players: playersIds, maxEl: maxEl };
};

const chooseSingle = async (workedData, DocumentReference) => {
  const players = [...workedData?.players];

  const winNumber = workedData?.maxEl;
  await DocumentReference.update({ isShuffling: true });

  // const winningAmount = [0, 0, 0, 500, 750, 1000, 1500];
  const winningAmount = [500, 750, 1000];
  for (let i = 0; i < winNumber; i++) {
    const randomAmount = utils.randomizer(winningAmount);
    utils.shuffleArray(players);
    let chosen = utils.randomItem(players);

    const amount = winningAmount[randomAmount];
    if (amount > 0) {
      await db
        .doc(`users/${chosen?.[0]}/userBets/${DocumentReference?.id}`)
        .update({
          won: admin.firestore.FieldValue.increment(amount),
          isChosen: true,
          lastUpdated: admin.firestore.Timestamp.now(),
        })
        .catch((e) => console.log(e));
      await db
        .doc(`users/${chosen?.[0]}/`)
        .update({
          totalWon: admin.firestore.FieldValue.increment(amount),
          availableAmount: admin.firestore.FieldValue.increment(amount),
        })
        .catch((e) => console.log(e));
    }
  }
  // console.log(randomAmount);
  await DocumentReference.update({ status: "ENDED", isShuffling: false });
  // await
};

module.exports.runGame = async (DocumentReference) => {
  const workedData = await getAllPlayedUser(DocumentReference.id);
  // console.log(workedData);

  // update all document of devs when game start playing
  await Promise.all(
    workedData?.usersData?.map((userdata) => {
      db.doc(
        `users/${userdata?.userId}/userBets/${DocumentReference.id}`
      ).update({ status: "PLAYING" });
    })
  ).catch((e) => console.log(e));
  // Choose winners
  await chooseSingle(workedData, DocumentReference).catch((e) =>
    console.log(e)
  );

  // update all document of devs after choosing docs
  await Promise.all(
    workedData?.usersData?.map((userdata) => {
      db.doc(
        `users/${userdata?.userId}/userBets/${DocumentReference.id}`
      ).update({ status: "ENDED" });
    })
  ).catch((e) => console.log(e));

  // u
};
