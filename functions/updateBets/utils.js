const admin = require("firebase-admin");
const functions = require("firebase-functions");
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
    console.log("userId ", userId);
    singleObj.numberInArray = Math.floor(data.amountPlayed / 500);
    maxEl = maxEl < singleObj.numberInArray ? singleObj.numberInArray : maxEl;
    for (let i = 0; i < singleObj.numberInArray; i++) {
      playersIds.push(userId);
    }
    return singleObj;
  });
  return { usersData: dataArr, players: playersIds, maxEl: maxEl };
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

const generateRandom = (min = 500, max = 1000) => {
  // find diff
  let difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
  rand = rand + min;

  return rand;
};
// Returns a Promise that resolves after "ms" Milliseconds
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
const randomItem = (arr) => arr.splice((Math.random() * arr.length) | 0, 1);
const chooseSingle = async (workedData, DocumentReference) => {
  const players = [...workedData?.players];

  const winNumber = workedData?.maxEl;
  await DocumentReference.update({ isShuffling: true });

  for (let i = 0; i < 20; i++) {
    shuffleArray(players);
    let chosen = randomItem(players);
    console.log(players);
    const amount = 1000;
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
      })
      .catch((e) => console.log(e));
  }

  await DocumentReference.update({ status: "ENDED", isShuffling: false });
};

module.exports.runGame = async (DocumentReference) => {
  const workedData = await getAllPlayedUser(DocumentReference.id);
  console.log(workedData);
  chooseSingle(workedData, DocumentReference);
};
