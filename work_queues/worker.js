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
        var queue = 'mytask_queue';

        channel.assertQueue(queue, {
            durable: true
        });

        //channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // Consume the message when RabbitMQ pushes the message asynchronously
        channel.consume(queue, function(msg){
            var secs = msg.content.toString().split('.').length-1;
            console.log(" [x] received %s", msg.content.toString());

            setTimeout(function(){

                console.log(" [x] done.");
                channel.ack(msg);

            }, secs * 1000);
        }, {
            // automatic acknowledgment mode
            //noAck: true

            // manual acknowledgment mode
            noAck: false
        });
    });
});