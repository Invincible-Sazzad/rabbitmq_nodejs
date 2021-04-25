var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if(args.length==0){
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}

amqp.connect('amqp://localhost', function(err, connection) {
  if (err) {
    throw err;
  }

  connection.createChannel(function(err1, channel) {
    if (err1) {
      throw err1;
    }

    channel.assertQueue('', {
      exclusive: true
    }, function(err2, q) {
      if (err2) {
        throw err2;
      }
      var correlationId = generateUuid();
      var num = parseInt(args[0]);

      console.log(' [x] Requesting fib(%d)', num);

      channel.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == correlationId) {
          console.log(' [.] Got %s', msg.content.toString());
          setTimeout(function() {
            connection.close();
            process.exit(0)
          }, 500);
        }
      }, {
        noAck: true
      });

      channel.sendToQueue('rpc_queue',
        Buffer.from(num.toString()),{
          correlationId: correlationId,
          replyTo: q.queue });
    });
  });
});

function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}