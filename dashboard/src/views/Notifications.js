/*!

=========================================================
* Now UI Dashboard React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// reactstrap components
import {
  Alert,
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Row,
  Col,
  Button,
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function Notifications() {

  const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

  // connection string to your Service Bus namespace
  const connectionString = "Endpoint=sb://forestguard.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=AgfetwnfPkIqmZR4PDaXXGLdtR4N9BfI6cX33TsIHTY="

  // name of the queue
  const queueName = "forestqueue"

  const [temperature, setTemperature] = React.useState([]);


  React.useEffect(() => {
  async function main() {
    // create a Service Bus client using the connection string to the Service Bus namespace
    const sbClient = new ServiceBusClient(connectionString);

    // createReceiver() can also be used to create a receiver for a subscription.
    const receiver = sbClient.createReceiver(queueName);

    // const myMessages = await receiver.receiveMessages(10);
    // return myMessages;
    
    //function to handle messages
    const myMessageHandler = async (messageReceived) => {
      setTemperature([...temperature,messageReceived.body.temperature]); 
      console.log(messageReceived.body.temperature);
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

  // call the main function
  main().catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
  });
}
);

  const notificationAlert = React.useRef();
  const notify = (place) => {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            Welcome to <b>Now UI Dashboard React</b> - a beautiful freebie for
            every web developer.
          </div>
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7,
    };
    notificationAlert.current.notificationAlert(options);
  };
  return (
    <>
      <PanelHeader
        content={
          <div className="header text-center">
            <h2 className="title">Notifications</h2>
          </div>
        }
      />
      <div className="content">
        <NotificationAlert ref={notificationAlert} />
        <Row>
          <Col md={12} xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Notifications</CardTitle>
              </CardHeader>
              <CardBody>
                { temperature.length > 0 ? 
                <Alert color="warning" isOpen={true} toggle={() => {}}>
                  <b> Warning - The temperture is too high</b>
                  <span>   
                    {temperature}
                  </span>
                </Alert>: <p>No Alerts</p>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Notifications;
