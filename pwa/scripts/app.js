import {
  isPumpOn,
  sensorData,
  createPumpPromise,
} from "./modules/irrigo/api.js";
import { $signal } from "./modules/signal.js";
import { initTheme } from "./modules/theme.js";
import { determineLevel, pumpOptions } from "./modules/utils.js";
import "./modules/ws.js";

// Init functionalities
initTheme();

const option = $("<opt></opt>");

// Sensor Data Rendering
const temperatureCard = $("#temperature");
const humidityCard = $("#humidity");
const soilMoistureCard = $("#soil-moisture");

// Update the UI with sensor data
sensorData.subscribe((data) => {
  // Update temperature card
  const temperatureLevel = determineLevel(data.temperature, [12, 31]);
  temperatureCard
    .find("icon-box > i")
    .removeClass()
    .addClass(`icon-thermo-f${temperatureLevel} ${temperatureLevel}`);

  temperatureCard
    .find("p > val")
    .text(data.temperature)
    .removeClass()
    .addClass(temperatureLevel);
  temperatureCard
    .find("thumb")
    .width(`${data.temperature}%`)
    .removeClass()
    .addClass(`b${temperatureLevel}`);

  // Update humidity card
  const humidityLevel = determineLevel(data.humidity, [28, 70]);
  humidityCard
    .find("icon-box > i")
    .removeClass()
    .addClass(`icon-wave-f${humidityLevel} ${humidityLevel}`);

  humidityCard
    .find("p > val")
    .text(data.humidity)
    .removeClass()
    .addClass(humidityLevel);
  humidityCard
    .find("thumb")
    .width(`${data.humidity}%`)
    .removeClass()
    .addClass(`b${humidityLevel}`);

  // Update soil moisture card
  const soilMoistureLevel = determineLevel(data.soilMoisture, [60, 90]);
  soilMoistureCard
    .find("icon-box > i")
    .removeClass()
    .addClass(`icon-drop-f${soilMoistureLevel} ${soilMoistureLevel}`);
  soilMoistureCard
    .find("p > val")
    .text(data.soilMoisture)
    .removeClass()
    .addClass(soilMoistureLevel);
  soilMoistureCard
    .find("thumb")
    .width(`${data.soilMoisture}%`)
    .removeClass()
    .addClass(`b${soilMoistureLevel}`);
});

// Pump Configuration
const plantType = $("#plant-type");
const irrigationMode = $("#irrigation-mode");
const duration = $("#flow-duration");

const pumpConfig = $signal({
  type: "plant",
  irrigationMode: "drip",
  duration: "1m",
});

pumpConfig.subscribe((data) => {
  plantType.find("opt").removeClass();
  irrigationMode.find("opt").removeClass();
  duration.find("opt").removeClass();

  plantType.find(`opt[data-type="${data.type}"]`).addClass("active");
  irrigationMode
    .find(`opt[data-mode="${data.irrigationMode}"]`)
    .addClass("active");
  duration.find(`opt[data-duration="${data.duration}"]`).addClass("active");
});

// Pump Options Rendering - Provide options for the user to select
pumpOptions.type.forEach((type) => {
  plantType.append(
    option
      .clone()
      .text(type)
      .addClass(type === pumpConfig.value.type ? "active" : "")
      .attr("data-type", type)
      .on("click", () => {
        switch (type) {
          case "plant":
            pumpConfig.value.irrigationMode = "drip";
            break;
          case "tree":
            pumpConfig.value.irrigationMode = "flow";
            break;
          case "grass":
            pumpConfig.value.irrigationMode = "sprinkle";
            break;
          default:
            break;
        }
        pumpConfig.value.type = type;
      })
  );
});

pumpOptions.irrigationMode.forEach((mode) => {
  irrigationMode.append(
    option
      .clone()
      .text(mode)
      .addClass(mode === pumpConfig.value.irrigationMode ? "active" : "")
      .attr("disabled", "t")
      .attr("data-mode", mode)
  );
});

pumpOptions.duration.forEach((time) => {
  duration.append(
    option
      .clone()
      .text(time)
      .addClass(time === pumpConfig.value.duration ? "active" : "")
      .attr("data-duration", time)
      .on("click", () => (pumpConfig.value.duration = time))
  );
});

const pumpToggle = $("pump-toggle");

isPumpOn.subscribe((state) => {
  console.log(state);

  pumpToggle.attr("data-loading", "no");

  if (!state) {
    pumpToggle.find("i").removeClass().addClass("icon-play");
    pumpToggle.prop("title", "Start Pump");
    return;
  }

  pumpToggle.find("i").removeClass().addClass("icon-stop");
  pumpToggle.prop("title", "Stop Pump");
});

pumpToggle.on("click", async () => {
  pumpToggle.attr("data-loading", "yes");
  // await togglePump();
  await createPumpPromise(pumpConfig.value);
});
