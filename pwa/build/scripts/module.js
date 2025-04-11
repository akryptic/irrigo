class NotificationManager{constructor(){this.stack=document.createElement("notify-stack");document.body.appendChild(this.stack);this.notifications=new Set()}
push(type,message){const notification=document.createElement("notification");notification.className=`${type}`;notification.textContent=message;const closeButton=document.createElement("span");closeButton.className="close-btn";closeButton.innerHTML="&times;";closeButton.onclick=()=>this.remove(notification);notification.appendChild(closeButton);this.stack.appendChild(notification);this.notifications.add(notification);let timeout=setTimeout(()=>this.remove(notification),3000);notification.addEventListener("mouseenter",()=>clearTimeout(timeout));notification.addEventListener("mouseleave",()=>{timeout=setTimeout(()=>this.remove(notification),1000)});return notification}
remove(notification){if(this.notifications.has(notification)){this.notifications.delete(notification);notification.classList.add("fade-out");notification.remove()}}}
const manager=new NotificationManager();export const notify={inform:(msg)=>manager.push("inform",msg),warn:(msg)=>manager.push("warn",msg),error:(msg)=>manager.push("error",msg),success:(msg)=>manager.push("success",msg),};export class Signal{constructor(value){this._subscribers=[];this._value=this._makeReactive(value)}
get value(){return this._value}
set value(newValue){this._value=this._makeReactive(newValue);this.emit()}
emit(){this._subscribers.forEach((subscriber)=>subscriber(this._value))}
subscribe(callback){this._subscribers.push(callback)}
_makeReactive(value){if(typeof value!=="object"||value===null){return value}
return new Proxy(value,{set:(target,prop,newValue)=>{target[prop]=newValue;this.emit();return!0},})}}
export function $signal(val){return new Signal(val)}
export function createStorage(key,initialValue,options){const{callback,mode}=options;let value;value=(mode==="encoded"?JSON.parse(localStorage.getItem(key)):localStorage.getItem(key))||initialValue;const signal=$signal(value);signal.subscribe((newValue)=>{mode==="encoded"?localStorage.setItem(key,JSON.stringify(newValue)):localStorage.setItem(key,newValue);if(callback)callback(newValue);});signal.value=value;return signal}
export function initTheme(){const html=document.documentElement;const themeToggle=$("theme-toggle");let theme=createStorage("theme","dark",{callback:(newTheme)=>{html.dataset.theme=newTheme;themeToggle.removeClass(newTheme==="dark"?"icon-sun":"icon-moon");themeToggle.addClass(newTheme==="dark"?"icon-moon":"icon-sun")},mode:undefined,});themeToggle.on("click",()=>{theme.value=theme.value==="dark"?"light":"dark"})}
export function randomDataGenerator(){const randomData={temperature:Math.floor(Math.random()*100+1),humidity:Math.floor(Math.random()*100+1),soilMoisture:Math.floor(Math.random()*100+1),};return randomData}
export function determineLevel(value,range){if(value<=range[0]){return"l"}else if(value<=range[1]){return"m"}else{return"h"}}
export const pumpOptions={type:["plant","tree","grass"],irrigationMode:["flow","drip","sprinkle"],duration:["30s","1m","5m","10m","20m","30m"],};export const dataUtils={encode:(data)=>{return objectToString(data)},decode:(str)=>{return parseLightJSON(str)},};function objectToString(obj){let str="{";for(const[key,value]of Object.entries(obj)){if(typeof value==="object"){str+=`"${key}":${objectToString(value)},`}else if(typeof value==="string"){str+=`"${key}":"${value}",`}else{str+=`"${key}":${value},`}}
str=str.slice(0,-1);str+="}";return str}
function parseLightJSON(input){function convert(value){value=value.trim();if(value.startsWith("{"))return parseLightJSON(value);if(value.startsWith('"')&&value.endsWith('"'))
value=value.slice(1,-1);if(value==="true")return!0;if(value==="false")return!1;if(value==="null")return null;if(!isNaN(value)&&value!=="")return parseFloat(value);return value}
function extractPairs(str){const pairs=[];let i=0;let depth=0;let insideStr=!1;let start=0;while(i<str.length){const c=str[i];if(c==='"'){insideStr=!insideStr}else if(!insideStr){if(c==="{")depth++;else if(c==="}")depth--;else if(c===","&&depth===0){pairs.push(str.slice(start,i));start=i+1}}
i++}
if(start<str.length){pairs.push(str.slice(start))}
return pairs}
const content=input.trim().replace(/^({)|([}])$/g,"");const entries=extractPairs(content);const obj={};for(const entry of entries){const sepIndex=entry.indexOf(":");if(sepIndex===-1)continue;const rawKey=entry.slice(0,sepIndex).trim().replace(/^"|"$/g,"");const rawValue=entry.slice(sepIndex+1).trim();obj[rawKey]=convert(rawValue)}
return obj}