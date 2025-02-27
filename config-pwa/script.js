let bluetoothCharacteristic;

async function connectBluetooth() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb']
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        bluetoothCharacteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');

        document.getElementById("status").textContent = "Connected to ESP32!";
        document.getElementById("sendConfig").disabled = false;

        await bluetoothCharacteristic.startNotifications();
        bluetoothCharacteristic.addEventListener("characteristicvaluechanged", (event) => {
            let message = new TextDecoder().decode(event.target.value);
            console.log("ESP32:", message);
            if (message.includes("Restarting")) {
                alert("ESP32 is restarting. Please wait...");
            }
        });

    } catch (error) {
        console.error("Bluetooth error:", error);
        alert("Failed to connect. Try again.");
    }
}

async function sendConfig() {
    if (!bluetoothCharacteristic) return alert("Bluetooth not connected!");

    let ssid = document.getElementById("ssid").value;
    let password = document.getElementById("password").value;
    let server = document.getElementById("server").value;
    let port = document.getElementById("port").value;

    if (!ssid || !password || !server || !port) return alert("Fill in all fields!");

    let data = `${ssid},${password},${server},${port}\n`;
    let encoder = new TextEncoder();

    try {
        await bluetoothCharacteristic.writeValue(encoder.encode(data));
        alert("Configuration sent!");
    } catch (error) {
        console.error("Send error:", error);
        alert("Failed to send data.");
    }
}

document.getElementById("connectBluetooth").addEventListener("click", connectBluetooth);
document.getElementById("sendConfig").addEventListener("click", sendConfig);
