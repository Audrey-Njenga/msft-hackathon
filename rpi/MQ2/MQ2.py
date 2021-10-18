import serial
import smtplib
import time
import uuid
import json
from azure.iot.device import IoTHubDeviceClient, Message

password = ""
sender = ''
receivers = ['']
SMOKE_SENSOR_THRESHOLD = 100

azure_connection_string = ""
MSG_TXT = '{{"messageId":{messageId}, "deviceId": "RasPiTemp", "C0Value": {val}}}'

def mail_server_init():
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender, password)
    print("Login success")
    return server

def get_gps_coordinates():
    f = open("/home/pi/Desktop/projects/msft-hackathon/rpi/location/location.txt")
    return f.read()

def iothub_client_init():
    client = IoTHubDeviceClient.create_from_connection_string(azure_connection_string)
    return client

'''
    This method gets the smoke sensor values from the MQ2 smoke sensor
'''
def get_smoke_sensor_value():
    ser = serial.Serial('/dev/ttyUSB0',
                        baudrate=115200)
    return ser.readline()[0]

def sendEmail(sender, receivers, message):
    try:
        server = mail_server_init()
        server.sendmail(sender, receivers, message)         
        print("Successfully sent email")
    except smtplib.SMTPException:
        print("Error: unable to send email")

def post_smoke_sensor_value_to_azure_iot(smoke_sensor_val):
    try:
        client = iothub_client_init()
        formatted_message = MSG_TXT.format(messageId=uuid.uuid4(),val=smoke_sensor_val)
        message = Message(formatted_message)
        print("Sending Message: {}".format(message))
        client.send_message(message)
        print("Message Successfully sent!")
    except:
        print("An Error ocurred while sending data to iot hub")

while True:
    smoke_sensor_val = get_smoke_sensor_value()
    print(smoke_sensor_val)
    gps = get_gps_coordinates()
    jsonGPS = json.loads(gps)
    lat = str(jsonGPS['lat'])
    lng = str(jsonGPS['lng'])
    location = "https://www.bing.com/maps?q={lat}%2C+{lng}".format(lat=lat, lng=lng)
    post_smoke_sensor_value_to_azure_iot(smoke_sensor_val)
    if(smoke_sensor_val > SMOKE_SENSOR_THRESHOLD):
        message = """
        Subject: Smoke Detected in Forest!

        Smoke detected at gps coordinates {location}
        """.format(location=location)
        print(message)
        sendEmail(sender, receivers, message)
    time.sleep(6000) # wait for 10 minutes before next reading
