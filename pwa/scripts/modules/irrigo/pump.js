import { notify } from "../notify.js";
import { sendCommand } from "../ws.js";
import { isPumpOn } from "./api.js";

// pumpController.ts
let _resolve;
let _reject;

let pumpPromise = null;

export function createPumpPromise(config) {
  if (!pumpPromise) {
    pumpPromise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;

      if (isPumpOn.value) {
        sendCommand("pump-off", config);
      } else {
        sendCommand("pump-on", config);
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
