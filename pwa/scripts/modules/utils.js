/**
 *  Random data generator
 *
 * @returns {{temperature: number, humidity: number, soilMoisture: number}} random data object
 */
export function randomDataGenerator() {
  const randomData = {
    temperature: Math.floor(Math.random() * 100 + 1),
    humidity: Math.floor(Math.random() * 100 + 1),
    soilMoisture: Math.floor(Math.random() * 100 + 1),
  };
  return randomData;
}

/**
 * Determine the level of the value based on the range
 * @param {number} value
 * @param {Array<number>} range
 *
 * @returns {"l"|"m"|"h"} level
 */
export function determineLevel(value, range) {
  if (value <= range[0]) {
    return "l";
  } else if (value <= range[1]) {
    return "m";
  } else {
    return "h";
  }
}

export const pumpOptions = {
  type: ["plant", "tree", "grass"],
  irrigationMode: ["flow", "drip", "sprinkle"],
  duration: ["30s", "1m", "5m", "10m", "20m", "30m"],
};

export const dataUtils = {
  encode: (data) => {
    return objectToString(data);
  },

  /**
   *
   * @param {string} str
   */
  decode: (str) => {
    return parseLightJSON(str);
  },
};

function objectToString(obj) {
  let str = "{";
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object") {
      str += `"${key}":${objectToString(value)},`;
    } else if (typeof value === "string") {
      str += `"${key}":"${value}",`;
    } else {
      str += `"${key}":${value},`;
    }
  }
  str = str.slice(0, -1);
  str += "}";
  return str;
}

function parseLightJSON(input) {
  function convert(value) {
    value = value.trim();
    if (value.startsWith('{')) return parseLightJSON(value); // nested object
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);

    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!isNaN(value) && value !== '') return parseFloat(value);

    return value;
  }

  function extractPairs(str) {
    const pairs = [];
    let i = 0;
    let depth = 0;
    let insideStr = false;
    let start = 0;

    while (i < str.length) {
      const c = str[i];

      if (c === '"') {
        insideStr = !insideStr;
      } else if (!insideStr) {
        if (c === '{') depth++;
        else if (c === '}') depth--;
        else if (c === ',' && depth === 0) {
          pairs.push(str.slice(start, i));
          start = i + 1;
        }
      }

      i++;
    }

    // Push the last segment
    if (start < str.length) {
      pairs.push(str.slice(start));
    }

    return pairs;
  }

  // Strip outer braces
  const content = input.trim().replace(/^({)|([}])$/g, '');
  const entries = extractPairs(content);

  const obj = {};
  for (const entry of entries) {
    const sepIndex = entry.indexOf(':');
    if (sepIndex === -1) continue;

    const rawKey = entry.slice(0, sepIndex).trim().replace(/^"|"$/g, '');
    const rawValue = entry.slice(sepIndex + 1).trim();
    obj[rawKey] = convert(rawValue);
  }

  return obj;
}
