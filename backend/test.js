// const point = [{
//     id: 1,
//     delimeter: 50000,
//     totalPoint: 1,
//     sign: '>='
//   },
//   {
//     id: 2,
//     delimeter: 1000000,
//     totalPoint: 2,
//     sign: '<='
//   },
//   {
//     id: 3,
//     delimeter: 5000000,
//     totalPoint: 3,
//     sign: '>='
//   },
//   {
//     id: 4,
//     delimeter: 10000000,
//     totalPoint: 4,
//     sign: '<='
//   },
// ];

// const nasabah = {
//   name: 'tri rahmat aribowo',
//   type: 'D',
//   amount: 50000
// }


// const amount = nasabah.amount;
// // console.log(amount);

// let da = 0;

// // console.log(point[0])

// for (let i = 1; i <= point.length; i++) {
//   // if ((amount + '' + point[i - 1].sign + '' + point[i - 1].amount) && (amount + '' + point[i - 1].sign + '' + point[i + 1].amount)) {
//   //   // return console(point[i].totalPoint);
//   //   da = point[i - 1].totalPoint;
//   // }
//   //   console.log(amount + ' ' + point[i + 1].sign + ' ' + point[i + 1].delimeter)
//   //   console.log(point[i - 1].sign);
//   //   console.log([i - 1]);
//   //   console.log(i - 1);
// }

// console.log(Math.floor(100000000 + Math.random() * 900000000));

// // console.log(da);

//2019-10-07T09:29:46.550Z
//2019-10-07T04:33:55.512Z
// var aa = new Date();
// var bb = aa.addMonths(1);
// var bb = aa.setMonth(aa.getMonth() + 8);
// var tomorrowDate = moment(new Date()).add(1, 'days').format("YYYY-MM-DD");
// const date = new Date();
// console.log(date);
// console.log(aa);
// console.log(bb);
// console.log(tomorrowDate);
var month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

// var date = new Date("2019-12-01T00:00:00.000Z");
// var hasilDate = new Date(new Date(date).setMonth(date.getMonth() + 1));

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

// console.log(month[date.getMonth()]);
console.log(date);
console.log(firstDay);
console.log(lastDay);
// console.log(hasilDate);

// var date2 = new Date(new Date(date).setMonth(date.getMonth() + 1));

// console.log(date.getFullYear(), date.getMonth(), date.getDate());
// console.log(date2);

// 
//config
// var tahun1 = date.getFullYear() + "-" + date.getMonth();
// var bulan = date.getMonth();
// var tahun2 =


// console.log(hasilDate1);
