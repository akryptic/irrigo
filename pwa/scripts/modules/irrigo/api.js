import { $signal, Signal } from "../signal.js";
import { notify } from "../notify.js";
import { sendCommand } from "../ws.js";

// pumpController.ts
let _resolve;
let _reject;

let pumpPromise = null;
export const isPumpOn = $signal(false);

export function createPumpPromise() {
  if (!pumpPromise) {
    pumpPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;

      if (isPumpOn.value) {
        sendCommand("pump-off");
      } else {
        sendCommand("pump-on");
      }
    });
  }

  return pumpPromise;
}

export function resolvePump(result) {
  if (_resolve) {
    if (isPumpOn.value) {
      isPumpOn.value = false;
      notify.inform("Pump turned off successfully");
    } else {
      isPumpOn.value = true;
      notify.inform("Pump turned on successfully");
    }
    _resolve(result);
    pumpPromise = null;
  }
}

export function rejectPump(reason) {
  if (_reject) {
    isPumpOn.value = isPumpOn.value;
    notify.error("Board responded with a error!");
    _reject(reason);
    pumpPromise = null;
  }
}

/**
 * @typedef {Object} SensorData
 * @property {number} temperature
 * @property {number} humidity
 * @property {number} soilMoisture
 */

/**
 * @type {Signal<SensorData>}
 */

export const sensorData = $signal({
  temperature: 0,
  humidity: 0,
  soilMoisture: 0,
});

/**
 *
 * @param {SensorData} data
 */
export function updateSensorData(data) {
  sensorData.value = data;
}
