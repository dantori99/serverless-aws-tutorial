const { v4: uuid } = require('uuid');
const DynamoService = require('../services/dynamo.service');
const ApiResponse = require('../util/apiResponse');
const sqsService = require('../services/sqs.service');
const tableName = process.env.orderTableName;

module.exports.createUser = async (event, ctx, cb) => {
  const { body = {} } = event;

  const { name = '' } = JSON.parse(body);
  const id = uuid();

  const order = {
    id,
    name,
    limit: 100
  };

  try {
    await DynamoService.write(order, tableName);
    return cb(null, ApiResponse.ok({ message: 'success', id }));
  } catch (e) {
    return cb(
      null,
      ApiResponse.serverError({ message: 'Failed to create order' })
    );
  }
}

module.exports.handler = async (event, ctx, cb) => {
  const numSend = 10;
  const { body = {} } = event;

  const { id, reduceLimit } = JSON.parse(body);

  const order = {
    id,
    reduceLimit
  };

  try {
    const queueURL = process.env.ordersQueue;
    for (let i = 0; i < numSend; i++) {
      await sqsService.sendMessage(queueURL, JSON.stringify(order));
      cb(null, ApiResponse.ok({ message: 'success', id }));
    }
  } catch (e) {
    console.log(e)
    return cb(
      null,
      ApiResponse.serverError({ message: 'Failed to create order' })
    );
  }
};
