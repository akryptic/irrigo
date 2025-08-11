# Irrigo

ESP32-controlled irrigation system with a mobile-installable PWA. The ESP32 and client connect to a server via WebSockets, enabling real-time control from anywhere with internet access.

## Features
- Remote control of irrigation hardware.
- Real-time bidirectional communication.
- PWA for mobile and desktop.

## Architecture
```
ESP32 ⇄ WebSocket ⇄ Server ⇄ WebSocket ⇄ PWA Client
```

## Setup

### 1. Clone
```bash
git clone https://github.com/akryptic/irrigo.git
cd irrigo
```

### 2. Server
```bash
cd server
npm install
npm start
```

### 3. ESP32
- Open `/esp32` project in PlatformIO/Arduino IDE.
- Set Wi-Fi and server WebSocket URL.
- Upload to board.

### 4. Client (PWA)
```bash
cd client
npm install
npm run dev
```
Open in browser and install as PWA.

## Usage
1. Start server.
2. Power up ESP32.
3. Open PWA and control irrigation in real time.

## License
MIT
