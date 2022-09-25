var array = [
  { Id: "001", qty: 1 }, 
  { Id: "002", qty: 2 }, 
  { Id: "001", qty: 2 }, 
  { Id: "003", qty: 4 }
];

var result = [];
array.reduce(function(res, value) {
    console.log('res: '+ JSON.stringify(res))
      console.log('val: '+ JSON.stringify(value))
      console.log('ini: '+ JSON.stringify(res[value.userId]));
  if (!res[value.Id]) {
    res[value.Id] = { Id: value.Id, qty: 0 };
    result.push(res[value.Id])
  }
  res[value.Id].qty += value.qty;
  return res;
}, {});

console.log(result)