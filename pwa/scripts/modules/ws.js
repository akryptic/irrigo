import { updateSensorData } from "./irrigo/api.js";
import { rejectPump, resolvePump } from "./irrigo/pump.js";
import { notify } from "./notify.js";
import { dataUtils } from "./utils.js";
const wss = new WebSocket("ws://localhost:8080");

wss.onopen = () => {
  notify.success("Connected to the websockets server");
  wss.send(dataUtils.encode({ type: "init", role: "web-app" }));
};

wss.onclose = () => {
  notify.error("Disconnected from the websockets server");
};

wss.onmessage = (event) => {
  const data = dataUtils.decode(event.data);

  switch (data.type) {
    case "sensor_data":
      updateSensorData(data.payload);
      break;
    case "cmd-res":
      console.log(data.payload);

      if (data.payload.status) {
        resolvePump("Pump turned on/off successfully");
      } else {
        rejectPump("Cannot turn on/off the pump");
      }
      break;
  }
};

/**
 *
 * @param {"pump-on"|"pump-off"} command
 */
export function sendCommand(command, options) {
  console.log(
    dataUtils.encode({ type: "command", payload: { command, options } })
  );

  wss.send(
    dataUtils.encode({
      role: "web-app",
      type: "command",
      payload: { command, options },
    })
  );
  notify.success(`Command sent: ${command}`);
}
