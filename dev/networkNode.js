const express= require('express');
const app= express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');


const nodeAddress = uuid().split('-').join('');
const patient = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));

app.get('/blockchain',function(req,res){
res.send(patient);
});

app.post('/record',function(req,res){
  const newRecord = req.body;
  const blockIndex = patient.addToPendingRecord(newRecord);
  res.json({note: `Record will be added to the block ${blockIndex}.`});
});

app.post('/record/broadcast' , function(req, res){
  const newRecord = patient.createNewRecord(req.body.patientName , req.body.docName, req.body.comment);
  patient.addToPendingRecord(newRecord);
  const requestPromises = [];
  patient.networkNodes.forEach(networkNodesUrl => {
    const requestOptions = {
      uri: networkNodes + '/record',
      method: 'POST',
      body: newRecord,
      json: true
    };

    requestPromises.push(rp(requestOptions));
  });
  promise.all(requestPromises)
  .them(data => {
    res.json({ note: `Record created and broadcast succesfully.`});
  });
});

app.get('/mine',function(req,res){
  const lastBlock = patient.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    record: patient.pendingRecords(),
    index: lastBlock['index'] + 1
  };
  const nonce = patient.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = patient.hashBlock();

  const newBlock = patient.createNewBlock(nonce , previousBlockHash, blockHash);
  const requestPromises =[];
patient.networkNode.forEach(networkNodesUrl=>{
  const requestOptions ={
    uri: networkNodesUrl +'/receive-new-block',
    method: 'POST',
    body: {newBlock:newBlock},
    json:true
  };
requestPromises.push(rp(requestOptions));
});
promise.all(requestPromises)
.then(data =>{
  const requestOptions = {
    uri: patient.currentNodeUrl + '/record/broadcast',
    method: 'POST',
    body: {
      patientName: "",
      docName: "00",
      comment: ""
    },
    json:true
  };
  return rp(requestOption);
})
.then(data => {
  res.json({
    note:"new block mined successfully",
    block:newBlock
    });
  });
});
app.post('/receive-new-block' , function(req, res){
  const newBlock = req.body.newBlock;
  const lastBlock = patient.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if (correctHash && correctIndex) {
    patient.chain.push(newBlock);
    patient.pendingRecord = [];
    res.json({
      note: 'New block receive and accepted.' ,
      newBlock: newBlock
    });
  } else {
    res.json({
      note: `New block rejected`,
      newBlock: newBlock
    });
  }
});
//register a node and broadcast the network
app.post('/register-and-broadcast-node' , function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  if (patient.networkNodes.indexOf(newNodeUrl) == -1) patient.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];
  patient.networkNodes.forEach(networkNodesUrl => {
  const requestOption={
  url:networkNodesUrl +'/register-node',
  method: 'Post',
  body:{newNodeUrl: newNodeUrl},
  json: true
  };
    regNodesPromises.push(rp(requestOption));
  });

promise.all(regNodesPromises)
.then(data=> {
  const bulkRegistrationOption={
    url:newNodeUrl+ '/register-nodes-bulk',
    method:'POST',
    body: {alNetworkNodes:[...patient.networkNodes,patient.currentNodeUrl]},
      json:true
  };
  return rp(bulkRegistrationOption);
})
.then(data=>{
  res.json({note: `New node registered with network succesfully.`});
  });
});

//register a node to the network
app.post('/register-node' , function(req, res) {
const newNodeUrl= req.body.newNodeUrl;
const nodeNotAlreadyPresent = patient.networkNodes.indexOf(newNodeUrl) == -1;
const notCurrentNode = patient.currentNodeUrl !== newNodeUrl;

if (nodeNotAlreadyPresent && notCurrentNode) patient.networkNodes.push(newNodeUrl);
res.json({note: `New node registered succesfully `});
});

//register multiple nodes at once
app.post('/register-nodes-bulk'  , function(req, res) {
 const allNetworkNodes = req.body.allNetworkNodes;
 allNetworkNodes.forEach(networkNodesUrl => {
   const nodeNotAlreadyPresent = patient.networkNodes.indexOf(networkNodesUrl) == -1;
   const notCurrentNode = patient.currentNodeUrl != networkNodesUrl;
   if(nodeNotAlreadyPresent && notCurrentNode) patient.networkNodes.push(networkNodesUrl);
 });

 res.json({note: `Bulk registration succesfully`});
});

app.listen(port , function(){
  console.log(`listening to port ${port}...`)
});
