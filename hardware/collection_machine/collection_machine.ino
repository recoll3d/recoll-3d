/* WebSocketClientSocketIOack.ino */

#include "env.h"
#include "global_variables.h"
#include "functions.h"

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <WebSocketsClient.h>

WiFiMulti WiFiMulti;

// const char *ssid = WIFI_SSID;
// const char *password = WIFI_PASSWORD;

void setup()
{
  USE_SERIAL.begin(115200);

  // Serial.setDebugOutput(true);
  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  pinMode(BLUE_LED, OUTPUT);
  pinMode(GIFT_RELEASE_RELAY, OUTPUT);

  pinMode(HIGH_START_KEY, INPUT_PULLUP);
  pinMode(HIGH_END_KEY, INPUT_PULLUP);
  pinMode(MID_START_KEY, INPUT_PULLUP);
  pinMode(MID_END_KEY, INPUT_PULLUP);
  pinMode(LOW_START_KEY, INPUT_PULLUP);
  pinMode(LOW_END_KEY, INPUT_PULLUP);

  pinMode(BUTTON_PIN, INPUT);

  for (uint8_t t = 4; t > 0; t--)
  {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  WiFiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);

  // WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED)
  {
    delay(100);
  }

  String ip = WiFi.localIP().toString();
  USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

  // Obter o endereço IPv4
  IPAddress localIP = WiFi.localIP();
  localIP[3]--;

  Serial.print("Endereço IPv4: ");
  Serial.println(localIP);

  // server address, port and URL
  socketIO.begin(localIP.toString(), 3000, "/socket.io/?EIO=4");
  // socketIO.begin("10.122.177.50", 3000, "/socket.io/?EIO=4");

  // event handler
  socketIO.onEvent(socketIOEvent);
}

void loop()
{
  socketIO.loop();

  if (socketIO.isConnected())
  {
    // sendEventName();
    sendMacAddress();
    handleRecycling();
  }
}