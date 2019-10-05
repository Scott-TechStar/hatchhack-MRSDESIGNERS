const Blockchain = require('./blockchain');
const patient = new Blockchain();


const previousBlockHash = 'KJKHJKHSDFHJHJHSJK';
const currentBlockData = [
  {
    patientName:'ssdjfkaskfhjkadsf',
    docName: 'jkajfjkasdhjfk',
    comment: 'YUIWKJHJKAHJKHSB'
  },
  {
    patientName: 'sadsfkjdfkasfklsdf',
    docName: 'jkajfjkasdhjfk',
    comment: 'YUIWKJHJKAHJKHSB'
  },
  {
    patientName:'ajksdfhjkashdjkfhjkaslhf',
    docName: 'jkajfjkasdhjfk',
    comment: 'YUIWKJHJKAHJKHSB'
  },
];

console.log(patient);
