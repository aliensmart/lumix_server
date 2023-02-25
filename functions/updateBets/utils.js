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
const getAllPlayedUser = async (gameRef) => {
  let usersBetsDocs = await gameRef.collection("usersBets").get();

  let userBetData = usersBetsDocs?.docs?.map((doc) => {
    return { ...doc?.data(), ref: doc?.ref };
  });
  return userBetData;
};

const chooseSingle = async (workedData, DocumentReference, betData) => {
  const players = [...workedData];

  const winNumber = betData?.winnersNumber;
  await DocumentReference.update({ isShuffling: true });

  const winningAmount = betData?.winAmount;
  for (let i = 0; i < winNumber; i++) {
    let chosen = utils.randomItem(players);
    const beter = chosen?.[0];

    const amount =
      Math.floor(beter?.betAmount / betData?.minBet) * winningAmount;

    // Update user document with the current gamed
    await beter?.playerRef?.update({
      totalWon: admin.firestore.FieldValue.increment(amount),
      availableAmount: admin.firestore.FieldValue.increment(amount),
    });

    await beter?.ref?.update({
      won: admin.firestore.FieldValue.increment(amount),
      isChosen: true,
      lastUpdated: admin.firestore.Timestamp.now(),
    });

    // Remove the selected player from the array
    players.splice(players.indexOf(chosen), 1);

    // Shuffle the array again for the next selection
    utils.shuffleArray(players);
  }

  players?.forEach((player) => {
    if (!player?.isChosen) {
      player?.playerRef?.update({
        totalLost: admin.firestore.FieldValue.increment(player?.betAmount),
      });
      player?.ref?.update({
        lost: admin.firestore.FieldValue.increment(player?.betAmount),
        lastUpdated: admin.firestore.Timestamp.now(),
      });
    }
  });

  await DocumentReference.update({
    status: "ENDED",
    isShuffling: false,
    played: true,
  });
  // await
};

module.exports.runGame = async (DocumentReference) => {
  const workedData = await getAllPlayedUser(DocumentReference);
  const betDoc = await DocumentReference?.get();
  const betData = betDoc?.data();

  // update all document of devs when game start playing
  await Promise.all(
    workedData?.map((userBets) => {
      userBets?.ref?.update({ status: "PLAYING" });
    })
  ).catch((e) => console.log(e));
  // Choose winners
  await chooseSingle(workedData, DocumentReference, betData).catch((e) =>
    console.log(e)
  );

  // update all document of devs after choosing docs
  await Promise.all(
    workedData?.map((userBets) => {
      userBets?.ref?.update({ status: "ENDED", played: true });
    })
  ).catch((e) => console.log(e));
  return;
};
