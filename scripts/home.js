import { togglePump } from "./modules/irrigo/pump.js";
import { isPumpOn } from "./modules/irrigo/shared.js";
import { $signal, Signal } from "./modules/signal.js";
import { determineLevel, randomDataGenerator } from "./modules/utils.js";

/**
 * Update the info cards with the latest data
 * @param {"tm" | "hm" | "wl"} cardType The value
 * @param {number} value The value
 * @param {number[]} range The value
 */
function updateInfoCards(cardType, value, range) {
  const icon = $(`#${cardType}-ic`);
  const val = $(`#${cardType}-val`);
  const thumb = $(`#${cardType}-th`);

  const level = determineLevel(value, range);

  switch (cardType) {
    case "tm":
      val.html(value);
      thumb
        .attr("style", `width: ${value}%`)
        .removeClass()
        .addClass(`${level}-b`);
      icon.removeClass().addClass(`icon-thermometer-${level} ${level}`);
      break;
    case "hm":
      val.html(value);
      thumb
        .attr("style", `width: ${value}%`)
        .removeClass()
        .addClass(`${level}-b`);
      icon.removeClass().addClass(`icon-wave-${level} ${level}`);
      break;
    case "wl":
      val.html(value);
      thumb
        .attr("style", `width: ${value}%`)
        .removeClass()
        .addClass(`${level}-b`);
      icon.removeClass().addClass(`icon-drop-filled-${level} ${level}`);
      break;
  }
}

const data = $signal(randomDataGenerator());
data.subscribe((val) => {
  updateInfoCards("tm", val.temperature, [13, 38]);
  updateInfoCards("hm", val.humidity, [20, 75]);
  updateInfoCards("wl", val.waterLevel, [45, 75]);
});

setInterval(() => {
  data.value = randomDataGenerator();
}, 1000);

// Pump Settings
/**
 * @typedef {Object} PumpSettings
 * @property {"flow" | "drip" | "sprinkle"} irrigationMode
 * @property {"30s"|"1m"|"5m"|"10m"|"20m"|"30m"} duration
 */

/**
 * Determine the type and set mode based on it.
 * The type of plant. (Predefined or custom)
 * @type {Signal<"tree" | "plant" | "grass" | "custom">}
 *
 */
const type = $signal("tree");
/**
 * @type {Signal<PumpSettings>}
 */
const pumpSettings = $signal({
  irrigationMode: "flow",
  duration: "30m",
});
const plantTypeButtons = $("#plant-type > button");
const irrigationModeButtons = $("#irri-mode > button");
const flowTimeButtons = $("#flow-time > button");

// Handle predefined plant types and allow for custom ones
type.subscribe((val) => {
  plantTypeButtons.removeClass("active");
  plantTypeButtons.filter(`[data-type="${val}"]`).addClass("active");

  switch (val) {
    case "tree":
      pumpSettings.value = {
        irrigationMode: "flow",
        duration: "10m",
      };
      break;
    case "plant":
      pumpSettings.value = {
        irrigationMode: "drip",
        duration: "20m",
      };
      break;
    case "grass":
      pumpSettings.value = {
        irrigationMode: "sprinkle",
        duration: "30m",
      };
      break;
    default:
      throw new Error("Invalid plant type");
  }
});

pumpSettings.subscribe((setting) => {
  irrigationModeButtons.removeClass("active");
  flowTimeButtons.removeClass("active");

  irrigationModeButtons
    .filter(`[data-mode="${setting.irrigationMode}"]`)
    .addClass("active");
  flowTimeButtons
    .filter(`[data-duration="${setting.duration}"]`)
    .addClass("active");
});

// Update the type to update UI
plantTypeButtons.on("click", (e) => {
  const newType = $(e.target).data("type");
  if (newType === type.value) return;
  type.value = newType;
});

flowTimeButtons.on("click", (e) => {
  const newDuration = $(e.target).data("duration");
  if (newDuration === pumpSettings.value.duration) return;
  pumpSettings.value.duration = newDuration;
});

// Pump TOggle
const pumpToggle = $("#pump-toggle");
const pumpToggleIcon = pumpToggle.find(">:first-child");

isPumpOn.subscribe(async (state) => {
  pumpToggle.attr("data-loading", false);
  // Actual pump to board logic

  // Update UI
  if (!state) {
    pumpToggle.removeClass();
    pumpToggleIcon.removeClass().addClass("icon-play");
    pumpToggle.prop("title", "Start Pump");
    console.log("off");
    return;
  }
  pumpToggle.addClass("active");
  pumpToggleIcon.removeClass().addClass("icon-stop");
  pumpToggle.prop("title", "Stop Pump");
  console.log("on");
});

pumpToggle.on("click", () => {
  pumpToggle.attr("data-loading", true);
  togglePump(pumpSettings.value, 3);
});
