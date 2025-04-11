import { updateSensorData } from "./irrigo/api.js";
import { rejectPump, resolvePump } from "./irrigo/api.js";
import { notify } from "./notify.js";
import { dataUtils } from "./utils.js";
const wss = new WebSocket("wss://irrigo-ptjm.onrender.com");

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
      console.log(data.payload);

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

    case "board-connection-update":
      console.log(data.payload);
      if (data.payload.connected) {
        notify.success("Board connected");
      } else {
        notify.error("Board disconnected!");
        updateSensorData({
          humidity: 0,
          temperature: 0,
          soilMoisture: 0,
        }); // Clear sensor data
      }
      break;
    default:
      console.log("Unknown message type");
      break;
  }
};

/**
 *
 * @param {"pump-on"|"pump-off"} command
 */
export function sendCommand(command) {
  console.log(dataUtils.encode({ type: "command", payload: { command } }));

  wss.send(
    dataUtils.encode({
      role: "web-app",
      type: "command",
      payload: { command },
    })
  );
  notify.success(`Command sent: ${command}`);
}
