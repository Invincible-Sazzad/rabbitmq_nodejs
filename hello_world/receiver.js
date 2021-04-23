// import the library
var amqp = require('amqplib/callback_api');

// connect to the RabbitMQ server
amqp.connect('amqp://localhost', function(err, connection){
    
    if(err){
        throw err;
    }
    // create a channel, which is where most of the API for getting things done resides
    connection.createChannel(function(err1, channel){
        if(err1){
            throw err1;
        }

        // declare the queue from which we're going to consume
        var queue = 'hello';
        /*
        * we declare the queue here, as well. Because we might start the consumer/subscriber before the publisher, 
        * we want to make sure the queue exists before we try to consume messages from it.
        */

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // Consume the message when RabbitMQ pushes the message asynchronously
        channel.consume(queue, function(msg){
            console.log(" [x] received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});