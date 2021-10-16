import serial
import time
import string
import pynmea2
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
		coordinates = {
			"lat": str(lat),
			"lng": str(lng)
		}
		print(coordinates)
		return coordinates