/**
 *  Random data generator
 *
 * @returns {{temperature: number, humidity: number, waterLevel: number}} random data object
 */
export function randomDataGenerator() {
  const randomData = {
    temperature: Math.floor(Math.random() * 100 + 1),
    humidity: Math.floor(Math.random() * 100 + 1),
    waterLevel: Math.floor(Math.random() * 100 + 1),
  };
  return randomData;
}

/**
 * Determine the level of the value based on the range
 * @param {number} value
 * @param {Array<number>} range
 *
 * @returns {"low"|"moderate"|"high"} level
 */
export function determineLevel(value, range) {
  if (value <= range[0]) {
    return "low";
  } else if (value <= range[1]) {
    return "moderate";
  } else {
    return "high";
  }
}
