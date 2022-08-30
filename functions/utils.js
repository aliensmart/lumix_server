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
      await this.recursiveDeleteSubcollections(doc.ref);
    }
  }

  // Delete the document if no subcollections exist.
  await documentReference.delete();
};
