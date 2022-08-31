const admin = require("firebase-admin");
const functions = require("firebase-functions");
const db = admin.firestore();

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
    return data;
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
const randomItem = (arr) => arr.splice((Math.random() * arr.length) | 0, 1);
const chooseSingle = async (workedData) => {
  const players = [...workedData?.players];
  const winNumber = workedData?.maxEl;
  shuffleArray(players);
  let playeNo = 0;
  while (playeNo < 10) {
    console.log(players.length);
    let chosen = randomItem(players);
    console.log("this user has been choosen ", chosen);
    shuffleArray(players);
    playeNo++;
  }
  console.log(playeNo);
};

module.exports.runGame = async (DocumentReference) => {
  DocumentReference.update({ isShuffling: true });
  const workedData = await getAllPlayedUser(DocumentReference.id);
  console.log(workedData);
  //   chooseSingle(workedData);
};
