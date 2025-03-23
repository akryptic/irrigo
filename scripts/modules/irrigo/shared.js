// This file has some shared states to synchronize the application with the baord
import { $signal } from "../signal.js";

// The shared states
export const isPumpOn = $signal(false);
