// import the library
var amqp = require('amqplib/callback_api');


var args = process.argv.slice(2);

if(args.length==0){
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

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

        //Here, after establishing the connection we declared the exchange. This step is 
        // necessary as publishing to a non-existing exchange is forbidden.
        // declare an exchange
        var exchange = 'topic_logs';

        //creating a fanout exchange
        channel.assertExchange(exchange, 'topic', {
            durable: false
        });

        /*
        * In this case, RabbitMQ creates a randomly generated queue name
        */

        channel.assertQueue('', {
            exclusive: true
        }, function(err2, q){
            if(err2){
                throw err2;
            }

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

            args.forEach(key => {
                channel.bindQueue(q.queue, exchange, key);
            });
            

            channel.consume(q.queue, function(msg){
                if(msg.content){
                    console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                }
            }, {
                noAck: true
            });
        });
    });
});