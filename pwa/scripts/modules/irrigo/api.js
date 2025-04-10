import { notify } from "../notify.js";
import { $signal, Signal } from "../signal.js";
/**
 * @type {Signal<{temperature: number, humidity: number, soilMoisture: number}>}
 */

export const sensorData = $signal({
  temperature: 0,
  humidity: 0,
  soilMoisture: 0,
});
export const isPumpOn = $signal(false);

export function updateSensorData(data) {
  sensorData.value = data;
}

export {createPumpPromise} from './pump.js'
