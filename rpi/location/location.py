import serial
import time
import pynmea2
import uuid
from azure.iot.device import IoTHubDeviceClient, Message

azure_connection_string = ""
MSG_TXT = '{{"messageId":{messageId}, "deviceId": "RasPiTemp", "lat": {lat}, "lng": {lng}}}'

def iothub_client_init():
    client = IoTHubDeviceClient.create_from_connection_string(azure_connection_string)
    return client

'''
    This module is used to get the gps coordinates of the pi from the gps-module
'''
def get_gps_coordinates():
		port="/dev/ttyS0"
		ser=serial.Serial(port, baudrate=9600, timeout=0.5)
		dataout = pynmea2.NMEAStreamReader()
		newdata=ser.readline()

		if newdata[0:6] == "$GPRMC":
			newmsg=pynmea2.parse(newdata)
			lat=newmsg.latitude
			lng=newmsg.longitude
			gps = "Latitude=" + str(lat) + "and Longitude=" + str(lng)
			return {
				"lat": lat,
				"lng": lng
			}

def update_location(coordinates):
	f = open("/home/pi/Desktop/projects/msft-hackathon/rpi/location/location.txt","w")
	print(coordinates)
	f.write(str(coordinates))
	print("Updated location file")

def post_location_to_azure_iot(coordinates):
	if coordinates != None:
		try:
				client = iothub_client_init()
				formatted_message = MSG_TXT.format(messageId=uuid.uuid4(),lat=coordinates['lat'], lng=coordinates['lng'])
				message = Message(formatted_message)
				print("Sending Message: {}".format(message))
				client.send_message(message)
				print("Message Successfully sent!")
		except:
			print("An Error ocurred while sending data to iot hub")
	else:
		print("Error obtaining location")

while True:
	coordinates = get_gps_coordinates()
	update_location(coordinates)
	post_location_to_azure_iot(coordinates)
	time.sleep(600) # update location every 10 minutes
