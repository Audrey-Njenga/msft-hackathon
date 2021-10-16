import serial
import location as location
import smtplib
import time 

password = input("Type your password and press enter: ")

sender = ''
receivers = ['']

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(sender, password)
print("Login success")

'''
    This method gets the smoke sensor values from the MQ2 smoke sensor
'''
def get_smoke_sensor_value():
    ser = serial.Serial('/dev/ttyUSB0',
                        baudrate=115200)

    return ser.readline()[0]

def sendEmail(sender, receivers, message):
    try:
        server.sendmail(sender, receivers, message)         
        print("Successfully sent email")
    except smtplib.SMTPException:
        print("Error: unable to send email")


while True:
    smoke_sensor_val = get_smoke_sensor_value()
    gps = location.get_gps_coordinates()
    if(smoke_sensor_val > 100):
        message = """
        Subject: Smoke Detected in Forest!

        Smoke detected at gps coordinates {val}
        """.format(val=gps)
        sendEmail(sender, receivers, message)
    time.sleep(5)
    
