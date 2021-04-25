var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, connection) {
  if (err) {
    throw err;
  }

  connection.createChannel(function(err1, channel) {
    if (err1) {
      throw err1;
    }

    var queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.prefetch(1); //spread the load equally over multiple servers

    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      var n = parseInt(msg.content.toString());

      console.log(" [.] fib(%d)", n);

      var generatedFib = fibonacci(n);

      // Here, 'replyTo' indicates a callback queue
      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(generatedFib.toString()), {
          correlationId: msg.properties.correlationId
        });

      channel.ack(msg);
    });
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}