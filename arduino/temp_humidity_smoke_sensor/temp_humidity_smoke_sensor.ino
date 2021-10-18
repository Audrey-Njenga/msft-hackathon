/*
----------------------------------- TEMPERATURE, HUMIDITY & SMOKE MODULE -----------------------------------
This sketch contains code for collecting the data from a MQ2 Smoke sensor and a DHT11 sensor.
The sensors have been attached to a wemos d1 mini esp8266 microcontroller.
*/
#define smokeSensor A0
int airQuality = 0;

void setup() {
  Serial.begin(115200);
}

void loop() {
  readSmokeSensor();
}

/*
 * This method gets the air quality from the smoke sensor
 * @return void
 */
void readSmokeSensor() {
  airQuality = analogRead(smokeSensor);
  if(isnan(airQuality)){
    Serial.println("Failed"); 
   }
  Serial.println(airQuality);
  delay(2000);
}