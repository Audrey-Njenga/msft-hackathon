from os import read
import serial

"""
    This method is used to read the smoke detector values
    from the serial port
"""
def read_smoke_Detector():
    ser = serial.Serial('/dev/ttyUSB0', baudrate=115200)
    data = ser.read(10)
    print(data[0])

read_smoke_Detector()