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

        // declare a queue and publish a message to the queue
        var queue = 'hello';
        var message = 'Hello world!';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(message));

        console.log(' [x] sent %s', message); //The message content is a byte array, so you can encode whatever you like there.
    });

    //close the connection and exit
    setTimeout(function(){
        connection.close();
        process.exit(0);
    }, 500);
});