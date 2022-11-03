const axios = require("axios");
// create exportable module for the function onTransactionCreate
module.exports.onTransactionCreate = async (userData, transactionData) => {
  // TODO
  // Login to cinetpay
  let logindata = {
    apikey: "303961111635796d9a226b6.09891449",
    password: "RHuzZJ7arHEaJ@w",
  };
  var config = {
    method: "post",
    url: "https://client.cinetpay.com/v1/auth/login",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(logindata),
  };
  const resp = await axios(config).catch((e) => console.log("error ", e));
  console.log(resp);
  // create contact with user email, phone, name, surname, prefix
  // update user doc with isAddedContact true
};

module.exports.onWithdrawal = async (userData, transactionData) => {
  // TODO
  // use user phone number, amount, transactionId, prefix to create a transfer request
  // update transaction doc with isTransfereRequested true
};
