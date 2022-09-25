const DynamoService = require('../services/dynamo.service');

module.exports.handler = event => {
  
  const { Records = [] } = event;
  // Records.forEach(async item => {
  //   try {
  //     const tableName = process.env.orderTableName;
  //     const order = JSON.parse(item.body);
  //     await DynamoService.write(order, tableName);
  //   } catch (e) {
  //     console.log('Error saving the data');
  //     console.log(e);
  //   }
  // });
  const result = []
  if (Records.length > 1) {
    console.log('length:'+Records.length)
    const records = []
    Records.forEach(item => {
      console.log('idMessage:' + item.messageId)
      try {
        const order = JSON.parse(item.body);
        records.push(order);
      } catch (e) {
        console.log('Error saving the data');
        console.log(e);
      }
    });
    records.reduce(function(res, value) {
      if (!res[value.id]) {
        res[value.id] = { id: value.id, reduceLimit: 0 };
        result.push(res[value.id])
      }
      res[value.id].reduceLimit += value.reduceLimit;
      return res;
    }, {});
  } else if(Records.length === 1) {
    console.log('length:'+Records.length)
    Records.forEach(item => {
      console.log('idMessage:' + item.messageId)
      try {
        const order = JSON.parse(item.body);
        result.push(order);
      } catch (e) {
        console.log('Error saving the data');
        console.log(e);
      }
    });
  }
  console.log('result:' + JSON.stringify(result));
  result.forEach(async data => {
    try {
      const tableName = process.env.orderTableName;
      const order = {
        id: data.id,
      };
      const { Item } = await DynamoService.read(order, tableName);
      const finalOrder = {
        id: Item.id,
        name: Item.name,
        limit: Item.limit - data.reduceLimit
      }
      console.log('proses pengurangan, current data: ' + JSON.stringify(finalOrder))
      await DynamoService.write(finalOrder, tableName);
    } catch (e) {
      console.log('Error saving the data');
      console.log(e);
    }
  })
}
