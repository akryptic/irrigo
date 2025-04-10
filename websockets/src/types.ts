export type ClientRole = "board" | "web-app";

export interface BaseMessage {
  type: "init" | "sensor_data" | "command" | "cmd-res";
}

export interface InitMessage extends BaseMessage {
  type: "init";
  role: ClientRole;
}

export interface SensorDataMessage extends BaseMessage {
  type: "sensor_data";
  data: {
    moisture: number;
    temperature: number;
    humidity: number;
  };
}
export interface CommandMessage extends BaseMessage {
  type: "command";
  command: string;
}
export interface CmdRes extends BaseMessage {
  type: "cmd-res";
  payload: {
    status: boolean;
  };
}

export type IncomingMessage =
  | InitMessage
  | SensorDataMessage
  | CommandMessage
  | CmdRes;
