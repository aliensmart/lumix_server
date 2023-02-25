module.exports.recursiveCollectionDelete = async (documentReference) => {
  // List all subcollections of the document.
  const subcollections = await documentReference.listCollections();

  // For each subcollection, get each document.
  for (let subcollection of subcollections) {
    // This gets all documents in the subCollection.
    const querySnapshot = await subcollection.get();

    // For each document, if there are subcollections, recurse.
    // Otherwise, delete the document.
    for (let doc of querySnapshot.docs) {
      // Recurse for each document.
      await this.recursiveCollectionDelete(doc.ref);
    }
  }

  // Delete the document if no subcollections exist.
  await documentReference.delete();
};

/**
 * Takes an array of items then return a random index
 * @example
 * ```
 * const arr = [1, 2, 4, 5]
 * const randomIndex = randomizer(arr)
 * const randomPick = arr[randomIndex]
 * ```
 * @param {array} arr
 * @returns index
 */
module.exports.randomizer = (arr) => Math.floor(Math.random() * arr.length);

/**
 * This is a shufller, which suffle an array of items them makes the array unpredictable
 * @example
 * ```
 * const arr = [1, 2, 3, 4]
 * shuffleArray(arr)
 * console.log(arr) => [1,3,4,2]
 * ```
 * @param {array} array
 */
module.exports.shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

// Returns a Promise that resolves after "ms" Milliseconds
module.exports.timer = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * This takes an array of items then randomly pick and item then remove the picked item from the array
 * * @example
 * ```
 * const arr = [1, 2, 3, 4]
 * const randomPick  = randomItem(arr)
 * console.log(randomPick) => [2]
 * console.log(arr) => [1, 3, 4]
 * ```
 * @param {array} arr
 * @returns array of single item
 */
module.exports.randomItem = (arr) =>
  arr.splice((Math.random() * arr.length) | 0, 1);

// const generateRandom = (min = 500, max = 1000) => {
//   // find diff
//   let difference = max - min;

//   // generate random number
//   let rand = Math.random();

//   // multiply with difference
//   rand = Math.floor(rand * difference);

//   // add with min value
//   rand = rand + min;

//   return rand;
// };
