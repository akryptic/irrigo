import { notify } from "../notify.js";
import { isPumpOn } from "./shared.js";

/**
 *
 * @param {import('../../home.js').PumpSettings} payload
 * @returns
 */
export function togglePump(payload) {
  // TODO: Actual logic to send the pump signal to the board

  // Fakes the pump turning on and off with payload
  if (isPumpOn.value) {
    setTimeout(() => {
      isPumpOn.value = false;
    }, 1200);
    return;
  }

  let chance = Math.floor(Math.random() * 100);
  notify.inform(`Pump is being turned on.`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (chance > 30) {
        notify.success(
          `Pump has been turned on in ${payload.irrigationMode} mode. For ${payload.duration}.`
        );
        isPumpOn.value = true;
        resolve();
      } else {
        notify.error(`Pump could not be turned on.`);
        isPumpOn.value = false;
        reject();
      }
    }, 3000);
  });
}
