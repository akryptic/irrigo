#pragma once
#include <ArduinoJson.h>

// This class provides utilities to serialize/deserialize objects using ArduinoJson.
class DataUtils {
public:
    // Convert an object to JSON string
    template <typename T>
    static String encode(const T& obj) {
        StaticJsonDocument<512> doc;
        obj.toJson(doc); // require user to define `toJson(JsonDocument&)`
        String output;
        serializeJson(doc, output);
        return output;
    }

    // Parse JSON string into an object
    template <typename T>
    static bool decode(const String& jsonString, T& obj) {
        StaticJsonDocument<512> doc;
        DeserializationError error = deserializeJson(doc, jsonString);
        if (error) {
            Serial.print("JSON parse error: ");
            Serial.println(error.f_str());
            return false;
        }
        obj.fromJson(doc); // require user to define `fromJson(JsonDocument&)`
        return true;
    }
};
