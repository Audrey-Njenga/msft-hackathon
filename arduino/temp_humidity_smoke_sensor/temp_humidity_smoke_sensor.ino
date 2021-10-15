/*
----------------------------------- TEMPERATURE, HUMIDITY & SMOKE MODULE -----------------------------------
This sketch contains code for collecting the data from a MQ2 Smoke sensor and a DHT11 sensor.
The sensors have been attached to a wemos d1 mini esp8266 microcontroller.
*/
#include "DHTesp.h"
#include "MQ135.h"

DHTesp dht;
#define smokeSensor A0
int airQuality = 0;

void setup() {
  Serial.begin(115200);
  dht.setup(D5, DHTesp::DHT11);
  pinMode(smokeSensor, INPUT);
}

void loop() {
  readSmokeSensor();
  readTemperatureAndHumiditySensors();
}
/*
 * This method is used to get the Temperature and Humidity from the sensor
 * @return void
 */
void readTemperatureAndHumiditySensors(){
  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("%");
  Serial.println();
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print("°C");
  Serial.println();
  delay(2000);
}

/*
 * This method is used to get the air quality from the smoke sensor
 * @return void
 */
void readSmokeSensor() {
  airQuality = analogRead(smokeSensor);
  if(isnan(airQuality)){
    Serial.println("Failed to read from MQ2 Air Quality Sensor"); 
   }
  Serial.print("Air Quality: ");
  Serial.print(airQuality);
  Serial.println();
  delay(2000);
}
