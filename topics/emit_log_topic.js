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
        var exchange = 'topic_logs';
        var args = process.argv.slice(2);
        var key = (args.length>0) ? args[0] : 'anonymous.info';
        var message = args.slice(1).join(' ') || 'Hello world!';
        
        /*
        * In this case, RabbitMQ creates a randomly generated queue name
        */

        //creating a fanout exchange
        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        // publish messageto the 'topic' exchange
        channel.publish(exchange, key, Buffer.from(message));

        console.log(" [x] sent %s: '%s'", key, message); 
    });

    //close the connection and exit
    setTimeout(function(){
        connection.close();
        process.exit(0);
    }, 500);
});