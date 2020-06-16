var express = require("express");
var router = express.Router();
const Web3 = require("web3");
const ABI = require("./demo.abi.json");
const tx = require("ethereumjs-tx").Transaction;
const CONTRACT_ADDRESS = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";
/* GET home page. */
router.get("/", async function (req, res, next) {
  console.log(tx);
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:8545/")
  );
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  //account address using for tx

  const privateKey = Buffer.from(
    "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
    "hex"
  );
  const newNumber = 420;

  const DemoContract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  const _data = DemoContract.methods.setNumber(newNumber).encodeABI();

  const acc = accounts[0];
  const _nonce = await web3.eth.getTransactionCount(acc);

  const rawTx = {
    nonce: _nonce,
    gasPrice: "0x20000000000",
    gasLimit: "0x27511",
    to: CONTRACT_ADDRESS,
    data: _data,
  };
  let receipt = new tx(rawTx);
  receipt.sign(privateKey);

  let serializedTx = receipt.serialize();
  let _receipt = await web3.eth.sendSignedTransaction(
    "0x" + serializedTx.toString("hex")
  );

  res.render("index", { title: "Express", result: JSON.stringify(_receipt) });
});

module.exports = router;
