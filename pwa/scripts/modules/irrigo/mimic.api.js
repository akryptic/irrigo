// import { notify } from "../notify.js";
// import { $signal } from "../signal.js";
// import { randomDataGenerator } from "../utils.js";

// let sensorDataInterval = null;
// export const isPumpOn = $signal(false);

// export const sensorData = $signal(randomDataGenerator());

// /**
//  * Start receiving sensor data from the server.
//  *
//  * @returns {void}
//  */
// export function startReceivingSensorData() {
//   // Simulate receiving data from the server
//   if (!sensorDataInterval) {
//     sensorDataInterval = setInterval(() => {
//       sensorData.value = randomDataGenerator();
//     }, 1200);
//   }
// }

// /**
//  * Stop receiving sensor data from the server.
//  *
//  * @returns {void}
//  */
// export function stopReceivingSensorData() {
//   if (sensorDataInterval) {
//     clearInterval(sensorDataInterval);
//     sensorDataInterval = null;
//   }
// }

// export function validateToken(token) {
//   // Validate the token before accessing the websockets API
//   // This is a placeholder function and should be implemented according to your authentication logic
//   return token === "valid-token"; // Example: replace with actual validation logic
// }

// export function togglePump(config) {
//   console.log(config);

//   return new Promise((resolve, reject) => {
//     if (isPumpOn.value) {
//       // If the pump is already on, resolve immediately
//       setTimeout(() => {
//         const success = Math.random() > 0.5; // Randomly succeed or fail
//         if (success) {
//           isPumpOn.value = false; // Toggle the pump state
//           notify.success("Pump stopped successfully");
//           resolve("Pump stopped successfully");
//         } else {
//           isPumpOn.value = true; // Toggle the pump state
//           notify.error("Failed to stop the pump");
//           reject(new Error("Failed to stop the pump"));
//         }
//       }, 1200);
//       return;
//     }

//     // Simulate a pump toggle action
//     setTimeout(() => {
//       const success = Math.random() > 0.5; // Randomly succeed or fail
//       if (success) {
//         isPumpOn.value = true; // Toggle the pump state
//         notify.success("Pump started successfully");
//         resolve("Pump start successfully");
//       } else {
//         isPumpOn.value = false; // Toggle the pump state
//         notify.error("Failed to start the pump");
//         reject(new Error("Failed to start the pump"));
//       }
//     }, 1200);
//   });
// }
