#include <MessageCodec.h>
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <string.h>
#include <cstdlib>
#include <ctime>

#define WSS_LED_PIN 2
#define PUMP_PIN 5
#define DHT11_PIN 4
#define SOILSENSOR_PIN 34

const char *wifi_ssid = "KryptedNetwork";
const char *wifi_password = "0106@dca*";

WebSocketsClient webSocket;

bool send_sensor_data = false;
SensorData sensor_data;

void togglePump(bool on) {
  if (on) {
    digitalWrite(PUMP_PIN, HIGH);
  } else {
    digitalWrite(PUMP_PIN, LOW);
  }
}

void handleMessages(uint8_t *payload) {
  Command cmd;
  const char *msg = (const char *)payload;

  if (decode_cmd(msg, &cmd)) {
    if (strcmp(cmd.type, "command") == 0) {
      if(strcmp(cmd.payload.command, "pump-on") == 0) {
        togglePump(true);
        webSocket.sendTXT(encode_cmd_res(true));
      } else if (strcmp(cmd.payload.command, "pump-off") == 0) {
        togglePump(false);
        webSocket.sendTXT(encode_cmd_res(true));
      } else {
        Serial.println("Invalid Command!");
        webSocket.sendTXT(encode_cmd_res(false));
      }
    }

    free_command(&cmd);
  } else {
    Serial.println("Failed to decode WebSocket command.");
  }
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      Serial.println("WSS connected");
      digitalWrite(WSS_LED_PIN, HIGH);
      webSocket.sendTXT(INIT_MESSAGE);
      send_sensor_data = true;
      break;
    case WStype_TEXT:
      handleMessages(payload);
      break;
    case WStype_DISCONNECTED:
      Serial.println("Disconnected");
      digitalWrite(WSS_LED_PIN, LOW);
      send_sensor_data = true;
      break;
  }
}

void setup() {
  pinMode(WSS_LED_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(WSS_LED_PIN, LOW);
  digitalWrite(PUMP_PIN, LOW);

  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".*");
  }
  Serial.println("\nWiFi connected");

  webSocket.beginSSL("irrigo-ptjm.onrender.com", 443, "/");
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  srand(time(0));
  sensor_data.temperature = rand() % 101;
  sensor_data.humidity = rand() % 101;
  sensor_data.soilMoisture = rand() % 101;

  if(send_sensor_data) {
    webSocket.sendTXT(encode_sensor_data(&sensor_data));
    Serial.println(encode_sensor_data(&sensor_data));
    delay(1500);
  }

  webSocket.loop();
}
