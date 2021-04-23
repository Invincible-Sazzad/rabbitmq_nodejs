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

        //Here, after establishing the connection we declared the exchange. This step is necessary as publishing to a non-existing exchange is forbidden.
        // declare an exchange
        var exchange = 'logs';
        var message = process.argv.slice(2).join(' ') || 'Hello world!';

        //creating a fanout exchange
        channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        // publish messageto the 'log' exchange
        channel.publish(exchange, '', Buffer.from(message));

        console.log(' [x] sent %s', message); 
    });

    //close the connection and exit
    setTimeout(function(){
        connection.close();
        process.exit(0);
    }, 500);
});