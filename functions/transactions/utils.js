// create exportable module for the function onTransactionCreate
module.exports.onTransactionCreate = async (userData, transactionData) => {
  // TODO
  // Login to cinetpay
  // create contact with user email, phone, name, surname, prefix
  // update user doc with isAddedContact true
};

module.exports.onWithdrawal = async (userData, transactionData) => {
  // TODO
  // use user phone number, amount, transactionId, prefix to create a transfer request
  // update transaction doc with isTransfereRequested true
};
