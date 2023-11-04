/* WebSocketClientSocketIOack.ino */

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

#include "env.h"

WiFiMulti WiFiMulti;
SocketIOclient socketIO;

#define USE_SERIAL Serial
#define LED 2

const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {
      case sIOtype_DISCONNECT:
          USE_SERIAL.printf("[IOc] Disconnected!\n");
          break;
      case sIOtype_CONNECT: {
          USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

          // join default namespace (no auto join in Socket.IO V3)
          socketIO.send(sIOtype_CONNECT, "/");
          break;
      }
      case sIOtype_EVENT: {
        char * sptr = NULL;
        int id = strtol((char *)payload, &sptr, 10);
        
        USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);

        if (id) {
          payload = (uint8_t *)sptr;
        }

        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, payload, length);

        if (error) {
          USE_SERIAL.print(F("deserializeJson() failed: "));
          USE_SERIAL.println(error.c_str());
          return;
        }

        String eventName = doc[0];
        USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

        // Message Includes a ID for a ACK (callback)
        if (id) {
          // creat JSON message for Socket.IO (ack)
          DynamicJsonDocument docOut(1024);
          JsonArray array = docOut.to<JsonArray>();

          // add payload (parameters) for the ack (callback function)
          JsonObject param1 = array.createNestedObject();
          param1["now"] = millis();

          // JSON to String (serializion)
          String output;
          output += id;
          serializeJson(docOut, output);

          // Send event
          socketIO.send(sIOtype_ACK, output);
        }

        if (String(eventName) == "turn_on_led") {
            // Processar o valores recebido

            // Acessar o segundo elemento do array JSON
            JsonObject obj = doc[1];

            // Acessar a chave "on" no objeto JSON
            bool active = obj["on"];

            USE_SERIAL.printf("Ativo: %s\n", active ? "Verdadeiro" : "Falso");
            digitalWrite(LED, active);
        }
      }
      break;
      case sIOtype_ACK:
          USE_SERIAL.printf("[IOc] get ack: %u\n", length);
          break;
      case sIOtype_ERROR:
          USE_SERIAL.printf("[IOc] get error: %u\n", length);
          break;
      case sIOtype_BINARY_EVENT:
          USE_SERIAL.printf("[IOc] get binary: %u\n", length);
          break;
      case sIOtype_BINARY_ACK:
          USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
          break;
  }
}

unsigned long messageTimestamp = 0;

void sendEventName() {
  uint64_t now = millis();

  if (now - messageTimestamp > 2000) {
    messageTimestamp = now;

    // creat JSON message for Socket.IO (event)
    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    // add event name
    // Hint: socket.on('event_name', ....
    array.add("event_name");

    // add payload (parameters) for the event
    JsonObject param1 = array.createNestedObject();
    param1["now"] = (uint32_t) now;

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);

    // Print JSON for debugging
    USE_SERIAL.println(output);
  }
}

void sendMacAddress() {
  // creat JSON message for Socket.IO (ack)
  DynamicJsonDocument docOut(1024);
  JsonArray array = docOut.to<JsonArray>();

  array.add("register_point_collection");

  // add payload (parameters) for the ack (callback function)
  JsonObject param1 = array.createNestedObject();
  param1["mac_address"] = String(WiFi.macAddress());

  // JSON to String (serializion)
  String output;
  serializeJson(docOut, output);

  USE_SERIAL.println(output);

  // Envia o MAC para o servidor via Socket.IO
  socketIO.sendEVENT(output);

  delay(1000);
}

void setup() {
  USE_SERIAL.begin(115200);

  //Serial.setDebugOutput(true);
  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  pinMode(LED, OUTPUT);

  for (uint8_t t = 4; t > 0; t--) {
      USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
      USE_SERIAL.flush();
      delay(1000);
  }

  WiFiMulti.addAP(ssid, password);

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
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

  // event handler
  socketIO.onEvent(socketIOEvent);
}

void loop() {
  socketIO.loop();

  if (socketIO.isConnected()) {
    sendEventName();
    sendMacAddress();
  }
}