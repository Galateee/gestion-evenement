const amqp = require('amqplib');

async function publishEvent() {
  const connection = await amqp.connect('amqp://user:password@localhost:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'events.exchange';
  const routingKey = 'event.created';
  
  await channel.assertExchange(exchange, 'topic', { durable: true });
  
  const event = {
    eventId: '123',
    eventType: 'EVENT_CREATED',
    timestamp: new Date(),
    data: {
      title: 'Test Event',
      description: 'Event de test'
    }
  };
  
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)));
  console.log('✅ Event published:', event);
  
  setTimeout(() => {
    connection.close();
  }, 500);
}

publishEvent();