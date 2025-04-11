#pragma once
#include <ArduinoJson.h>

struct NestedData {
    int sensorId;
    float value;

    void toJson(JsonDocument& doc) const {
        doc["sensorId"] = sensorId;
        doc["value"] = value;
    }

    void fromJson(const JsonDocument& doc) {
        sensorId = doc["sensorId"] | -1;
        value = doc["value"] | 0.0f;
    }
};

struct MyData {
    String deviceId;
    bool pumpOn;
    NestedData sensor;

    void toJson(JsonDocument& doc) const {
        doc["deviceId"] = deviceId;
        doc["pumpOn"] = pumpOn;

        JsonObject nested = doc.createNestedObject("sensor");
        sensor.toJson(nested);
    }

    void fromJson(const JsonDocument& doc) {
        deviceId = doc["deviceId"] | "";
        pumpOn = doc["pumpOn"] | false;

        if (doc.containsKey("sensor")) {
            sensor.fromJson(doc["sensor"]);
        }
    }
};
