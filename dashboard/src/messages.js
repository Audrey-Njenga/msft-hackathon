const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

  // connection string to your Service Bus namespace
  const connectionString = "Endpoint=sb://forest-guard-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=gWFDGWRgN73QQrxv5AINqcZbokuyvyC/VSqetcT3fb8="

  // name of the queue
  const queueName = "forest-guard-queue"

  const alerts = async() => {
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(connectionString);

    // createReceiver() can also be used to create a receiver for a subscription.
    const receiver = sbClient.createReceiver(queueName);
    
   
    const myMessages = await receiver.receiveMessages(10);
    console.log(myMessages);

    // function to handle messages
    const myMessageHandler = async (messageReceived) => {
        const messages = [
            { body: "Albert Einstein" },
            { body: "Werner Heisenberg" },
            { body: "Marie Curie" },
            { body: "Steven Hawking" },
            { body: "Isaac Newton" },
            { body: "Niels Bohr" },
            { body: "Michael Faraday" },
            { body: "Galileo Galilei" },
            { body: "Johannes Kepler" },
            { body: "Nikolaus Kopernikus" }
         ];
        messages.push(messageReceived.body);
    //   console.log(messageReceived.body);
        console.log(messages);
        return messages;
    };

    // function to handle any errors
    const myErrorHandler = async (error) => {
      console.log(error);
    };

    // subscribe and specify the message and error handlers
    receiver.subscribe({
      processMessage: myMessageHandler,
      processError: myErrorHandler
    });

    // Waiting long enough before closing the sender to send messages
    await delay(20000);

    await receiver.close();
    await sbClient.close();
  }
//   call the main function
export default alerts;

