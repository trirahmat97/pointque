const dataIn = [{
    "_id": "1",
    "pointReceiver": 12,
    "total": 9
  },
  {
    "_id": "2",
    "pointReceiver": 4,
    "total": 1
  },
  {
    "_id": "3",
    "pointReceiver": 3,
    "total": 1
  }
  // {
  //   "_id": "2675372379",
  //   "pointReceiver": 9,
  //   "total": 3
  // },
];

const dataOut = [{
    "_id": "1",
    "pointReceiver": 12,
    "total": 9
  },
  {
    "_id": "4",
    "pointReceiver": 4,
    "total": 1
  },
  {
    "_id": "3",
    "pointReceiver": -9,
    "total": 3
  }
];

const dataTampung = [];
const dataTampung2 = [];
const dataTampung3 = [];

for (let i = 0; i < dataIn.length; i++) {
  for (let j = 0; j < dataOut.length; j++) {
    if (dataIn[i]._id == dataOut[j]._id) {
      dataIn[i].pointReceiver = dataIn[i].pointReceiver + dataOut[i].pointReceiver;
      dataTampung.push(dataIn[i]);
    } else {
      dataTampung.push(dataIn[i]);
    }
  }
}


// console.log(dataTampung);
const uniqueSet = new Set(dataTampung);
const daftraPemenangNasabah = [...uniqueSet];
// console.log(daftraPemenangNasabah);


for (let z = 0; z < dataOut.length; z++) {
  for (let k = 0; k < daftraPemenangNasabah.length; k++) {
    if (daftraPemenangNasabah[k]._id == dataOut[z]._id) {
      dataTampung2.push(dataOut[z]);
    }
  }
}

for (let m = 0; m < dataTampung2.length; m++) {
  console.log(dataTampung2[m]._id);
}

const uniqueSet2 = new Set(dataTampung2);
const daftraPemenangNasabah2 = [...uniqueSet2];
// console.log(daftraPemenangNasabah2);

// console.log(dataTampung2);
