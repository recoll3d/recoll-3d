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

  // pinMode(LOW_MOTION_SENSOR, INPUT);
  // pinMode(MID_MOTION_SENSOR, INPUT);
  // pinMode(HIGH_MOTION_SENSOR, INPUT);
  // pinMode(MID_END_KEY, INPUT_PULLUP);
  // pinMode(LOW_START_KEY, INPUT_PULLUP);
  // pinMode(LOW_END_KEY, INPUT_PULLUP);

  // pinMode(BUTTON_PIN, INPUT);

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

  // Obter o endereço IPv4
  String localIP = WiFi.localIP().toString();
  // String ip = WiFi.localIP().toString();
  USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", localIP.c_str());

  if (localIP[3] >= 100)
  {
    localIP[3] -= 100;
  }
  else if (localIP[3] >= 10)
  {
    localIP[3] -= 10;
  }
  else
  {
    localIP[3]--;
  }

  Serial.print("Endereço IPv4: ");
  Serial.println(localIP);

  // server address, port and URL
  socketIO.begin(SOCKET_URL, 3333, "/socket.io/?EIO=4");
  // socketIO.begin(localIP, 3333, "/socket.io/?EIO=4");

  // event handler
  socketIO.onEvent(socketIOEvent);
}

bool eventoEnviado = false;

void loop()
{
  socketIO.loop();

  if (socketIO.isConnected())
  {
    // sendEventName();
    // sendMacAddress();
    handleRecycling();
    // delay(10);
    // if (!eventoEnviado)
    // {
    //   sendGetLed();

    //   eventoEnviado = true;
    // }
  }
}