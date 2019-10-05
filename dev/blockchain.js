const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
function Blockchain(){
  this.chain =[];
  this.pendingRecord = []; //pending transactions property
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];
  this.createNewBlock(100, '0','0');
}

Blockchain.prototype.createNewBlock = function(nonce , previousBlockHash , hash) {
  const newBlock ={
    index: this.chain.length + 1,    //explains number of the block
    timestamp: Date.now(),
    transactions: this.pendingRecord,
    nonce: nonce,
    hash: hash,
    previousBlockHash:previousBlockHash  //hash from the previous block
  };

  this.pendingRecord = []; //so that we put all new transactionsinto this block
  this.chain.push(newBlock); //feeds new block into chain array

  return newBlock;
}

Blockchain.prototype.getLastBlock = function(){

  return this.chain[this.chain.length -1];
}

Blockchain.prototype.createNewRecord = function(patientName ,docName , comments ) {
  const newRecord = {
    patientName: patientName,
    docName: docName,
    comment: comments
    RecordId:uuid().split('-').join('')
  }; // creates new transaction and pushes it to pending transactions

  return newRecord;
};


Blockchain.prototype.addReToPendingRe = function(transactionObj){
  this.pendingRecord.push(transactionObj);
  return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash , currentBlockData,nonce) {
  const dataAsString = previousBlockHash + nonce.toString() +  JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash , currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash , currentBlockData,nonce);

  while (has,substring(0,4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash , currentBlockData,nonce);
  }

  return nonce;
}
module.exports = Blockchain;
