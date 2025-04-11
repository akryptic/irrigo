import{$signal,notify}from "./module.js";import{sendCommand}from "./ws.js";let _resolve;let _reject;let pumpPromise=null;export const isPumpOn=$signal(!1);export function createPumpPromise(){if(!pumpPromise){pumpPromise=new Promise((resolve,reject)=>{_resolve=resolve;_reject=reject;if(isPumpOn.value){sendCommand("pump-off")}else{sendCommand("pump-on")}})}
return pumpPromise}
export function resolvePump(result){if(_resolve){if(isPumpOn.value){isPumpOn.value=!1;notify.inform("Pump turned off successfully")}else{isPumpOn.value=!0;notify.inform("Pump turned on successfully")}
_resolve(result);pumpPromise=null}}
export function rejectPump(reason){if(_reject){isPumpOn.value=isPumpOn.value;notify.error("Board responded with a error!");_reject(reason);pumpPromise=null}}
export const sensorData=$signal({temperature:0,humidity:0,soilMoisture:0,});export function updateSensorData(data){sensorData.value=data}